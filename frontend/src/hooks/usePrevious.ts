import { useEffect, useRef } from "react";

/**
 * The value from the previous render.
 *
 * @param value - The value to remember.
 * @returns `undefined` on the first render, then the value passed on the render before this one.
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * return <p>Now: {count}, Before: {prevCount}</p>;
 * ```
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
