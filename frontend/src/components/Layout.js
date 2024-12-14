import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container, Box } from "@mui/material";

const Layout = () => {
    return(
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

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
                        backgroundImage: `url("https://via.placeholder.com/1920x500")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout;