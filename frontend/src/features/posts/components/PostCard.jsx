import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { addPostComment, getPostComments } from "../services/postService.js";
import Avatar from "react-avatar";
import formatTime from "../../../utils/timeUtils.js";
import ImageViewer from "../../../components/ImageViewer.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostCard({
  _id,
  title,
  description,
  likesCount = 0,
  isLiked = false,
  commentsCount = 0,
  isOwner = false,
  onDelete,
  onLike,
  user,
  createdAt,
  images = [],
}) {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);

  const ref = useRef();
  const commentRef = useRef();

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!commentRef.current?.contains(e.target)) {
        setCommentsOpen(false);
      }
    };

    if (commentsOpen) {
      document.addEventListener("click", handleClick);
    }

    return () => document.removeEventListener("click", handleClick);
  }, [commentsOpen]);

  useEffect(() => {
    setLocalCommentsCount(commentsCount);
  }, [commentsCount]);

  const openAuthModal = () => {
    const search = new URLSearchParams(location.search);
    search.set("auth", "login");
    navigate(`${location.pathname}?${search.toString()}`);
  };

  // Load comments
  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentError("");
      const res = await getPostComments(_id);
      setComments(res.data);
      setLocalCommentsCount(res.data.length);
    } catch (err) {
      setCommentError(err.response?.data?.error || "Unable to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentsToggle = async () => {
    const next = !commentsOpen;
    setCommentsOpen(next);

    if (next && !comments.length) {
      await loadComments();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuthModal();
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const res = await addPostComment(_id, { content: commentText });

      const newComment = res.data?.comment;

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setLocalCommentsCount((prev) => prev + 1);
      }

      setCommentText("");
    } catch (err) {
      setCommentError(err.response?.data?.error || "Unable to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleComments = comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      {/* 🔝 Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 mb-2">
          <Avatar
            round
            size="35"
            src={user?.avatar || undefined}
            name={user?.username}
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.username || "User"}
            </span>

            <span className="text-xs text-zinc-500">
              {formatTime(createdAt)}
            </span>
          </div>
        </div>

        {isOwner && (
          <div ref={ref} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-zinc-500 hover:text-zinc-800"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow z-50">
                <Link
                  to={`/my-posts/${_id}/edit`}
                  className="block px-3 py-2 text-sm hover:bg-zinc-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📝 Content */}
      <div className="mt-3">
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm text-zinc-700 whitespace-pre-line">
          {description}
        </p>
      </div>

      {images?.length > 0 && (
        <div className="relative mt-3">
          {/* Image */}
          <img
            src={images[currentIndex]}
            onClick={() => {
              setActiveIndex(currentIndex);
              setViewerOpen(true);
            }}
            className="w-full h-64 object-cover rounded-lg cursor-pointer"
          />

          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right Arrow */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

      {viewerOpen && (
        <ImageViewer
          images={images}
          index={activeIndex}
          setIndex={setActiveIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* ❤️ 💬 Stats row ONLY */}
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
        {/* Like */}
        <button
          onClick={() => onLike?.(_id)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Heart
            size={16}
            strokeWidth={2}
            fill={isLiked ? "currentColor" : "none"} // 🔥 IMPORTANT
            className={isLiked ? "text-red-500" : "text-zinc-600 "}
          />
          <span>{likesCount}</span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 IMPORTANT
            handleCommentsToggle();
          }}
          className="flex items-center gap-1 hover:text-zinc-900"
        >
          {" "}
          Comments
          <MessageCircle size={16} />
          <span>{localCommentsCount}</span>
        </button>
      </div>

      {/* 💬 Comments */}
      {commentsOpen && (
        <div ref={commentRef} className="mt-4 space-y-3">
          {/* Add comment */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border px-4 py-2 text-sm"
            />
            <button className="text-sm text-blue-600 font-medium">
              {submitting ? "Posting..." : "Post"}
            </button>
          </form>

          {/* Comments list */}
          {commentsLoading ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : visibleComments.length ? (
            <>
              {visibleComments.map((comment) => (
                <div key={comment._id} className="flex gap-2">
                  <Avatar
                    round
                    size="28"
                    src={comment.user?.avatar || undefined}
                    name={comment.user?.username}
                  />
                  <div className="bg-zinc-100 rounded-xl px-3 py-2 text-sm">
                    <p className="font-medium text-zinc-900">
                      {comment.user?.username || "User"}
                    </p>
                    <p className="text-zinc-700">{comment.content}</p>
                  </div>
                </div>
              ))}

              {hasMoreComments && (
                <button
                  onClick={() => navigate(`/posts/${_id}`)}
                  className="text-sm text-zinc-600 hover:underline"
                >
                  View more comments
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-500">No comments yet</p>
          )}
        </div>
      )}

      {/* 🔥 Delete Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-5 rounded-xl w-[300px]">
            <p className="text-sm">Delete this post?</p>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button
                onClick={() => {
                  onDelete?.(_id);
                  setConfirmOpen(false);
                }}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
