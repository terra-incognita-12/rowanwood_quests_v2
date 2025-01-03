import { React, useState, useEffect } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { getQuests } from "../../api/questsApi";

/* 
Editor section, page with all quests
*/
const AllQuestsEditorPage = () => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuests = async () => {
            try {
                const data = await getQuests();
                setQuests(data);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        loadQuests();
    }, []);

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
                        <ListItem key={index} component={Link} to={`/editor/quest/${quest.id}`}>
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

export default AllQuestsEditorPage;