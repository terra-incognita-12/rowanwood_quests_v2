import apiClient from "./axios";

// export const createQuest = async (formData, ifHasImage) => {
//     try {
//         const headers = ifHasImage
//             ? { "Content-Type": "multipart/form-data" }
//             : undefined;
        
//         const response = await apiClient.post("/quests", formData, { headers });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };
export const createQuest = async (formData) => {
    formData.forEach((value, key) => {
        console.log(`key ${key} - value ${value}`);
    });
    
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

export const updateQuest = async (id) => {
    const response = await apiClient.patch(`/quests/${id}`);
    return response.data;
};

export const deleteQuest = async (id) => {
    const response = await apiClient.delete(`/quests/${id}`);
    return response.data;
};