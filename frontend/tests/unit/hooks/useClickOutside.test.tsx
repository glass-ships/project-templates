import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useClickOutside from "@/hooks/useClickOutside";

function Dropdown({ onOutside }: { onOutside: () => void }) {
  const ref = useClickOutside(onOutside);
  return (
    <>
      <div ref={ref}>
        <button type="button">inside</button>
      </div>
      <button type="button">outside</button>
    </>
  );
}

describe("useClickOutside", () => {
  it("calls the handler on mousedown outside the element", () => {
    const onOutside = vi.fn();
    render(<Dropdown onOutside={onOutside} />);

    fireEvent.mouseDown(screen.getByText("outside"));

    expect(onOutside).toHaveBeenCalledOnce();
  });

  it("ignores mousedown inside the element", () => {
    const onOutside = vi.fn();
    render(<Dropdown onOutside={onOutside} />);

    fireEvent.mouseDown(screen.getByText("inside"));

    expect(onOutside).not.toHaveBeenCalled();
  });

  it("stops listening after unmount", () => {
    const onOutside = vi.fn();
    const { unmount } = render(<Dropdown onOutside={onOutside} />);

    unmount();
    fireEvent.mouseDown(document.body);

    expect(onOutside).not.toHaveBeenCalled();
  });
});
