import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import styles from "./AppModal.module.scss";

export interface AppModalProps {
  isVisible?: boolean;
  children?: React.ReactNode;
  onToggle?: (e?: unknown) => void;
  onKeyDown?: (e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function AppModal({ isVisible, children, onToggle, onKeyDown }: AppModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef(isVisible);

  const toggleModal = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      isVisibleRef.current = false;
    }
  }, [onToggle]);

  const handleClickOutside = useCallback(
    (event: unknown) => {
      if (modalRef.current && !modalRef.current.contains((event as MouseEvent).target as Node)) {
        (event as MouseEvent).stopPropagation();
        toggleModal();
      }
    },
    [toggleModal],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        toggleModal();
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [onKeyDown, toggleModal],
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleClickOutside, handleKeyDown]);

  /** Conditional Render */
  return isVisible ? (
    <div
      ref={modalRef}
      className={styles.modalBackdrop}
      role="dialog"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        role="document"
        className={styles.modalContainer}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  ) : null;
}
