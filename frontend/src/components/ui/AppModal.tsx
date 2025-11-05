import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";

import styles from "./AppModal.module.scss";

type ModalProps = {
  children?: ReactNode;
  isOpen: boolean;
  toggle?: () => void;
  onKeyDown?: (e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => void;
};

export default function AppModal(props: ModalProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const toggleModal = useCallback(() => {
    if (props.toggle) {
      props.toggle();
    } else {
      if (modalRef.current) {
        if (modalRef.current.open) {
          modalRef.current.close();
          document.body.style.overflow = "";
        } else if (!modalRef.current.open) {
          modalRef.current.showModal();
          document.body.style.overflow = "hidden";
        }
      }
    }
  }, [props.toggle]);

  useEffect(() => {
    if (props.isOpen && modalRef.current) {
      document.body.style.overflow = "hidden";
      if (!modalRef.current.open) {
        modalRef.current.showModal();
      }
    } else if (modalRef.current) {
      document.body.style.overflow = "";
      if (modalRef.current.open) {
        modalRef.current.close();
      }
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (!props.isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        toggleModal();
      }
      if (props.onKeyDown) {
        props.onKeyDown(event);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        event.preventDefault();
        event.stopPropagation();
        toggleModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.isOpen, props.onKeyDown, toggleModal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return props.isOpen ? (
    <dialog ref={modalRef} className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>{props.children}</div>
    </dialog>
  ) : null;
}
