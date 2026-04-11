import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-5 bg-white flex justify-between items-center shadow">

      {/* LEFT */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="h-10" />
        <h1 className="font-bold text-xl">AssistMe</h1>
      </div>

      {/* RIGHT */}
      <div>
        {!user ? (
          // 🔓 NOT LOGGED IN
          <div className="flex gap-4">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Sign Up</button>
          </div>
        ) : (
          // 🔐 LOGGED IN
          <div className="relative">
            <button onClick={() => setOpen(!open)}>
              {user.name || "Profile"} ▼
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white border p-2 shadow">
                <p className="cursor-pointer" onClick={() => navigate("/profile")}>
                  Profile
                </p>
                <p className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}