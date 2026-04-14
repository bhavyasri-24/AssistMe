import API from '../../../services/api.js'

export const getPosts = () => API.get('/posts');
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const myPosts = ()=>API.get('/posts/me');
export const togglePostLike = (id) => API.post(`/likes/${id}/toggle-like`);
export const getPostComments = (id) => API.get(`/comments/${id}`);
export const addPostComment = (id, data) => API.post(`/comments/${id}`, data);
