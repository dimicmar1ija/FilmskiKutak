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
export const deletePost = (id) => axios.delete(`/Post/${id}`).then(r => r.data);
