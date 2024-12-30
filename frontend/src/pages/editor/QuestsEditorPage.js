import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import useQuests from "../../hooks/useQuests";

/* 
Editor section, page with all quests
*/
const QuestsEditorPage = () => {
    const { quests, loading, error } = useQuests();

    if (loading) return <p>Loading quests...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h3">Quests</Typography>
                <Button component={Link} to="/editor/quests/new" color="inherit" sx={{ textTransform: "none" }} variant="contained">New Quest</Button>
            </Box>
            <Box sx={{ mt: 5 }}>
                <List>
                    {quests.map((quest, index) => (
                        <ListItem key={index} component={Link} to="/">
                            <ListItemText 
                                primary={
                                    <Typography variant="h6">
                                        {quest.name}
                                    </Typography>
                                } 
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default QuestsEditorPage;