import { React, useState, useEffect } from "react";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { getQuestLines } from "../../../api/questLinesApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/* 
Editor section, all lines of the specific quest
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
                console.log(data);
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
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5">
                                        Quest Line Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h5">
                                        Order Number
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h5">
                                        Next Line(s)
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questLines.map((questLine, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Typography component={Link} to={`/editor/quest/${quest_id}/quest-lines/${questLine.id}`} variant="h6">
                                            {questLine.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">
                                            {questLine.order_number}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">
                                        {questLine.quest_line_options && questLine.quest_line_options.length > 0
                                            ? questLine.quest_line_options.map((option, index) => (
                                                <span key={index}>{option.description}</span>
                                            ))
                                            : "Need to add options"
                                        }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AllQuestLinesEditorPage;