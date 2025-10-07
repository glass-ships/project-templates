/**
Usage:
------

const [isModalOpen, toggleModal] = useToggle();

return (
  <div>
    <button onClick={toggleModal}>Toggle Modal</button>
    {isModalOpen && <p>Modal Content</p>}
  </div>
);
*/

import { useState } from "react";

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}

export default useToggle;
