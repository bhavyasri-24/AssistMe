import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import formatTime from "../../../utils/timeUtils";
import ImageViewer from "../../../components/ImageViewer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function DoubtCard({
  _id,
  title,
  description,
  isResolved,
  isOwner,
  onDelete,
  onToggle,
  user,
  createdAt,
  images,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
const [viewerOpen, setViewerOpen] = useState(false);
const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative rounded-xl bg-white p-4 shadow-sm hover:shadow-md">
      {/* Top */}
      <div className="flex justify-between items-start">
        {/* 👤 User info */}
        <div className="flex items-center gap-3">
          <Avatar round size="32" src={user?.avatar} name={user?.username} />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-900">
              {user?.username || "User"}
            </span>

            <span className="text-xs text-zinc-500">
              {formatTime(createdAt)}
            </span>
          </div>
        </div>

        {/* Menu */}
        {isOwner && (
          <div ref={ref} className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}>⋮</button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow z-50">
                <Link
                  to={`/my-doubts/${_id}/edit`}
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

      {/* Description */}
      <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{description}</p>

      {images?.length > 0 && (
  <div className="relative mt-3">

    <img
      src={images[currentIndex]}
      onClick={() => {
        setActiveIndex(currentIndex);
        setViewerOpen(true);
      }}
      className="w-full h-64 object-cover rounded-lg cursor-pointer"
    />

    {currentIndex > 0 && (
      <button
        onClick={() => setCurrentIndex((p) => p - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        <ChevronLeft size={16} />
      </button>
    )}

    {currentIndex < images.length - 1 && (
      <button
        onClick={() => setCurrentIndex((p) => p + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        <ChevronRight size={16} />
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

      {/* Bottom */}
      <div className="mt-4 flex items-center justify-between">
        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isResolved ? "bg-red-500" : "bg-green-500"
            }`}
          />
          <span className="text-zinc-700">
            {isResolved ? "Resolved" : "Open"}
          </span>
        </div>

        <div className="flex gap-2">
          {/* Join/View */}
          <button onClick={() => navigate(`/room/${_id}`)} className="bg-zinc-900 text-white px-3 py-1 text-xs rounded-md">
            {isResolved ? "View" : "Join"}
          </button>

          {/* 🔥 Resolve toggle */}
          {isOwner && (
            <button
              onClick={() => onToggle(_id)}
              className={`text-xs px-2 py-1 rounded-md border ${
                isResolved
                  ? "border-green-500 text-green-600"
                  : "border-red-500 text-red-500"
              }`}
            >
              {isResolved ? "Mark Open" : "Resolve"}
            </button>
          )}
        </div>
      </div>

      {/* 🔥 Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-5 rounded-xl w-[300px]">
            <p className="text-sm">Delete this doubt?</p>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button
                onClick={() => {
                  onDelete(_id);
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
