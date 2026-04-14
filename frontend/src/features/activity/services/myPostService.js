import API from "../../../services/api.js";

export const getMyPosts = async () => {
  try {
    const res = await API.get("/posts/me");
    return res.data;
  } catch (error) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?._id || user?.id;

    if (!userId) {
      throw error;
    }

    const res = await API.get("/posts");
    return res.data.filter((post) => {
      const ownerId = post?.user?._id || post?.user?.id || post?.user;
      return String(ownerId) === String(userId);
    });
  }
};

