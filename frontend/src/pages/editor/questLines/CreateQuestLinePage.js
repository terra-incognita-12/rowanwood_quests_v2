import { React, useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import { createQuestLine, getQuestLines } from "../../../api/questLinesApi";
import { redirectTo } from "../../../utils/navigations";

const DIGIT_REGEX = /^\d+$/

/* 
Editor section, create new quest line
*/
const CreateQuestLinePage = () => {
    const { quest_id } = useParams(); 

    const [questLines, setQuestLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        order_number: "",
        description: "",
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        order_number: "",
        description: "",
    });

    const [options, setOptions] = useState([]);

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value) return "Quest Line Name is Required.";
                if (value.length > 50) return "Max 50 character allowed.";
                if (value.length < 3) return "Min 3 character allowed.";
                break;
            case "order_number":
                if (!value) return "Order number is Required.";
                if (!DIGIT_REGEX.test(value)) return "Only number is allowed";
                if (parseInt(value, 10) < 0) return "Only number that grater or equal 0 is allowed";
                if (value.length > 6) return "Max 6 digit number is allowed.";
                break;
            case "description":
                if (!value) return "Description is Required.";
                break;
            default:
                return null;
        }
        return null;
    };

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
    }, [quest_id]);

    // inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        const error = validateField(name, value);
        setFormErrors((prev) => ({ ...prev, [name]: error }));

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Options
    const handleAddOption = (e) => {
        setOptions((prevOptions) => [
            ...prevOptions,
            { id: Math.random(), dropdownValue: "", textValue: "" },
        ]);
    };

    const handleDeleteOption = (id) => {
        setOptions((prevOptions) => prevOptions.filter((option) => option.id !== id));
    };

    const handleOptionChange = (id, field, value) => {
        setOptions((prevOptions) => 
            prevOptions.map((option) => 
                option.id === id ? { ...option, [field]: value } : option
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate before submit
        const newErrors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        const optionsToSend = [];
        options.forEach((option) => {
            if (option) optionsToSend.push({
                "description": option.textValue,
                "next_quest_line_id": option.dropdownValue || null, 
            })
        });

        const formDataToSend = JSON.stringify({...formData, "quest_line_options": optionsToSend});

        try {
            setLoading(true);
            setError(null);
            const response = await createQuestLine(formDataToSend, quest_id);
            redirectTo(`/editor/quest/${quest_id}/quest-lines`);
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setError(errorDetail || "Something went wrong!");
            } else {
                setError("Failed to connect to the server, please try again.");
            }
        } finally {
            setLoading(false);
        }

        return;
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button 
                    component={Link} 
                    to={`/editor/quest/${quest_id}/quest-lines`} 
                    color="inherit" 
                    variant="text"
                    sx={{ textTransform: "none" }}
                >
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h3">New Quest Line</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                
                <TextField
                    label="Quest Line Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Order Number"
                    name="order_number"
                    value={formData.order_number}
                    onChange={handleChange}
                    error={!!formErrors.order_number}
                    helperText={formErrors.order_number || ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={!!formErrors.description}
                    helperText={formErrors.description || ""}
                    multiline
                    rows={4}
                    fullWidth
                    required
                />

                <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleAddOption}
                    sx={{ textTransform: "none", width: "50%" }}
                >
                    Add option
                </Button>

                {options.map((option) => (
                    <Box
                        key={option.id}
                        sx={{ border: "1px solid white", padding: 2, borderRadius: 2, mt: 2 }}
                    >
                    <Grid2 spacing={2} container alignItems="center">
                        <Grid2 size={10}>
                            <TextField
                                select
                                label="Select an option"
                                slotProps={{
                                    select: {
                                    native: true,
                                    },
                                }}
                                variant="outlined"
                                fullWidth
                                value={option.dropdownValue}
                                onChange={(e) =>
                                    handleOptionChange(option.id, "dropdownValue", e.target.value)
                                }
                            >
                                <option value="">Select an option</option>
                                {questLines.map((questLine) => (
                                    <option value={questLine.id}>({questLine.order_number}) - {questLine.name}</option>
                                ))}
                            </TextField>
                       </Grid2>
                       <Grid2 size={2}>
                            <Button
                                fullWidth
                                color="error"
                                variant="contained"
                                onClick={() => handleDeleteOption(option.id)}
                                sx={{ textTransform: "none" }}
                            >
                                Delete option
                            </Button>
                        </Grid2>
                    </Grid2>
                    <TextField
                        label="Option Text"
                        fullWidth
                        value={option.textValue}
                        onChange={(e) =>
                            handleOptionChange(option.id, "textValue", e.target.value)
                        }
                        sx={{ mt: 2 }}
                        required
                    />
                    </Box>
                ))}
                {formErrors.photo && <Box sx={{ color: "red"}}>{formErrors.photo}</Box>}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="inherit" 
                        sx={{ textTransform: "none", width: "100%" }}
                    >
                        <Typography variant="h5">Submit</Typography>
                    </Button>
                </Box>
                {loading && <p>Submitting...</p>}
            </Box>
        </Box>
    );
};

export default CreateQuestLinePage;