import { useState } from "react";
import { Plus, PenLine, MessageCircleQuestionMark } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function CreateButton() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const openAuthModal = () => {
    const search = new URLSearchParams(location.search);
    search.set("auth", "login");
    navigate(`${location.pathname}?${search.toString()}`);
  };

  const handleClick = (type) => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (type === "post") {
      navigate("/create-post"); 
    } else {
      navigate("/create-doubt");
    }
  };

  return (
    <div
      className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Options */}
      {open && (
        <>
          <button
            onClick={() => handleClick("post")}
            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 shadow-md hover:bg-zinc-100 cursor-pointer"
          >
            <PenLine size={18} />
            <span className="text-sm">Post</span>
          </button>

          <button
            onClick={() => handleClick("doubt")}
            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 shadow-md hover:bg-zinc-100 cursor-pointer"
          >
            <MessageCircleQuestionMark size={18} />
            <span className="text-sm">Doubt</span>
          </button>
        </>
      )}

      {/* Main Button */}
      <button
        className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg hover:bg-zinc-800 transition cursor-pointer"
      >
        <Plus size={22} />
      </button>
    </div>
  );
}