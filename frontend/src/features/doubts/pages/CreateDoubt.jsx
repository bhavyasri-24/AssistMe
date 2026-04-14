import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  createDoubt,
  getDoubt,
  updateDoubt,
} from "../services/doubtService";

export default function CreateDoubt() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    user: user?._id || user?.id || "",
  });

  useEffect(() => {
    setForm((currentForm) => ({
      ...currentForm,
      user: user?._id || user?.id || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!isEditMode) return;

    const loadDoubt = async () => {
      try {
        setPageLoading(true);
        setError("");
        const res = await getDoubt(id);
        const doubt = res.data;
        setForm({
          title: doubt.title || "",
          description: doubt.description || "",
          user: doubt?.user?._id || doubt?.user?.id || doubt?.user || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this doubt.");
      } finally {
        setPageLoading(false);
      }
    };

    loadDoubt();
  }, [id, isEditMode]);

  const openAuthModal = () => {
    const search = new URLSearchParams(location.search);
    search.set("auth", "login");
    navigate(`${location.pathname}?${search.toString()}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuthModal();
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (isEditMode) {
        await updateDoubt(id, form);
        navigate("/my-doubts");
        return;
      }

      await createDoubt(form);
      navigate("/doubts");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save this doubt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Update Doubt" : "Create Doubt"}
      </h1>

      {pageLoading ? (
        <p className="rounded-lg border border-zinc-300 bg-white p-4 text-zinc-700">
          Loading doubt...
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          className="bg-zinc-900 text-white px-4 py-2 rounded"
          disabled={loading || pageLoading}
        >
          {loading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Doubt"
              : "Create Doubt"}
        </button>
      </form>
    </section>
  );
}
