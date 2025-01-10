import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";

// Editor: Quests
import QuestEditorPage from "./pages/editor/quests/QuestEditorPage";
import AllQuestsEditorPage from "./pages/editor/quests/AllQuestsEditorPage";
import CreateQuestPage from "./pages/editor/quests/CreateQuestPage";

// Editor: Quest Lines
import QuestLineEditorPage from "./pages/editor/questLines/QuestLineEditorPage";
import AllQuestLinesEditorPage from "./pages/editor/questLines/AllQuestLinesEditorPage";
import CreateQuestLinePage from "./pages/editor/questLines/CreateQuestLinePage";

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
                        
                        <Route path="/editor/quest/:id" element={<QuestEditorPage />} />
                        <Route path="/editor/quests" element={<AllQuestsEditorPage />} />
                        <Route path="/editor/quests/new" element={<CreateQuestPage />} />
                        
                        <Route path="/editor/quest/:quest_id/quest-lines" element={<AllQuestLinesEditorPage />} />
                        <Route path="/editor/quest/:quest_id/new-quest-line" element={<CreateQuestLinePage />} />
                        <Route path="/editor/quest/:quest_id/quest-lines/:questLine_id" element={<QuestLineEditorPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
