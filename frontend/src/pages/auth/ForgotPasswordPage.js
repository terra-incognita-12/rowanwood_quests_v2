import { React, useState } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
    });

    // inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                <Typography variant="h3">Forgot Password</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />
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

export default ForgotPasswordPage;