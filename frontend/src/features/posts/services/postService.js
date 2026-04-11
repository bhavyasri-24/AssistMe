import API from '../../../services/api.js'

export const getPosts = () => API.get('/posts');
export const getPost = (id) => API.get(`/posts/${id}`);