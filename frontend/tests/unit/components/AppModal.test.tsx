import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppModal from "@/components/ui/AppModal";

const getDialog = () => document.querySelector("dialog") as HTMLDialogElement;

describe("AppModal", () => {
  it("renders nothing when closed", () => {
    render(
      <AppModal isOpen={false} toggle={vi.fn()}>
        content
      </AppModal>,
    );

    expect(getDialog()).toBeNull();
    expect(screen.queryByText("content")).toBeNull();
  });

  it("opens a modal dialog with its children and locks page scroll", () => {
    render(
      <AppModal isOpen toggle={vi.fn()}>
        content
      </AppModal>,
    );

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
      <AppModal isOpen toggle={vi.fn()} onKeyDown={onKeyDown}>
        content
      </AppModal>,
    );

    fireEvent.keyDown(document, { key: "a" });

    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: "a" }));
  });

  it("stops the browser from closing the dialog on its own", () => {
    render(
      <AppModal isOpen toggle={vi.fn()}>
        content
      </AppModal>,
    );

    const cancel = new Event("cancel", { cancelable: true });
    getDialog().dispatchEvent(cancel);

    expect(cancel.defaultPrevented).toBe(true);
    expect(getDialog().open).toBe(true);
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

  it("unlocks page scroll when closed", () => {
    const { rerender } = render(
      <AppModal isOpen toggle={vi.fn()}>
        content
      </AppModal>,
    );

    rerender(
      <AppModal isOpen={false} toggle={vi.fn()}>
        content
      </AppModal>,
    );

    expect(document.body.style.overflow).toBe("");
  });

  it("unlocks page scroll on unmount", () => {
    const { unmount } = render(
      <AppModal isOpen toggle={vi.fn()}>
        content
      </AppModal>,
    );

    unmount();

    expect(document.body.style.overflow).toBe("");
  });
});
