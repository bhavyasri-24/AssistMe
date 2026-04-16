import API from "../../../services/api";

export const forgotPassword = (email) =>
  API.post('/forgot-password', { email });

export const resetPassword = (token, newPassword) =>
  API.post('/reset-password', { token, newPassword });
