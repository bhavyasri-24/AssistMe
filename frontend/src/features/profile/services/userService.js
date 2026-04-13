import API from "../../../services/api";

export const updateUserById = (id, formData) =>
  API.put(`/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
