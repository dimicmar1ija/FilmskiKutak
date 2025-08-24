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


export const getUsersPreviews = () => {
  return axiosInstance.get(`/User/previews`).then(r => r.data);
}

export const getUserById = (id) => {
  return axiosInstance.get(`/User/${id}`).then(r => r.data);
}

export const deleteUser = (id) => {
  return axiosInstance.delete(`/User/${id}`).then(r => r.data);
}