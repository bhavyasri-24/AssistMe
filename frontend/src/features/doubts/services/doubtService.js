import API from "../../../services/api.js"

export const getDoubts = () => API.get('/doubts');
export const getDoubt = (id) => API.get(`/doubts/${id}`);
