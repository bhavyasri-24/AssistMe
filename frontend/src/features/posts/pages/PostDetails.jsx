import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  addPostComment,
  getPost,
  getPostComments,
  togglePostLike,
} from "../services/postService.js";

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");
        const [postRes, commentsRes] = await Promise.all([
          getPost(id),
          getPostComments(id),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const openAuthModal = () => {
    const search = new URLSearchParams(location.search);
    search.set("auth", "login");
    navigate(`${location.pathname}?${search.toString()}`);
  };

  const handleLike = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const res = await togglePostLike(id);
      const increment = res.data?.message === "post liked" ? 1 : -1;
      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              likesCount: Math.max(0, (currentPost.likesCount || 0) + increment),
            }
          : currentPost,
      );
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update like.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuthModal();
      return;
    }

    if (!comment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const res = await addPostComment(id, { content: comment });
      const nextComment = res.data?.comment;

      if (nextComment) {
        setComments((currentComments) => [nextComment, ...currentComments]);
        setPost((currentPost) =>
          currentPost
            ? {
                ...currentPost,
                commentsCount: (currentPost.commentsCount || 0) + 1,
              }
            : currentPost,
        );
      }

      setComment("");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-6">
      {loading ? (
        <p className="rounded-lg border bg-white p-4 text-zinc-700">
          Loading post...
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      ) : null}

      {post ? (
        <>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-zinc-900">{post.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
              {post.description}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-4 text-sm text-zinc-600">
                <span>Likes {post.likesCount || 0}</span>
                <span>Comments {post.commentsCount || 0}</span>
              </div>
              <button
                type="button"
                onClick={handleLike}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Like
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Comments</h2>

            <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment"
                className="min-h-24 w-full rounded-lg border p-3"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
              >
                {submitting ? "Posting..." : "Add Comment"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {comments.length ? (
                comments.map((item) => (
                  <div key={item._id} className="rounded-lg border border-zinc-200 p-3">
                    <p className="text-sm font-medium text-zinc-900">
                      {item.user?.username || item.user?.email || "User"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700">{item.content}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600">
                  No comments yet.
                </p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
