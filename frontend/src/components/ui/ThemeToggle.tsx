import { useEffect, useRef } from "react";
import "./ThemeToggle.scss";
import { Tooltip } from "react-tooltip";

export default function ThemeToggle() {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = localStorage.getItem("theme") || (prefersLight ? "light" : "dark");
    document.documentElement.classList.add(initialTheme);
    if (checkboxRef.current) checkboxRef.current.checked = initialTheme === "light";
  }, []);

  // Toggle theme function
  function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.classList.contains("light") ? "light" : "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    root.classList.remove(currentTheme);
    root.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <>
      <input type="checkbox" id="toggleCheckbox" ref={checkboxRef} onClick={toggleTheme} />
      <label id="toggleLabel" htmlFor="toggleCheckbox">
        Toggle
      </label>
      <Tooltip anchorSelect="#toggleLabel" content="Toggle Theme" clickable />
    </>
  );
}
