import { useState } from "react";
import Avatar from "react-avatar";
import useAuth from "../../../hooks/useAuth";
import { updateUserById } from "../services/userService";
import { useEffect } from "react";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // 🔥 Upload avatar
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await updateUserById(user._id, formData);
      updateUser(res.data);
      setMessage("Avatar updated.");
    } catch {
      setError("Avatar update failed");
    }
  };

  // 🔥 Remove avatar
  const handleRemoveAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("removeAvatar", "true");

      const res = await updateUserById(user._id, formData);

      updateUser(res.data);
      setAvatarPreview("");
      setMessage("Avatar removed.");
    } catch {
      setError("Failed to remove avatar");
    }
  };

  // 🔥 Submit everything
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      // always send these
      formData.append("username", username);
      formData.append("email", email);

      // 🔥 ONLY send password if user typed it
      if (showPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          return setError("Passwords do not match");
        }

        formData.append("password", newPassword);
      }

      const res = await updateUserById(user._id, formData);

      updateUser(res.data);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 🔥 AVATAR ROW */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <label className="relative group cursor-pointer">
              <Avatar round size="70" src={avatarPreview} name={username} />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
                <span className="text-white text-xs">Change</span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>

            {/* Update button */}
            <label className="cursor-pointer text-sm text-blue-600 hover:underline">
              Update
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* 🔥 Remove on extreme right */}
          {avatarPreview && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        {/* 🔥 USERNAME */}
        <div>
          <label className="text-sm">Username</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* 🔥 EMAIL */}
        <div>
          <label className="text-sm">Email</label>
          <input
            className="w-full border p-2 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 🔥 PASSWORD TOGGLE */}
        <div>
          {!showPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="password"
                placeholder="New password"
                className="w-full border p-2 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border p-2 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(false)}
                className="text-xs text-zinc-500 hover:underline"
              >
                Cancel password change
              </button>
            </div>
          )}
        </div>

        {/* 🔥 MESSAGES */}
        {message && (
          <p className="text-green-600 text-sm transition-opacity duration-500">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm transition-opacity duration-500">
            {error}
          </p>
        )}

        {/* 🔥 SAVE */}
        <button className="bg-black text-white px-5 py-2 rounded hover:bg-zinc-800">
          Save Changes
        </button>
      </form>
    </section>
  );
}
