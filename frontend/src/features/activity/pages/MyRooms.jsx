import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { getDoubts } from "../../doubts/services/doubtService";

export default function MyRooms() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    getDoubts().then((res) => setDoubts(res.data));
  }, []);

  const myRooms = useMemo(
    () =>
      doubts.filter((doubt) => {
        const ownerId = doubt?.user?._id || doubt?.user?.id || doubt?.user;
        return String(ownerId) === String(user?.id);
      }),
    [doubts, user?.id],
  );

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">My rooms</h1>
      {myRooms.length ? (
        myRooms.map((room) => (
          <div key={room._id} className="rounded-lg border border-zinc-300 bg-white p-4 shadow-sm">
            <h2 className="font-medium text-zinc-900">{room.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{room.description}</p>
            <Link to="/doubts" className="mt-3 inline-block text-sm font-medium text-zinc-900 underline">
              Open in doubts
            </Link>
          </div>
        ))
      ) : (
        <p className="rounded-lg border border-zinc-300 bg-white p-4 text-zinc-700">No rooms yet.</p>
      )}
    </section>
  );
}
