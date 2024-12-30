import { React, useState } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2 } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const URL_REGEX = /^[a-z][a-zA-Z0-9-_]{3,255}$/
const PHOTO_REGEX = /\.(jpg|jpeg)$/

/* 
Editor section, create new quest
*/
const CreateQuestPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        telegram_url: "",
        description: "",
        photo: null,
    });

    const [errors, setErrors] = useState({
        name: "",
        telegram_url: "",
        description: "",
        photo: "",
    });

    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // name is more than 50 symbols
        if (name === "name" && value.length > 50) {
            setErrors((prev) => ({
                ...prev,
                name: "Max 50 character allowed.",
            }));
        // name is less than 3 symbols
        } else if (name === "name" && value.length < 3) {
            setErrors((prev) => ({
                ...prev,
                name: "Min 3 character allowed.",
            }));
        } else if (name === "telegram_url" && !URL_REGEX.test(value)) {
            setErrors((prev) => ({
                ...prev,
                telegram_url: "Only latin letters, underscores, min 3 character, max 255 character"
            }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file && !file.name.match(PHOTO_REGEX)) {
            setErrors((prev) => ({ ...prev, photo: "Only .jpeg or .jpg files are allowed." }));
        } else if (file && file.size > 2097152) {
            setErrors((prev) => ({ ...prev, photo: "Photo size is too big"}));
        } else {
            setErrors((prev) => ({ ...prev, photo: "" }));
            setFormData((prev) => ({ ...prev, photo: file }));
            setIsPhotoUploaded(true);
        }
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <Box>
            <Box sx={{ display: "flex" }}>
                <Button component={Link} to="/editor/quests" color="inherit" sx={{ textTransform: "none" }} variant="text"><ArrowBackIcon /></Button>
                <Typography variant="h3">New Quest</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Quest Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name || ""}
                    // inputProps={{ maxLength: 50 }}
                    fullWidth
                    required
                />
                <TextField
                    label="Telegram URL"
                    name="telegram_url"
                    value={formData.telegram_url}
                    onChange={handleChange}
                    error={!!errors.telegram_url}
                    helperText={errors.telegram_url || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                />
                <Grid2 spacing={2} container>
                    <Grid2 xs={12} md={6}>
                        <Button variant="contained" component="label" color="inherit" sx={{ textTransform: "none" }}>
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
                {errors.photo && <Box sx={{ color: "red"}}>{errors.photo}</Box>}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button type="submit" variant="contained" color="inherit" sx={{ textTransform: "none", width: "100%" }}>
                        <Typography variant="h5">Submit</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateQuestPage;