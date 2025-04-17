const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Registration failed. Please try again."
        };
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/login', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const updateUserProfile = async (payload) => {
    try {
        if (!payload.role) {
            return {
                success: false,
                message: "Role is required for profile update"
            };
        }
        const response = await axiosInstance.post('/api/users/update-profile', payload);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Profile update failed. Please try again."
        };
    }
}
