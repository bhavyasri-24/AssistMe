import { getDoubts } from "../services/doubtService.js";
import { useState, useEffect } from "react";
import DoubtCard from "../components/DoubtCard.jsx";

export default function Doubts() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const res = await getDoubts();
        setDoubts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, []);

  return (
  <section className="mx-auto max-w-2xl px-4 py-6">
    <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
      Doubts
    </h1>

    <div className="space-y-4">
      {doubts.map((doubt) => (
        <DoubtCard key={doubt._id} {...doubt} />
      ))}
    </div>
  </section>
);
}