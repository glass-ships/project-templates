import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { download, downloadJson, downloadSvg } from "@/utils/download";

/** captures what each download would have saved */
let clicked: { filename: string; href: string }[];
let blobs: Blob[];

beforeEach(() => {
  clicked = [];
  blobs = [];
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    blobs.push(blob as Blob);
    return `blob:mock/${blobs.length}`;
  });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
    clicked.push({ filename: this.download, href: this.href });
  });
});

describe("download", () => {
  it("saves the data as a blob with the given type and filename", async () => {
    download("file contents", "report", "text/plain", "txt");

    expect(clicked).toEqual([{ filename: "report.txt", href: "blob:mock/1" }]);
    expect(blobs[0].type).toBe("text/plain");
    expect(await blobs[0].text()).toBe("file contents");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock/1");
  });

  it("joins filename parts with _ and replaces unsafe characters with -", () => {
    download("", ["my report", "v1.2", "final!"], "text/plain", "txt");
    expect(clicked[0].filename).toBe("my-report_v1-2_final-.txt");
  });
});

describe("downloadJson", () => {
  it("saves pretty-printed json", async () => {
    downloadJson({ a: 1 }, "data");

    expect(clicked[0].filename).toBe("data.json");
    expect(blobs[0].type).toBe("application/json");
    expect(await blobs[0].text()).toBe('{\n  "a": 1\n}');
  });
});

describe("downloadSvg", () => {
  // jsdom doesn't implement layout, so getBBox is missing
  beforeEach(() => {
    Object.defineProperty(SVGSVGElement.prototype, "getBBox", {
      value: () => ({ x: 1, y: 2, width: 30, height: 40 }),
      configurable: true,
    });
  });
  afterEach(() => {
    Reflect.deleteProperty(SVGSVGElement.prototype, "getBBox");
  });

  const makeSvg = () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <svg class="chart" data-id="1" aria-label="chart" role="img" tabindex="0">
        <clipPath id="clip"><rect /></clipPath>
        <circle class="dot" data-value="5" cx="10" cy="10" r="5" />
      </svg>`;
    document.body.append(container);
    return container.querySelector("svg") as SVGSVGElement;
  };

  it("saves a cleaned-up copy with a viewBox that fits its contents", async () => {
    const svg = makeSvg();

    downloadSvg(svg, "chart");

    expect(clicked[0].filename).toBe("chart.svg");
    expect(blobs[0].type).toBe("image/svg+xml");

    const saved = new DOMParser().parseFromString(await blobs[0].text(), "image/svg+xml").documentElement;
    expect(saved.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
    expect(saved.getAttribute("viewBox")).toBe("1 2 30 40");
    expect(saved.querySelector("clipPath")).toBeNull();

    const circle = saved.querySelector("circle");
    expect(circle?.getAttribute("cx")).toBe("10");
    expect(circle?.hasAttribute("class")).toBe(false);
    expect(circle?.hasAttribute("data-value")).toBe(false);
  });

  it("leaves the original svg untouched and removes the temporary copy", () => {
    const svg = makeSvg();
    const before = svg.outerHTML;

    downloadSvg(svg, "chart");

    expect(svg.outerHTML).toBe(before);
    expect(document.querySelectorAll("svg")).toHaveLength(1);
  });
});
