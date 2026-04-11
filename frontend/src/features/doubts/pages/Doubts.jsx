import { getDoubts } from "../services/doubtService.js";
import { useState, useEffect } from "react";
import DoubtCard from "../components/DoubtCard.jsx";

export default function Doubts() {
  useEffect(() => {
    getDoubts().then((res) => setDoubts(res.data));
  }, []);
  const [doubts, setDoubts] = useState([]);

  return (
    <div>
      <h1>Doubts</h1>

      {doubts.map((doubt) => (
        <DoubtCard key={doubt._id} {...doubt} />
      ))}
    </div>
  );
}
