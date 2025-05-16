import { React, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import { getLibraryRecord } from "../api/libraryApi";
import { backendUrl } from "../utils/config";

const LibraryRecordPage = () => {
    const { id } = useParams();
    
    // Loading and Error while pulling record from the DB
    const [loadingGetRecord, setLoadingGetRecord] = useState(true);
    const [errorGetRecord, setErrorGetRecord] = useState(null);
    
    // Quest pulled from DB
    const [libraryRecord, setLibraryRecord] = useState();

    // Pulling record from the DB
    useEffect(() => {
        const loadRecord = async () => {
            try {
                const data = await getLibraryRecord(id);
                setLibraryRecord(data);
            } catch (err) {
                setErrorGetRecord(err.message || "Something went wrong!");
            } finally {
                setLoadingGetRecord(false);
            }
        };

        loadRecord();
    }, [id]);

    if (loadingGetRecord) return <p>Loading record...</p>;
    if (errorGetRecord) return <p>{errorGetRecord}</p>;

    return (
        <Box>
            <Box sx={{ display: "flex" }}>
                <Button 
                    component={Link} 
                    to="/library" 
                    color="inherit"  
                    variant="text"
                    sx={{ textTransform: "none" }}
                >
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h3" sx={{ display: {xs: "none", sm: "block"} }}>{libraryRecord?.name}</Typography>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%", maxWidth: "800px", margin: "0 auto", mt: 5 }}>
                <img
                    src={libraryRecord?.photo
                            ? `${backendUrl}/${libraryRecord?.photo}`
                            : "https://placehold.co/800"
                    }
                    alt="Record"
                    style={{ 
                        width: "100%",
                        height: "auto", 
                        objectFit: "cover", 
                        borderRadius: "25px" 
                    }}
                />
            </Box>
            <Box sx={{ mt: 5 }}>
                <Typography variant="body1" >{libraryRecord?.description}</Typography>
            </Box>
        </Box>
    );
};

export default LibraryRecordPage;