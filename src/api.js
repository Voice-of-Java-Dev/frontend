import axios from 'axios';

const api = axios.create({
  baseURL: 'https://user-service-oyy1.onrender.com/api',
});

export const registerUser = (fullName, email, password) =>
  api.post('/users/register', { fullName, email, password });

export const loginUser = (email, password) =>
  api.post('/users/login', { email, password });

export const createPost = (token, postData) =>
  api.post('/posts', postData, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getPublicPosts = () =>
  api.get('/posts/public');
