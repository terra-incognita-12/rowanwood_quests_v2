import apiClient from "./axios";

export const createQuestLine = async (formData, quest_id) => {
    try {
        const response = await apiClient.post(`/quest_lines/${quest_id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getQuestLines = async (quest_id) => {
    try {
        const response = await apiClient.get(`/quest_lines/${quest_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getQuestLine = async (quest_id, questLine_id) => {
    try {
        const response = await apiClient.get(`/quest_lines/${quest_id}/${questLine_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateQuestLine = async (formData, quest_id, questLine_id) => {
    try {
        const response = await apiClient.patch(`/quest_lines/${quest_id}/${questLine_id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteQuestLine = async (questLine_id) => {
    try {
        const response = await apiClient.delete(`/quest_lines/${questLine_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}