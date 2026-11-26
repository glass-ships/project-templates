import { useEffect, useState } from "react";

/**
 * Fetches `url` as JSON, and fetches again whenever `url` changes.
 *
 * An HTTP error status is reported as an `error` ("404 Not Found"), not as `data`. A request for an
 * old `url`, or one still running when the component unmounts, is aborted and its result ignored.
 *
 * @typeParam T - The shape of the JSON response. It isn't checked at runtime.
 * @param url - The url to fetch.
 * @returns `data` (null until loaded), `loading`, and `error` (null unless the last request failed).
 * @example
 * ```tsx
 * const { data, loading, error } = useFetch<User[]>("/api/users");
 *
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error: {error.message}</p>;
 * return <ul>{data?.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
 * ```
 */
export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`.trim());
        const result = (await response.json()) as T;
        if (!signal.aborted) setData(result);
      } catch (err) {
        // an aborted request belongs to an old url or an unmounted component: ignore it
        if (!signal.aborted) setError(err as Error);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
