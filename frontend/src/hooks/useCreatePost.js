import { useState } from "react";
import {createPost} from "../features/posts/services/postService";

export default function useCreatePost() {
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async (data, token) => {
    setLoading(true);
    try {
      await createPost(data, token);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePost, loading };
}