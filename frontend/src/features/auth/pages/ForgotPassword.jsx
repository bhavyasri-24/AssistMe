import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/passwordService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      if (res.data.resetToken) {
        // In development, automatically redirect with token
        const resetUrl = `/forgot-password?token=${res.data.resetToken}`;
        setMessage("Password reset link sent! Redirecting to reset page...");
        setTimeout(() => {
          navigate(resetUrl);
        }, 1500);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const newPassword = event.target.newPassword.value;
      const res = await resetPassword(token, newPassword);
      setMessage(res.data.message);
      setTimeout(() => navigate("/?auth=login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (token) {
    // Reset password form
    return (
      <section className="mx-auto mt-6 w-full max-w-xl rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm md:mt-10">
        <h1 className="text-3xl font-semibold text-zinc-900">Reset Password</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Enter your new password below.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              New Password
            </label>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
              type="password"
              name="newPassword"
              required
              minLength="6"
            />
          </div>

          <button
            className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-600">
          Remember your password?{" "}
          <Link
            className="font-semibold text-zinc-900 underline"
            to="/?auth=login"
          >
            Back to login
          </Link>
        </p>
      </section>
    );
  }

  // Forgot password form
  return (
    <section className="mx-auto mt-6 w-full max-w-xl rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm md:mt-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Forgot Password</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Enter your email address and we'll send you a reset link.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleForgotPassword}>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-5 text-sm text-zinc-600">
        Remember your password?{" "}
        <Link
          className="font-semibold text-zinc-900 underline"
          to="/?auth=login"
        >
          Back to login
        </Link>
      </p>
    </section>
  );
}
