import { useState } from "react";
import { createQuest } from "../../api/questsApi";

const useCreateQuest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitQuest = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createQuest(data);
            return response;
        } catch (err) {
            if (err.response?.data?.detail) {
                const errorDetail = Array.isArray(err.response.data.detail)
                    ? err.response.data.detail.map((e) => e.msg).join(", ")
                    : err.response.data.detail
                setError(errorDetail || "Something went wrong!");
            } else {
                setError("Failed to connect to the server, please try again.");
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    console.log(error);

    return { submitQuest, loading, error };
};

export default useCreateQuest;