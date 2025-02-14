import apiClient from "./axios";

export const createLibraryRecord = async (formData) => {    
    try {
        const response = await apiClient.post("/library", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLibraryRecords = async () => {
    const response = await apiClient.get("/library");
    return response.data;
};

export const getLibraryRecord = async (id) => {
    const response = await apiClient.get(`/library/${id}`);
    return response.data;
};

export const updateLibraryRecord = async (formData, id) => {    
    try {
        const response = await apiClient.patch(`/library/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteLibraryRecord = async (id) => {
    const response = await apiClient.delete(`/library/${id}`);
    return response.data;
};

export const deleteLibraryRecordPhoto = async (id) => {
    try {
        const response = await apiClient.delete(`/library/${id}/photo`);
        return response.data;
    } catch (error) {
        throw error;
    }
}