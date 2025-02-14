import { React, useState, useEffect } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { getLibraryRecords } from "../../../api/libraryApi";

/* 
Editor section, all library records
*/
const AllLibraryRecordsEditorPage = () => {
    const [libraryRecords, setlibraryRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Search func
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadLibraryRecords = async () => {
            try {
                const data = await getLibraryRecords();
                setlibraryRecords(data);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        loadLibraryRecords();
    }, []);

    const filteredRecords = libraryRecords.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading records...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h3">Library</Typography>
                <Button 
                    component={Link} 
                    to="/editor/library/new"
                    color="inherit" 
                    variant="contained"
                    sx={{ textTransform: "none" }} 
                >
                    New Record
                </Button>
            </Box>
            <Box sx={{ mt: 5 }}>
                <TextField
                    label="Search records..."
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <List>
                    {filteredRecords.map((record, index) => (
                        <ListItem key={index} component={Link} to={`/editor/library/${record.id}`}>
                            <ListItemText 
                                primary={
                                    <Typography variant="h6">
                                        {record.name}
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

export default AllLibraryRecordsEditorPage;