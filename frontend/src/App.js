import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import QuestsEditorPage from "./pages/editor/QuestsEditorPage";
import CreateQuestPage from "./pages/editor/CreateQuestPage";

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
                        <Route path="/editor/quests" element={<QuestsEditorPage />} />
                        <Route path="/editor/quests/new" element={<CreateQuestPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
