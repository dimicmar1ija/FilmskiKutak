import axios from "./axiosInstance";

export const createPost = (payload, token) =>
  axios.post("/post", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(r => r.data);

export const getPosts = () =>
  axios.get("/post").then(r => r.data);

export const getPostById = (id) =>
  axios.get(`/post/${id}`).then(r => r.data);
