import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ThemeToggle from "@/components/ui/ThemeToggle";

const stubPrefersLight = (prefersLight: boolean) =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: prefersLight, media: query })),
  );

const getCheckbox = () => screen.getByRole("checkbox") as HTMLInputElement;

describe("ThemeToggle", () => {
  it("uses the saved theme", () => {
    stubPrefersLight(false);
    localStorage.setItem("theme", "light");

    render(<ThemeToggle />);

    expect(document.body).toHaveClass("light");
    expect(getCheckbox().checked).toBe(true);
  });

  it("falls back to the system preference when nothing is saved", () => {
    stubPrefersLight(true);
    render(<ThemeToggle />);

    expect(document.body).toHaveClass("light");
    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: light)");
  });

  it("defaults to dark", () => {
    stubPrefersLight(false);
    render(<ThemeToggle />);

    expect(document.body).toHaveClass("dark");
    expect(getCheckbox().checked).toBe(false);
  });

  it("switches and saves the theme on click", async () => {
    stubPrefersLight(false);
    render(<ThemeToggle />);

    await userEvent.click(getCheckbox());
    expect(document.body).toHaveClass("light");
    expect(document.body).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");

    await userEvent.click(getCheckbox());
    expect(document.body).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("can be toggled through its label", async () => {
    stubPrefersLight(false);
    render(<ThemeToggle />);

    await userEvent.click(screen.getByText("Toggle"));

    expect(document.body).toHaveClass("light");
  });
});
