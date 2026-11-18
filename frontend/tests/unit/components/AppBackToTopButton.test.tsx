import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppBackToTopButton from "@/components/ui/AppBackToTopButton";
import "@/global/icons";

describe("AppBackToTopButton", () => {
  // hidden: true because the button is display:none until the page is scrolled
  it("names the button with ariaLabel", () => {
    render(<AppBackToTopButton ariaLabel="Scroll up" />);

    expect(screen.getByRole("button", { name: "Scroll up", hidden: true })).toBeInTheDocument();
  });

  it("defaults the name to 'Back to top'", () => {
    render(<AppBackToTopButton />);

    expect(screen.getByRole("button", { name: "Back to top", hidden: true })).toBeInTheDocument();
  });
});
