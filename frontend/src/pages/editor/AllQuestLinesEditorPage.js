import { React, useState, useEffect } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { getQuestLines } from "../../api/questLinesApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/* 
Editor section, page all lines of the specific quest
*/
const AllQuestLinesEditorPage = () => {
    const { quest_id } = useParams();

    const [questLines, setQuestLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuestLines = async () => {
            try {
                const data = await getQuestLines(quest_id);
                setQuestLines(data);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        loadQuestLines();
    }, []);

    if (loading) return <p>Loading quests...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                <Box sx={{ display: "flex" }}>
                    <Button 
                        component={Link} 
                        to={`/editor/quest/${quest_id}`} 
                        color="inherit"  
                        variant="text"
                        sx={{ textTransform: "none" }}
                    >
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h3" sx={{ display: {xs: "none", sm: "block"} }}>Quest Lines</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Button 
                        component={Link}
                        to={`/editor/quest/${quest_id}/new-quest-line`}
                        color="inherit" 
                        variant="contained" 
                        sx={{ textTransform: "none" }}
                    >
                        New Line
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 5 }}>
                <List>
                    {questLines.map((questLine, index) => (
                        <ListItem key={index} component={Link} to={`/`}>
                            <ListItemText 
                                primary={
                                    <Typography variant="h6">
                                        {questLine.name}
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

export default AllQuestLinesEditorPage;