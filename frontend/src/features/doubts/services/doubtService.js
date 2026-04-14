import API from "../../../services/api.js"

export const getDoubts = () => API.get('/doubts');
export const getDoubt = (id) => API.get(`/doubts/${id}`);
export const createDoubt = (data) => API.post('/doubts', data);
export const updateDoubt = (id, data) => API.put(`/doubts/${id}`, data);
export const deleteDoubt = (id) => API.delete(`/doubts/${id}`);
export const resolveToggle = (id) =>
  API.put(`/doubts/${id}/toggle-resolve`);