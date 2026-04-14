import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import PostCard from "../../posts/components/PostCard.jsx";
import {
  deletePost,
  togglePostLike,
} from "../../posts/services/postService.js";
import { getMyPosts } from "../services/myPostService.js";
export default function MyPosts() {
  const { user, authReady } = useAuth();
  const [myPosts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const posts = await getMyPosts();
        setPosts(posts);

      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [authReady, user]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("Unable to delete post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await togglePostLike(postId);
      const increment = res.data?.message === "post liked" ? 1 : -1;
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likesCount: Math.max(0, (post.likesCount || 0) + increment),
              }
            : post,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update like.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
        My posts
      </h1>

      {loading && (
        <p className="rounded-lg border p-4 text-zinc-700">
          Loading your posts...
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {!loading && myPosts.length ? (
          myPosts.map((post) => (
            <PostCard
              key={post._id}
              {...post}
              isOwner
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))
        ) : (
          !loading && (
            <p className="rounded-lg border p-4 text-zinc-700">
              No posts yet.
            </p>
          )
        )}
      </div>
    </section>
  );
}
