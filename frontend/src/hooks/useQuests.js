import { useState, useEffect } from "react";
import { getQuests } from "../api/questsApi";

const useQuests = () => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuests = async () => {
            try {
                const data = await getQuests();
                setQuests(data);
            } catch (err) {
                setError("Failed to load quests.");
            } finally {
                setLoading(false);
            }
        };

        loadQuests();
    }, []);

    return { quests, loading, error };
};

export default useQuests;