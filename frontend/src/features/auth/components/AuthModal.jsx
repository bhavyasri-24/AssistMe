import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { loginUser, registerUser } from "../services/authService";

export default function AuthModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const mode = searchParams.get("auth");
  const isOpen = mode === "login" || mode === "signup";
  const redirectPath = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(
    () => (mode === "signup" ? "Create account" : "Log in"),
    [mode],
  );

  const closeModal = () => {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.delete("auth");

    navigate(
      `${location.pathname}${
        nextSearch.toString() ? `?${nextSearch.toString()}` : ""
      }`,
      { replace: true },
    );
  };

  const switchMode = (nextMode) => {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.set("auth", nextMode);

    navigate(`${location.pathname}?${nextSearch.toString()}`, {
      replace: true,
    });

    setError("");
    setNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      // ✅ Confirm password validation
      if (mode === "signup" && form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      if (mode === "signup") {
        await registerUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        setNotice("Account created. Please log in.");
        switchMode("login");
      } else {
        const credential = form.email.trim();
        const response = await loginUser({
          email: credential.includes("@") ? credential.toLowerCase() : credential,
          username: credential,
          password: form.password,
        });

        login(response.data);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Unable to continue. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/45 p-4"
      onClick={closeModal} 
    >
      <div
        className={`relative w-full ${
          mode === "signup" ? "max-w-3xl" : "max-w-2xl"
        } rounded-2xl border border-zinc-300 bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 rounded-md p-1 text-zinc-600 hover:bg-zinc-100"
          onClick={closeModal}
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden border-r border-zinc-200 p-8 md:block">
            <h3 className="text-xl font-semibold text-zinc-900">
              Welcome to AssistMe
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Share posts, solve doubts, and collaborate in learning rooms.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4 p-6 md:p-8" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-semibold text-zinc-900">{title}</h2>

            <p className="text-sm text-zinc-600">
              {mode === "signup"
                ? "Create your account to get started."
                : "Continue to your account."}
            </p>

            {notice && <p className="text-sm text-emerald-700">{notice}</p>}

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Username (Signup only) */}
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Username
                </label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {/* Email / Username */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Email or Username
              </label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                required
                type={mode === "signup" ? "email" : "text"}
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                required
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>

            {/* Confirm Password */}
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {/* Submit */}
            <button
              className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "signup"
                  ? "Sign up"
                  : "Log in"}
            </button>

            {/* Switch */}
            <p className="text-sm text-zinc-600">
              {mode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                className="font-semibold text-zinc-900 underline"
                onClick={() =>
                  switchMode(mode === "signup" ? "login" : "signup")
                }
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
