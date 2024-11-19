import { useState, useEffect } from "react";
import { apiAuth } from "src/utils/http";
import { LookUpType } from "../../../helpers/type";

const useFetchLookUpData = (url: string | null) => {
  const [data, setData] = useState<LookUpType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiAuth(url);
        setData(response.data.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchLookUpData;
