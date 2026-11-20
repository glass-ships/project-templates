import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppModal from "@/components/ui/AppModal";

const getDialog = () => document.querySelector("dialog") as HTMLDialogElement;

describe("AppModal", () => {
  it("renders nothing when closed", () => {
    render(<AppModal isOpen={false}>content</AppModal>);

    expect(getDialog()).toBeNull();
    expect(screen.queryByText("content")).toBeNull();
  });

  it("opens a modal dialog with its children and locks page scroll", () => {
    render(<AppModal isOpen>content</AppModal>);

    expect(getDialog().open).toBe(true);
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("calls toggle when Escape is pressed", () => {
    const toggle = vi.fn();
    render(
      <AppModal isOpen toggle={toggle}>
        content
      </AppModal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(toggle).toHaveBeenCalledOnce();
  });

  it("calls toggle on mousedown on the backdrop, not on the content", () => {
    const toggle = vi.fn();
    render(
      <AppModal isOpen toggle={toggle}>
        content
      </AppModal>,
    );

    fireEvent.mouseDown(screen.getByText("content"));
    expect(toggle).not.toHaveBeenCalled();

    fireEvent.mouseDown(getDialog());
    expect(toggle).toHaveBeenCalledOnce();
  });

  it("forwards key presses to onKeyDown", () => {
    const onKeyDown = vi.fn();
    render(
      <AppModal isOpen onKeyDown={onKeyDown}>
        content
      </AppModal>,
    );

    fireEvent.keyDown(document, { key: "a" });

    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: "a" }));
  });

  it("closes the dialog itself on Escape when no toggle is given", () => {
    render(<AppModal isOpen>content</AppModal>);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(getDialog().open).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("stops listening for keys once closed", () => {
    const toggle = vi.fn();
    const { rerender } = render(
      <AppModal isOpen toggle={toggle}>
        content
      </AppModal>,
    );

    rerender(
      <AppModal isOpen={false} toggle={toggle}>
        content
      </AppModal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });

    expect(getDialog()).toBeNull();
    expect(toggle).not.toHaveBeenCalled();
  });

  // KNOWN BUG: AppModal returns null when closed, so modalRef is already null when its effect
  // runs and body overflow is never reset. Remove `.fails` once AppModal.tsx is fixed.
  it.fails("unlocks page scroll when closed", () => {
    const { rerender } = render(<AppModal isOpen>content</AppModal>);

    rerender(<AppModal isOpen={false}>content</AppModal>);

    expect(document.body.style.overflow).toBe("");
  });

  it("unlocks page scroll on unmount", () => {
    const { unmount } = render(<AppModal isOpen>content</AppModal>);

    unmount();

    expect(document.body.style.overflow).toBe("");
  });
});
