import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import styles from "./AppModal.module.scss";

type ModalProps = {
  children?: ReactNode;
  isOpen: boolean;
  /**
   * Called on Escape or a backdrop click. The parent closes the modal by setting isOpen to false.
   * Pass `() => {}` for a modal that only the parent can close.
   */
  toggle: () => void;
  onKeyDown?: (e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => void;
};

export default function AppModal(props: ModalProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!props.isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (modalRef.current && !modalRef.current.open) {
      modalRef.current.showModal();
    }
    // Reset body overflow when modal is closed and on unmount
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [props.isOpen]);

  useEffect(() => {
    if (!props.isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        props.toggle();
      }
      if (props.onKeyDown) {
        props.onKeyDown(event);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        event.preventDefault();
        event.stopPropagation();
        props.toggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.isOpen, props.onKeyDown, props.toggle]);

  return props.isOpen ? (
    <dialog
      ref={modalRef}
      className={styles.modalBackdrop}
      // Never let the browser close the dialog itself: only the parent's isOpen decides
      onCancel={(event) => event.preventDefault()}
    >
      <div className={styles.modalContainer}>{props.children}</div>
    </dialog>
  ) : null;
}
