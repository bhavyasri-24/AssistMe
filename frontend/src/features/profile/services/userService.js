import API from "../../../services/api";

export const updateUserById = (id, formData) =>
  API.put(`/users/${id}`, formData);
