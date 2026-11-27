import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";

import styles from "./AppModal.module.scss";

export type ModalProps = {
  children?: ReactNode;
  /** Whether the modal is shown. */
  isOpen: boolean;
  /**
   * Called on Escape or a backdrop click. The parent closes the modal by setting isOpen to false.
   * Pass `() => {}` for a modal that only the parent can close.
   */
  toggle: () => void;
  /** Called on every key press while the modal is open. */
  onKeyDown?: (e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => void;
};

/**
 * A modal dialog over a dimmed backdrop. While it's open, the page behind it doesn't scroll, and
 * keyboard focus stays inside it. On close, focus returns to whatever opened it.
 *
 * The parent owns whether it's open: Escape and backdrop clicks call `toggle`, and the modal only
 * closes when the parent sets `isOpen` to false.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <AppButton text="Open" onClick={() => setIsOpen(true)} />
 * <AppModal isOpen={isOpen} toggle={() => setIsOpen(false)}>
 *   <h2>Title</h2>
 * </AppModal>
 * ```
 */

export default function AppModal(props: ModalProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  // open in the ref, and close() in its cleanup while the dialog is still in the page,
  // so the browser returns focus to whatever opened it
  const setModalRef = useCallback((el: HTMLDialogElement | null) => {
    if (!el) return;
    modalRef.current = el;
    if (!el.open) el.showModal();
    return () => {
      if (el.open) el.close();
      modalRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!props.isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
      ref={setModalRef}
      className={styles.modalBackdrop}
      // Never let the browser close the dialog itself: only the parent's isOpen decides
      onCancel={(event) => event.preventDefault()}
    >
      <div className={styles.modalContainer}>{props.children}</div>
    </dialog>
  ) : null;
}
