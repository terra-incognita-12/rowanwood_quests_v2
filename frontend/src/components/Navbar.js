import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

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
                    <Button component={Link} to="/" color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Home</Button>
                    <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Library</Button>
                    <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">About</Button>
                    <Button color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Contact Us</Button>
                </Box>
                <Button component={Link} to="/editor/quests" color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Quests (test)</Button>
                <Button component={Link} to="/login" color="inherit" sx={{ textTransform: "none" }} className="navbar-button">Login</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;