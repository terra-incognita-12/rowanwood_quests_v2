import { React, useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useParams } from "react-router-dom";
import { getLibraryRecord, updateLibraryRecord, deleteLibraryRecord, deleteLibraryRecordPhoto } from "../../../api/libraryApi";
import { redirectTo } from "../../../utils/navigations";
import { backendUrl } from "../../../utils/config";

const PHOTO_REGEX = /\.(jpg|jpeg)$/

/* 
Editor section, edit or delete library record
*/
const LibraryRecordEditorPage = () => {
    const { id } = useParams();
    
    // Loading and Error while pulling record from the DB
    const [loadingGetRecord, setLoadingGetRecord] = useState(true);
    const [errorGetRecord, setErrorGetRecord] = useState(null);

    // Loading and Error while submitting changes to the record
    const [loadingUpdateRecord, setLoadingUpdateRecord] = useState(false);
    const [errorUpdateRecord, setErrorUpdateRecord] = useState(null);
    
    // Quest pulled from DB
    const [libraryRecord, setLibraryRecord] = useState();

    // Original values before change. Photo should be null, because it will be only triggered on change to not null
    const [initialFormData, setInitialFormData] = useState({
        name: "",
        description: "",
        photo: null,
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        photo: null,
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        description: "",
        photo: "",
    });

    // State to check if photo uploaded and valid to show current loaded photo before submit
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

    // Pulling record from the DB
    useEffect(() => {
        const loadRecord = async () => {
            try {
                const data = await getLibraryRecord(id);
                setLibraryRecord(data);
                setInitialFormData({
                    name: data.name || "",
                    description: data.description || "",
                    photo: null,
                });
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    photo: null,
                });
            } catch (err) {
                setErrorGetRecord(err.message || "Something went wrong!");
            } finally {
                setLoadingGetRecord(false);
            }
        };

        loadRecord();
    }, [id]);

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value) return "Record Name is Required.";
                if (value.length > 50) return "Max 50 character allowed.";
                if (value.length < 3) return "Min 3 character allowed.";
                break;
            case "description":
                if (!value) return "Description is Required.";
                break;
            case "photo":
                if(value && !value.name.match(PHOTO_REGEX)) return "Only .jpeg or .jpg files are allowed.";
                if(value && value.size > 2097152) return "Value size is too big.";
                break;
            default:
                return null;
        }
        return null;
    };

    // inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        const error = validateField(name, value);
        setFormErrors((prev) => ({ ...prev, [name]: error }));

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // handleChange for photo
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        const error = validateField("photo", file);
        setFormErrors((prev) => ({ ...prev, photo: error }));
        if (!error) {
            setFormData((prev) => ({ ...prev, photo: file }));
            setIsPhotoUploaded(true);
        }   
    };

    // Clean photo 
    const handleCleanPhoto = (e) => {
        e.target.value = "";
    };

    const handleRemovePhoto = (e) => {
        setFormData((prev) => ({
            ...prev,
            photo: null,
        }));
        setIsPhotoUploaded(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If no changes done, don't submit 
        if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            alert("No changes detected.");
            return;
        }

        if (!window.confirm("Are you sure you want to commit changes?")) return;

        // Validate before submit
        const newErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== initialFormData[key]) {
                // Append the photo file
                if (key === "photo" && formData[key] instanceof File) {
                    formDataToSend.append(key, formData[key]);
                // Append other fields
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });

        try {
            setLoadingUpdateRecord(true);
            setErrorUpdateRecord(null);
            const response = await updateLibraryRecord(formDataToSend, id);
            
            // Update quest state
            const updatedRecord = response.data;
            setLibraryRecord(updatedRecord);
            // Sync initialFormData with updated data
            setInitialFormData({ 
                name: updatedRecord.name, 
                description: updatedRecord.description, 
                photo: updatedRecord.photo 
            });
            alert("Changes saved successfully!");
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setErrorUpdateRecord(errorDetail || "Something went wrong!");
            } else { 
                setErrorUpdateRecord("Failed to connect to the server, please try again.");
            }
        } finally {
            setLoadingUpdateRecord(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!libraryRecord?.photo) {
            alert("No photo to delete");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this photo?")) return;
        
        try {
            setLoadingUpdateRecord(true);
            setErrorUpdateRecord(null);
            const response = await deleteLibraryRecordPhoto(id);
            setLibraryRecord((prev) => ({
                ...prev,
                photo: null,
            }));
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setErrorUpdateRecord(errorDetail || "Something went wrong!");
            } else { 
                setErrorUpdateRecord("Failed to connect to the server, please try again.");
            }
        } finally {
            setErrorUpdateRecord(false);
        }
    };

    const handleDeleteRecord = async () => {
        if (!window.confirm("Are you sure you want to delete this library record?")) return;
        if (!window.confirm("Just double check, record will be deleted...ARE YOU SURE??")) return;
        
        try {
            const response = await deleteLibraryRecord(id);
            redirectTo("/editor/library");
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setErrorUpdateRecord(errorDetail || "Something went wrong!");
            } else { 
                setErrorUpdateRecord("Failed to connect to the server, please try again.");
            }
        }
    };

    if (loadingGetRecord) return <p>Loading record...</p>;
    if (errorGetRecord) return <p>{errorUpdateRecord}</p>;

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                <Box sx={{ display: "flex" }}>
                    <Button 
                        component={Link} 
                        to="/editor/library" 
                        color="inherit"  
                        variant="text"
                        sx={{ textTransform: "none" }}
                    >
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h3" sx={{ display: {xs: "none", sm: "block"} }}>Edit Record</Typography>
                </Box>
                <Button 
                    color="error" 
                    variant="contained"
                    onClick={handleDeleteRecord}
                    sx={{ textTransform: "none" }}
                >
                    Delete Record
                </Button>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
                <img
                    src={libraryRecord?.photo
                            ? `${backendUrl}${libraryRecord?.photo}`
                            : "https://placehold.co/800"
                    }
                    alt="Record"
                    style={{ 
                        width: "100%",
                        height: "auto", 
                        objectFit: "cover", 
                        borderRadius: "25px" 
                    }}
                />
            </Box>
            <Box sx={{ textAlign: "center", width: "100%", justifyContent: "space-around", mt: 3}}>
                <Button 
                    color="error" 
                    variant="contained"
                    onClick={handleDeletePhoto}
                    sx={{ textTransform: "none", width: "50%" }}
                >
                    Delete Image
                </Button>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {errorUpdateRecord && <Alert severity="error">{errorUpdateRecord}</Alert>}
                
                <TextField
                    label="Quest Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={!!formErrors.description}
                    helperText={formErrors.description || ""}
                    multiline
                    rows={10}
                    fullWidth
                    required
                />
                <Grid2 spacing={2} container>
                    <Grid2 xs={12} md={6}>
                        <Button 
                            variant="contained" 
                            component="label" 
                            color="inherit" 
                            sx={{ textTransform: "none" }}
                        >
                            Upload Photo
                            <input
                                type="file"
                                accept=".jpeg,.jpg"
                                onChange={handlePhotoUpload}
                                onClick={handleCleanPhoto}
                                hidden
                            />
                        </Button>
                    </Grid2>
                    {isPhotoUploaded && (
                        <Grid2 xs={12} md={6}>
                            <Stack spacing={1} direction="row">
                                <Typography gutterBottom variant="overline">{formData.photo.name}</Typography>
                                <IconButton edge="end" color="error" onClick={handleRemovePhoto}>
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        </Grid2>
                    )}
                </Grid2>
                {formErrors.photo && <Box sx={{ color: "red"}}>{formErrors.photo}</Box>}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="inherit" 
                        sx={{ textTransform: "none", width: "100%" }}
                    >
                        <Typography variant="h5">Submit</Typography>
                    </Button>
                </Box>
                {loadingUpdateRecord && <p>Submitting...</p>}
            </Box>
        </Box>
    );
};

export default LibraryRecordEditorPage;