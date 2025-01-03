import { React, useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useParams } from "react-router-dom";
import { getQuest } from "../../api/questsApi";

const URL_REGEX = /^[a-z][a-zA-Z0-9-_]{3,255}$/
const PHOTO_REGEX = /\.(jpg|jpeg)$/

/* 
Editor section, create new quest
*/
const QuestEditorPage = () => {
    const { id } = useParams();
    
    // Loading and Error while pulling quest from the DB
    const [loadingGetQuest, setLoadingGetQuest] = useState(true);
    const [errorGetQuest, setErrorGetQuest] = useState(null);

    // Loading and Error while submitting changes to the quest
    const [loadingUpdateQuest, setLoadingUpdateQuest] = useState(false);
    const [errorUpdateQuest, setErrorUpdateQuest] = useState(null);
    
    // Quest pulled from DB
    const [quest, setQuest] = useState();

    const [formData, setFormData] = useState({
        name: "",
        telegram_url: "",
        description: "",
        photo: null,
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        telegram_url: "",
        description: "",
        photo: "",
    });

    // State to check if photo uploaded and valid to show current loaded photo before submit
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Pulling quest from the DB
    useEffect(() => {
        const loadQuest = async () => {
            try {
                const data = await getQuest(id);
                setQuest(data);

                setFormData({
                    name: data.name || "",
                    telegram_url: data.telegram_url || "",
                    description: data.description || "",
                    photo: null,
                });
            } catch (err) {
                setErrorGetQuest(err.message || "Something went wrong!");
            } finally {
                setLoadingGetQuest(false);
            }
        };

        loadQuest();
    }, [id]);

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value) return "Quest Name is Required.";
                if (value.length > 50) return "Max 50 character allowed.";
                if (value.length < 3) return "Min 3 character allowed.";
                break;
            case "telegram_url":
                if (!value) return "Telegram URL is Required.";
                if (value.length > 255) return "Max 255 character allowed.";
                if (!URL_REGEX.test(value)) return "Only latin letters, underscores, min 3 character, max 255 character.";
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
    };

    if (loadingGetQuest) return <p>Loading quest...</p>;
    if (errorGetQuest) return <p>{errorGetQuest}</p>;

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                <Box sx={{ display: "flex" }}>
                    <Button 
                        component={Link} 
                        to="/editor/quests" 
                        color="inherit"  
                        variant="text"
                        sx={{ textTransform: "none" }}
                    >
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h3" sx={{ display: {xs: "none", sm: "block"} }}>Edit Quest</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Button color="inherit" variant="contained" sx={{ textTransform: "none" }}>Edit Lines</Button>
                    <Button color="error" variant="contained" sx={{ textTransform: "none" }}>Delete Quest</Button>
                </Box>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
                <img
                    src={quest?.photo
                            ? `${backendUrl}${quest?.photo}`
                            : "https://via.placeholder.com/800x800"
                    }
                    alt="Quest"
                    style={{ 
                        width: "100%",
                        height: "auto", 
                        objectFit: "cover", 
                        borderRadius: "25px" 
                    }}
                />
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {errorUpdateQuest && <Alert severity="error">{errorUpdateQuest}</Alert>}
                
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
                    label="Telegram URL"
                    name="telegram_url"
                    value={formData.telegram_url}
                    onChange={handleChange}
                    error={!!formErrors.telegram_url}
                    helperText={formErrors.telegram_url || ""}
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
                {loadingUpdateQuest && <p>Submitting...</p>}
            </Box>
        </Box>
    );
};

export default QuestEditorPage;