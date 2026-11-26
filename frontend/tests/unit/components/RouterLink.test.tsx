import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RouterLink, { ScrollToHash } from "@/components/RouterLink";

const Location = () => {
  const { pathname, hash } = useLocation();
  return <output>{pathname + hash}</output>;
};

const Back = () => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      back
    </button>
  );
};

/** jsdom can't follow a real navigation; cancel it after the router has had its turn */
const cancelNavigation = (event: Event) => event.preventDefault();

describe("RouterLink", () => {
  beforeEach(() => document.addEventListener("click", cancelNavigation));
  afterEach(() => document.removeEventListener("click", cancelNavigation));

  it.each([
    ["/docs", "/docs"],
    ["/docs?tab=2", "/docs"],
    ["#section", "/"],
    ["/images/favicon.ico", "/"],
    ["/report.pdf?v=2", "/"],
    ["/report.pdf#page=3", "/"],
    ["/api/report", "/"],
    ["/apiary", "/apiary"],
  ])("%s ends the router on %s", async (href, location) => {
    render(
      <MemoryRouter>
        <RouterLink href={href}>go</RouterLink>
        <Location />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("link", { name: "go" }));

    expect(screen.getByRole("status").textContent).toBe(location);
  });
});

describe("ScrollToHash", () => {
  // jsdom doesn't implement scrolling
  const scrollIntoView = vi.fn();
  beforeEach(() => {
    scrollIntoView.mockClear();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  it("scrolls to the #hash target after moving to another page", async () => {
    render(
      <MemoryRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<RouterLink href="/docs#install">go</RouterLink>} />
          <Route path="/docs" element={<h2 id="install">Install</h2>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(scrollIntoView).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("link", { name: "go" }));

    expect(scrollIntoView).toHaveBeenCalledOnce();
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("heading", { name: "Install" }));
  });

  it("scrolls again when the next page uses the same #hash", async () => {
    render(
      <MemoryRouter initialEntries={["/a#top"]}>
        <ScrollToHash />
        <Routes>
          <Route path="/a" element={<RouterLink href="/b#top">go</RouterLink>} />
          <Route path="/b" element={<h2 id="top">Page B</h2>} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("link", { name: "go" }));

    expect(scrollIntoView.mock.contexts.at(-1)).toBe(screen.getByRole("heading", { name: "Page B" }));
  });

  it("opens a new page at the top, but leaves back/forward to the browser", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<RouterLink href="/docs">go</RouterLink>} />
          <Route path="/docs" element={<Back />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(scrollTo).not.toHaveBeenCalled(); // the first load is a POP too

    await userEvent.click(screen.getByRole("link", { name: "go" }));
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ top: 0, behavior: "instant" }));

    await userEvent.click(screen.getByRole("button", { name: "back" }));
    expect(screen.getByRole("link", { name: "go" })).toBeDefined();
    expect(scrollTo).toHaveBeenCalledOnce();
    scrollTo.mockRestore();
  });

  it("decodes ids the URL encoded", () => {
    render(
      <MemoryRouter initialEntries={["/docs#getting%20started"]}>
        <ScrollToHash />
        <h2 id="getting started">Getting started</h2>
      </MemoryRouter>,
    );
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("heading"));
  });
});
