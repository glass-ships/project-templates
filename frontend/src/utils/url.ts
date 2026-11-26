/** is url absolute (as opposed to relative) */
export const isAbsolute = (url = ""): boolean =>
  ["http:", "https:", "ftp:", "mailto:"].some((prefix) => url.startsWith(prefix));

/** is url outside of glass-ships domain */
export const isExternal = (url = ""): boolean =>
  // isAbsolute(url) && !getUrl(url, "hostname").endsWith("glass-ships.com");
  isAbsolute(url) && getUrl(url, "hostname") !== window.location.hostname;

/** Safely get part of url */
export const getUrl = (url: string, part: KeysMatching<URL, string>): string => {
  try {
    return new URL(url)[part];
  } catch (error) {
    console.error(`[getURL] Invalid URL: ${url} (${error})`);
    return "";
  }
};

/** Get keys of object T whose values are of type V
 *  https://stackoverflow.com/q/54520676/9878785
 */
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
