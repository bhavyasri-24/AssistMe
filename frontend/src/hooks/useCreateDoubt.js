import { useState } from "react";
import {createDoubt} from "../features/doubts/services/doubtService";

export default function useCreateDoubt() {
  const [loading, setLoading] = useState(false);

  const handleCreateDoubt = async (data, token) => {
    setLoading(true);
    try {
      await createDoubt(data, token);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateDoubt, loading };
}