import { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import useLocalStorage from "@/hooks/useLocalStorage";
import "./ThemeToggle.scss";

export default function ThemeToggle() {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  // useLocalStorage catches storage errors, so blocked storage falls back to the system theme
  const [theme, setTheme] = useLocalStorage("theme", prefersLight ? "light" : "dark");
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);
  }, [isLight]);

  return (
    <>
      <button
        type="button"
        id="themeToggle"
        aria-label="Light theme"
        aria-pressed={isLight}
        onClick={() => setTheme(isLight ? "dark" : "light")}
      />
      <Tooltip anchorSelect="#themeToggle" content="Toggle Theme" clickable />
    </>
  );
}
