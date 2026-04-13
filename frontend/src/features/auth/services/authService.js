import API from '../../../services/api.js'

export const loginUser = (data) => API.post('/login', data)
export const registerUser = (data) => API.post('/register', data)
export const logoutUser = () => API.post('/logout')
export const logoutAll = () => API.post('/logoutAll')
export const refresh = () => API.post('/refresh')