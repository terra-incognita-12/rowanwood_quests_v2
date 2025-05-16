import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import AllLibraryRecordsPage from "./pages/AllLibraryRecordsPage";
import LibraryRecordPage from "./pages/LibraryRecordPage";

// Auth
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Editor: Quests
import QuestEditorPage from "./pages/editor/quests/QuestEditorPage";
import AllQuestsEditorPage from "./pages/editor/quests/AllQuestsEditorPage";
import CreateQuestPage from "./pages/editor/quests/CreateQuestPage";

// Editor: Quest Lines
import QuestLineEditorPage from "./pages/editor/questLines/QuestLineEditorPage";
import AllQuestLinesEditorPage from "./pages/editor/questLines/AllQuestLinesEditorPage";
import CreateQuestLinePage from "./pages/editor/questLines/CreateQuestLinePage";

// Editor: Library
import LibraryRecordEditorPage from "./pages/editor/library/LibraryRecordEditorPage";
import AllLibraryRecordsEditorPage from "./pages/editor/library/AllLibraryRecordsEditorPage";
import CreateLibraryRecord from "./pages/editor/library/CreateLibraryRecord";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
    typography: {
        allVariants: {
            color: "white",
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
                        
                        <Route path="/library" element={<AllLibraryRecordsPage />} />
                        <Route path="/library/:id" element={<LibraryRecordPage />} />

                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot_password" element={<ForgotPasswordPage />} />

                        <Route path="/editor/quest/:id" element={<QuestEditorPage />} />
                        <Route path="/editor/quests" element={<AllQuestsEditorPage />} />
                        <Route path="/editor/quests/new" element={<CreateQuestPage />} />
                        
                        <Route path="/editor/quest/:quest_id/quest-lines" element={<AllQuestLinesEditorPage />} />
                        <Route path="/editor/quest/:quest_id/new-quest-line" element={<CreateQuestLinePage />} />
                        <Route path="/editor/quest/:quest_id/quest-lines/:questLine_id" element={<QuestLineEditorPage />} />

                        <Route path="/editor/library/:id" element={<LibraryRecordEditorPage />} />
                        <Route path="/editor/library" element={<AllLibraryRecordsEditorPage />} />
                        <Route path="/editor/library/new" element={<CreateLibraryRecord />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
