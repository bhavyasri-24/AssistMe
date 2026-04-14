import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import DoubtCard from "../../doubts/components/DoubtCard";
import { deleteDoubt, resolveToggle } from "../../doubts/services/doubtService";
import { getMyDoubts } from "../services/myDoubtService.js";

export default function MyDoubts() {
  const { user, authReady } = useAuth();

  const [myDoubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const loadDoubts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyDoubts(); // ✅
        console.log(data);
        setDoubts(data); // ✅
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your doubts.");
      } finally {
        setLoading(false);
      }
    };

    loadDoubts();
  }, [authReady, user]);

  // 🔥 Delete
  const handleDelete = async (id) => {
    try {
      await deleteDoubt(id);
      setDoubts((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      setError(
        "Unable to delete",
        error.response?.data?.message || "An error occurred.",
      );
    }
  };

  // 🔥 Toggle Resolve
  const handleToggle = async (id) => {
    try {
      await resolveToggle(id);

      setDoubts((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, isResolved: !d.isResolved } : d,
        ),
      );
    } catch {
      setError("Unable to update status");
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">My doubts</h1>

      {loading && (
        <p className="rounded-lg border p-4 text-zinc-700">
          Loading your doubts...
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {!loading && myDoubts.length
          ? myDoubts.map((doubt) => (
              <DoubtCard
                key={doubt._id}
                {...doubt}
                isOwner
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))
          : !loading && (
              <p className="rounded-lg border p-4 text-zinc-700">
                No doubts yet.
              </p>
            )}
      </div>
    </section>
  );
}
