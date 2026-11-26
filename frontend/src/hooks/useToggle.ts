import { useState } from "react";

/**
 * A boolean state with a function that flips it.
 *
 * @param initialState - The starting value. Defaults to `false`.
 * @returns `[state, toggle]`.
 * @example
 * ```tsx
 * const [isModalOpen, toggleModal] = useToggle();
 *
 * return (
 *   <div>
 *     <button onClick={toggleModal}>Toggle Modal</button>
 *     {isModalOpen && <p>Modal Content</p>}
 *   </div>
 * );
 * ```
 */
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}

export default useToggle;
