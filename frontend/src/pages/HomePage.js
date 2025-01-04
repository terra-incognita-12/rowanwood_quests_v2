import React, { useEffect, useState } from "react";
import { Box, Grid2, Typography, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
import { getQuests } from "../api/questsApi";
import { backendUrl } from "../utils/config";

const HomePage = () => {
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

    return(
        <Grid2 container spacing={3} justifyContent="center">
            {quests.map((quest) => (
                <Grid2 xs={12} sm={6} md={4} key={quest.id}>
                    <Card sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="400"
                                image={quest?.photo
                                    ? `${backendUrl}${quest?.photo}`
                                    : "https://via.placeholder.com/400x400"
                                }
                                alt={quest.name}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div" align="center">
                                    {quest.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );
};

export default HomePage;