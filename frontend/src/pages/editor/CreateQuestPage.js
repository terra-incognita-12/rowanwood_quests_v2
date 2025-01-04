import { React, useState } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { createQuest } from "../../api/questsApi";
import { redirectTo } from "../../utils/navigations";

const URL_REGEX = /^[a-z][a-zA-Z0-9-_]{3,255}$/
const PHOTO_REGEX = /\.(jpg|jpeg)$/

/* 
Editor section, create new quest
*/
const CreateQuestPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSend.append(key, value);
        });

        try {
            setLoading(true);
            setError(null);
            const response = await createQuest(formDataToSend);
            redirectTo("/editor/quests");
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setError(errorDetail || "Something went wrong!");
            } else {
                setError("Failed to connect to the server, please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button 
                    component={Link} 
                    to="/editor/quests" 
                    color="inherit" 
                    variant="text"
                    sx={{ textTransform: "none" }}
                >
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h3">New Quest</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                
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
                    rows={4}
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
                {loading && <p>Submitting...</p>}
            </Box>
        </Box>
    );
};

export default CreateQuestPage;