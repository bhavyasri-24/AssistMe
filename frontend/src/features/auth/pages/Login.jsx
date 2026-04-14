import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth.js";
import { loginUser } from "../services/authService.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ credential: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || "/";

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const credential = form.credential.trim();
      const res = await loginUser({
        email: credential.includes("@") ? credential.toLowerCase() : credential,
        username: credential,
        password: form.password,
      });
      login(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mt-6 w-full max-w-xl rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm md:mt-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Log in</h1>
      <p className="mt-2 text-sm text-zinc-600">Access your account to interact with posts and doubts.</p>

      <form className="mt-6 space-y-4" onSubmit={handleLogin}>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Email or Username</label>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            type="text"
            required
            value={form.credential}
            onChange={(e) => setForm((prev) => ({ ...prev, credential: e.target.value }))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Password</label>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
        </div>

        <button
          className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-sm text-zinc-600">
        Don't have an account?{" "}
        <Link className="font-semibold text-zinc-900 underline" to="/register">
          Sign up
        </Link>
      </p>
    </section>
  );
}
