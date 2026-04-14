import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import { getPosts, togglePostLike } from "../services/postService.js";
import useAuth from "../../../hooks/useAuth";
export default function Posts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getPosts().then((res) => setPosts(res.data));
  }, []);

  const openAuthModal = () => {
    const search = new URLSearchParams(location.search);
    search.set("auth", "login");
    navigate(`${location.pathname}?${search.toString()}`);
  };

  const handleLike = async (postId) => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const res = await togglePostLike(postId);

      const increment = res.data?.message === "post liked";

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: increment, // ✅ FIXED
                likesCount: increment
                  ? p.likesCount + 1
                  : p.likesCount - 1,
              }
            : p
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update like.");
    }
  };


  return (
    <section className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        Posts
      </h1>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} {...post} onLike={handleLike} />
        ))}
      </div>
    </section>
  );
}
