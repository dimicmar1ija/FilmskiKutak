import axios from "./axiosInstance";

// kreiranje posta
export const createPost = (payload) =>
  axios.post("/Post", payload).then(r => r.data);

// dohvatanje svih postova
export const getPosts = () =>
  axios.get("/Post").then(r => r.data);

// dohvatanje posta po ID-u
export const getPostById = (id) =>
  axios.get(`/Post/${id}`).then(r => r.data);

// brisanje posta po ID-u
export const deletePost = (id) =>
  axios.delete(`/Post/${id}`).then(r => r.data);

// izmena posta (id je sada deo body-ja, ne rute!)
export const updatePost = (payload) =>
  axios.put("/Post", payload).then(r => r.data);

// dohvatanje postova po authorId
export const getPostsByAuthor = (authorId) =>
axios.get(`/Post/by-author/${authorId}`).then(r => r.data);


export const toggleLikePost = (postId, userId) => {
  return axios.put(`http://localhost:5132/api/Post/${postId}/like?userId=${userId}`);
};
