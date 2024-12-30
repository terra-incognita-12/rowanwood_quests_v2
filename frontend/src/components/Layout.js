import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container, Box } from "@mui/material";
import homePageImage from "../assets/navbar_image.jpg";

const Layout = () => {
    return(
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Container
                disableGutters
                maxWidth="lg"
                sx={{ 
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 40px rgba(0, 0, 0, 1)"
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: { xs: "200px", sm: "400px", md: "500px" },
                        backgroundImage: `url(${homePageImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        boxShadow: "40px 40px 40px rgba(0, 0, 0, 1)"
                    }}
                >
                    <Navbar />
                </Box>
                <Box sx={{ p: 5 }}><Outlet /></Box>     
            </Container>
        </Box>
    );
};

export default Layout;