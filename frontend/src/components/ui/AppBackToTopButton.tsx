import type React from "react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import "./AppBackToTopButton.scss";
import AppButton from "./AppButton";

interface AppBackToTopButtonProps {
  targetId?: string;
  thresholdVH?: number;
  label?: string;
  ariaLabel?: string;
}

const AppBackToTopButton: React.FC<AppBackToTopButtonProps> = ({
  targetId = "top",
  thresholdVH = 0.1,
  label, //= "Back to top",
  ariaLabel = "Back to top",
}) => {
  // only the boolean is state, so scrolling re-renders only when the button appears or hides
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(window.scrollY > window.innerHeight * thresholdVH);
    update(); // the page may already be scrolled (reload, back button)
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [thresholdVH]);

  // Smooth scroll to anchor or page top
  const scrollTop = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="to-top" style={{ display: show ? "flex" : "none" }}>
      <Tooltip content={ariaLabel} anchorSelect="#back-to-top-button" place="left" />
      <AppButton
        id="back-to-top-button"
        design="circle"
        color="primary"
        text={label ? label : undefined}
        ariaLabel={ariaLabel}
        icon="angles-up"
        onClick={scrollTop}
      />
    </div>
  );
};

export default AppBackToTopButton;
