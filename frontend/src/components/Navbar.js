import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Navbar = () => {
    return (
        <AppBar 
            position="static" 
            sx={{ 
                flex: 1,
                boxShadow: "10px 10px 10px rgba(0, 0, 0, 1)"
            }}
        >
            <Toolbar>
                <Box sx={{ display: "flex", flexGrow: 1 }}>
                    <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Home</Button>
                    <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Library</Button>
                    <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">About</Button>
                </Box>
                <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Login</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;