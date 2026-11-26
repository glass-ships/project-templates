import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AppCodeBlock from "@/components/ui/AppCodeBlock";

const getPre = () => document.querySelector("pre") as HTMLPreElement;

describe("AppCodeBlock", () => {
  it("renders the code in <pre><code>", () => {
    render(<AppCodeBlock>const a = 1;</AppCodeBlock>);

    const code = screen.getByText("const a = 1;");
    expect(code.tagName).toBe("CODE");
    expect(code.parentElement).toBe(getPre());
  });

  it("can be reached with the keyboard so it can be scrolled", async () => {
    render(<AppCodeBlock>const a = 1;</AppCodeBlock>);

    await userEvent.tab();

    expect(getPre()).toHaveFocus();
  });

  it("removes the indentation that comes from the JSX", () => {
    render(
      <AppCodeBlock>
        {`
          if (a) {
            b();
          }
        `}
      </AppCodeBlock>,
    );

    expect(getPre().textContent).toBe("if (a) {\n  b();\n}");
  });

  it("marks the language for syntax highlighters", () => {
    render(<AppCodeBlock language="ts">let a: number;</AppCodeBlock>);

    expect(screen.getByText("let a: number;")).toHaveClass("language-ts");
  });

  it("passes id and className through to the <pre>", () => {
    render(
      <AppCodeBlock id="sample" className="extra">
        x
      </AppCodeBlock>,
    );

    expect(getPre()).toHaveAttribute("id", "sample");
    expect(getPre()).toHaveClass("extra");
  });
});
