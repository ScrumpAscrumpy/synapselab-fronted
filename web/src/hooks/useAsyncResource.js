import { useEffect, useState } from "react";

function useAsyncResource(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.resolve()
      .then(() => fetcher())
      .then((result) => {
        if (!active) {
          return;
        }

        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) {
          return;
        }

        setError(err?.message || "加载失败");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, deps);

  return {
    data,
    loading,
    error,
    setData,
  };
}

export default useAsyncResource;
