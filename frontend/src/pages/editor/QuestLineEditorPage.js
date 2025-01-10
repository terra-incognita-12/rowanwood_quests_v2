import { React, useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Grid2, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import { getQuestLine, getQuestLines, updateQuestLine, deleteQuestLine } from "../../api/questLinesApi";
import { redirectTo } from "../../utils/navigations";

const DIGIT_REGEX = /^\d+$/

/* 
Editor section, create new quest line
*/
const QuestLineEditorPage = () => {
    const { quest_id, questLine_id } = useParams(); 

    const [questLines, setQuestLines] = useState([]);
    const [questLine, setQuestLine] = useState([]);

    // Loading and Error while pulling quest line from the DB
    const [loadingGetQuestLine, setLoadingGetQuestLine] = useState(false);
    const [errorGetQuestLine, setErrorGetQuestLine] = useState(null);

    // Loading and Error while submitting changes to the quest line
    const [loadingUpdateQuestLine, setLoadingUpdateQuestLine] = useState(false);
    const [errorUpdateQuestLine, setErrorUpdateQuestLine] = useState(null);

    const [initialFormData, setInitialFormData] = useState({
        name: "",
        order_number: "",
        description: ""
    });

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

    const [initialOptions, setInitialOptions] = useState([]);
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
        const loadQuestLine = async () => {
            try {
                const data = await getQuestLine(quest_id, questLine_id);
                setQuestLine(data);
                console.log(data);
                setInitialFormData({
                    name: data.name || "",
                    order_number: data.order_number || "",
                    description: data.description || "",
                });
                setFormData({
                    name: data.name || "",
                    order_number: data.order_number || "",
                    description: data.description || "",
                });
                if (data.quest_line_options && data.quest_line_options.length > 0) {
                    const formOptions = data.quest_line_options.map((option) => ({
                        id: Math.random(),
                        dropdownValue: option.next_quest_line_id || "",
                        textValue: option.description,
                    }));
                    setInitialOptions(formOptions);
                    setOptions(formOptions);
                }
            } catch (err) {
                setErrorGetQuestLine(err.message || "Something went wrong!");
            } finally {
                setLoadingGetQuestLine(false);
            }
        };

        const loadQuestLines = async () => {
            try {
                const data = await getQuestLines(quest_id);
                setQuestLines(data);
            } catch (err) {
                setErrorGetQuestLine(err.message || "Something went wrong!");
            } finally {
                setLoadingGetQuestLine(false);
            }
        };
        
        loadQuestLine();
        loadQuestLines();
    }, [quest_id, questLine_id]);


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

        if (JSON.stringify(options) === JSON.stringify(initialOptions) && JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            alert("No changes detected.");
            return;
        }

        if (!window.confirm("Are you sure you want to commit changes?")) return;

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

        const formDataToSend = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== initialFormData[key]) {
                formDataToSend[key] = formData[key];
            }
        });

        const optionsUpdated = [];
        if (JSON.stringify(options) !== JSON.stringify(initialOptions)) {
            options.forEach((option) => {
                optionsUpdated.push({
                    description: option.textValue,
                    next_quest_line_id: option.dropdownValue,
                });
            });
            formDataToSend["quest_line_options"] = optionsUpdated;
        }

        try {
            setLoadingUpdateQuestLine(true);
            setErrorUpdateQuestLine(null);
            const response = await updateQuestLine(formDataToSend, quest_id, questLine_id);
            redirectTo(`/editor/quest/${quest_id}/quest-lines`);
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setErrorUpdateQuestLine(errorDetail || "Something went wrong!");
            } else {
                setErrorUpdateQuestLine("Failed to connect to the server, please try again.");
            }
        } finally {
            setLoadingUpdateQuestLine(false);
        }

        return;
    };
    
    const handleDeleteLine = async () => {
        if (!window.confirm("Are you sure you want to delete this quest line?")) return;

        try {
            const response = await deleteQuestLine(questLine_id);
            redirectTo(`/editor/quest/${quest_id}/quest-lines`);         
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setErrorUpdateQuestLine(errorDetail || "Something went wrong!");
            } else { 
                setErrorUpdateQuestLine("Failed to connect to the server, please try again.");
            }
        } finally {
            setLoadingUpdateQuestLine(false);
        }
    };

    if (loadingGetQuestLine) return <p>Loading quest...</p>;
    if (errorGetQuestLine) return <p>{errorGetQuestLine}</p>;

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                <Box sx={{ display: "flex" }}>
                    <Button 
                        component={Link} 
                        to={`/editor/quest/${quest_id}/quest-lines`}
                        color="inherit"  
                        variant="text"
                        sx={{ textTransform: "none" }}
                    >
                        <ArrowBackIcon />
                    </Button>
                    <Typography variant="h3" sx={{ display: {xs: "none", sm: "block"} }}>Edit Quest Line</Typography>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <Button 
                        color="error" 
                        variant="contained"
                        onClick={handleDeleteLine}
                        sx={{ textTransform: "none" }}
                    >
                        Delete Quest Line
                    </Button>
                </Box>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
                {errorUpdateQuestLine && <Alert severity="error">{errorUpdateQuestLine}</Alert>}
                
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
                                required
                            >
                                <option value="">Select an option</option>
                                {questLines.map((questLine) => (
                                    <option key={questLine.id} value={questLine.id}>({questLine.order_number}) - {questLine.name}</option>
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
                {loadingUpdateQuestLine && <p>Submitting...</p>}
            </Box>
        </Box>
    );
};

export default QuestLineEditorPage;