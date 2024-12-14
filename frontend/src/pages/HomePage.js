import React from "react";
import { Box, Grid2, Typography, Card, CardActionArea, CardMedia, CardContent, Container} from "@mui/material";

const quests = [
    { id: 1, name: "Quest 1", image: "https://via.placeholder.com/400" },
    { id: 2, name: "Quest 2", image: "https://via.placeholder.com/400" },
    { id: 3, name: "Quest 3", image: "https://via.placeholder.com/400" },
    { id: 4, name: "Quest 4", image: "https://via.placeholder.com/400" },
    { id: 5, name: "Quest 5", image: "https://via.placeholder.com/400" },
    { id: 6, name: "Quest 6", image: "https://via.placeholder.com/400" },
];

const HomePage = () => {
    return(
        <Box>
            <Box sx={{ p: 2 }}>
                <Grid2 container spacing={3} justifyContent="center">
                    {quests.map((quest) => (
                        <Grid2 xs={12} sm={6} md={4} key={quest.id}>
                            <Card sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="400"
                                        image={quest.image}
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
            </Box>
        </Box>
    );
};

export default HomePage;