import { React, useState } from "react";
import { Box, Typography, Button, TextField, Stack, IconButton, Grid2, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                <Box sx={{ display: "flex" }}>
                    <Typography variant="h3">Sign In</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Button 
                        component={Link}
                        to="/register"
                        color="inherit" 
                        variant="contained" 
                        sx={{ textTransform: "none" }}
                    >
                        Sign Up
                    </Button>
                    <Button 
                        component={Link}
                        to="/forgot_password"
                        color="inherit" 
                        variant="contained" 
                        sx={{ textTransform: "none" }}
                    >
                        Forgot Password
                    </Button>
                </Box>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
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

export default LoginPage;