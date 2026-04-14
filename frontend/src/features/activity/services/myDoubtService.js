import API from "../../../services/api.js";

export const getMyDoubts = async () => {
  try {
    const res = await API.get("/doubts/me");
    return res.data;
  } catch (error) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?._id || user?.id;

    if (!userId) {
      throw error;
    }

    const res = await API.get("/doubts");
    return res.data.filter((doubt) => {
      const ownerId = doubt?.user?._id || doubt?.user?.id || doubt?.user;
      return String(ownerId) === String(userId);
    });
  }
};
