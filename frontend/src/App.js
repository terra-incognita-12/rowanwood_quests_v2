import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
    typography: {
        allVariants: {
            color: "#FFD700",
        },
        fontFamily: '"Courier New", Courier, monospace'
    },
});

const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
