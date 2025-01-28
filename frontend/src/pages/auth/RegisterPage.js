import { React, useState } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirm_password: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        username: "",
        password: "",
        confirm_password: "",
    });

    const validateField = (name, value) => {
        switch (name) {
            case "email":
                if (!value) return "Email is Required.";
                if (!EMAIL_REGEX.test(value)) return "Enter valid email";
                break;
            case "username":
                if (!value) return "Username is Required.";
                if (!USERNAME_REGEX.test(value)) return "Must start with the lower or upper case letter and after must followed by 3 to 23 char that can be lowercase, upper, number, - and _";
                break;
            case "password":
                if (!value) return "Password is Required.";
                if (!PASS_REGEX.test(value)) return "Must be at least one lowercase letter, one uppercase letter, one digit, and one special character and size is 8 to 24"
                break;
            case "confirm_password":
                if (!value) return "Confirmation password is Required.";
                if (value !== formData.password) return "Passwords do not match";
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
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button 
                    component={Link} 
                    to="/login" 
                    color="inherit" 
                    variant="text"
                    sx={{ textTransform: "none" }}
                >
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h3">Sign Up</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    error={!!formErrors.confirm_password}
                    helperText={formErrors.confirm_password || ""}
                    fullWidth
                    required
                />
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

export default RegisterPage;