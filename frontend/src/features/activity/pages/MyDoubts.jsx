import { useEffect, useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import DoubtCard from "../../doubts/components/DoubtCard";
import { getDoubts } from "../../doubts/services/doubtService";

export default function MyDoubts() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    getDoubts().then((res) => setDoubts(res.data));
  }, []);

  const myDoubts = useMemo(
    () =>
      doubts.filter((doubt) => {
        const ownerId = doubt?.user?._id || doubt?.user?.id || doubt?.user;
        return String(ownerId) === String(user?.id);
      }),
    [doubts, user?.id],
  );

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900">My doubts</h1>
      <div className="space-y-4">
        {myDoubts.length ? (
          myDoubts.map((doubt) => <DoubtCard key={doubt._id} {...doubt} />)
        ) : (
          <p className="rounded-lg border border-zinc-300 bg-white p-4 text-zinc-700">No doubts yet.</p>
        )}
      </div>
    </section>
  );
}
