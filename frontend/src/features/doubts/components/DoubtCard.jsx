import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DoubtCard({
  _id,
  title,
  description,
  isResolved,
  isOwner,
  onDelete,
  onToggle,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const ref = useRef();

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
        <h2 className="text-base font-semibold">{title}</h2>

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
      <p className="mt-2 text-sm text-zinc-600 line-clamp-2">
        {description}
      </p>

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
          <button className="bg-zinc-900 text-white px-3 py-1 text-xs rounded-md">
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