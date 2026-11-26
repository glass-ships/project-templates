// import { toast } from "react-toastify";

/** collapse whitespace in string */
export const collapse = (value = ""): string => value.replace(/\s+/g, " ").trim();

/** remove leading/trailing blank lines and the indentation shared by all non-blank lines */
export const dedent = (value = ""): string => {
  const lines = value.replace(/^\s*\n|\n\s*$/g, "").split("\n");
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent)).join("\n");
};

/** insert html word break opportunities, for use on long strings such as urls */
export const breakUrl = (value = ""): string =>
  /** non-alphanumeric char followed by alphanumeric char */
  value.replaceAll(/([^A-Za-z0-9])([A-Za-z0-9])/g, "$1<wbr/>$2");

/** strip html from string */
export const stripHtml = (html = "") => new DOMParser().parseFromString(html, "text/html").body.textContent || "";

/** format number value */
export const formatNumber = (value: number, compact = false) =>
  value
    .toLocaleString(undefined, {
      notation: compact ? "compact" : undefined,
    })
    .replace(/([^A-Za-z]+)([A-Za-z]+)/, "$1 $2");

/** safe copy to clipboard with notifications */
export const copyToClipboard = async (
  value: string,
  // message = "Copied to clipboard",
) => {
  try {
    await window.navigator.clipboard.writeText(value);
    // toast.success(message);
  } catch (error) {
    // toast.error(`Error copying to clipboard. See dev console for more info.`);
    console.error(error);
  }
};
