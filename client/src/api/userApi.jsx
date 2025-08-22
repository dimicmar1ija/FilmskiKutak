import axiosInstance from "./axiosInstance";

export const getUserProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/User/${userId}`);
    return response.data;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
