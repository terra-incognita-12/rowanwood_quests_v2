import apiClient from "./axios";

export const createQuests = async (questData) => {
    const response = await apiClient.post("/quests", questData);
    return response.data;
}

export const getQuests = async () => {
    const response = await apiClient.get("/quests/");
    return response.data;
};

export const getQuest = async (id) => {
    const response = await apiClient.get(`/quests/${id}`);
    return response.data;
};

export const updateQuest = async (id) => {
    const response = await apiClient.patch(`/quests/${id}`);
    return response.data;
};

export const deleteQuest = async (id) => {
    const response = await apiClient.delete(`/quests/${id}`);
    return response.data;
};