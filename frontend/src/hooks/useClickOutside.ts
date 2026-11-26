import { useEffect, useRef } from "react";

/**
 * Calls `handler` on a mousedown outside the element the returned ref is attached to.
 *
 * @param handler - Called on each mousedown outside the element. Pass a stable function
 *   (or let the React Compiler memoize it), or the listener is re-added on every render.
 * @returns A ref to attach to the element that counts as "inside".
 * @example
 * ```tsx
 * const ref = useClickOutside(() => setDropdownOpen(false));
 *
 * return <div ref={ref}>{dropdownOpen && <p>Dropdown Content</p>}</div>;
 * ```
 */
function useClickOutside(handler: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handler]);

  return ref;
}

export default useClickOutside;
