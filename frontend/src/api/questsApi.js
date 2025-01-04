import apiClient from "./axios";

export const createQuest = async (formData) => {    
    try {
        const response = await apiClient.post("/quests", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getQuests = async () => {
    const response = await apiClient.get("/quests/");
    return response.data;
};

export const getQuest = async (id) => {
    const response = await apiClient.get(`/quests/${id}`);
    return response.data;
};

export const updateQuest = async (formData, id) => {    
    try {
        const response = await apiClient.patch(`/quests/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteQuest = async (id) => {
    const response = await apiClient.delete(`/quests/${id}`);
    return response.data;
};

export const deleteQuestPhoto = async (id) => {
    try {
        const response = await apiClient.delete(`/quests/${id}/photo`);
        return response.data;
    } catch (error) {
        throw error;
    }
}