import { useState } from "react";
import Avatar from "react-avatar";
import useAuth from "../../../hooks/useAuth";
import { updateUserById } from "../services/userService";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (avatar) formData.append("avatar", avatar);

      const response = await updateUserById(user.id, formData);
      const nextUser = {
        id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        avatar: response.data.avatar,
      };
      updateUser(nextUser);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.error || "Profile update failed");
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-zinc-300 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">Profile</h1>
      <p className="mt-1 text-sm text-zinc-600">Update your profile and avatar</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <Avatar round size="56" src={avatar ? URL.createObjectURL(avatar) : user?.avatar} name={username} />
          <input
            className="block w-full rounded-md border border-zinc-300 bg-zinc-50 p-2 text-sm"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Username</label>
          <input
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
          <input
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Save changes
        </button>
      </form>
    </section>
  );
}
