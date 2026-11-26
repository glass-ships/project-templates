/** A link that uses the router for internal links and the browser for external links or links that the router can't handle. */

import type { ComponentProps } from "react";
import { useLayoutEffect } from "react";
import { Link, useLocation, useNavigationType } from "react-router";

/** same-site path prefixes served by something other than this app (backend, other sites on the domain) */
const SERVER_PATHS = ["/api/"];

// shortcut: other same-site server paths without an extension still go to the router and show the 404 page; add their prefix to SERVER_PATHS when one comes up
/** in-page anchors, files and SERVER_PATHS: the router can't render them, so the browser handles them */
const isNative = (href: string) => {
  const path = href.split(/[?#]/)[0];
  return href.startsWith("#") || /\.\w+$/.test(path) || SERVER_PATHS.some((prefix) => path.startsWith(prefix));
};

/** lets AppButton links navigate through the router, without a reload (provided via LinkContext in main.tsx) */
export default function RouterLink({ href = "", ...props }: ComponentProps<"a">) {
  return isNative(href) ? <a href={href} {...props} /> : <Link to={href} {...props} />;
}

/** the router never scrolls after changing pages; this does what a full page load would: to the #hash target, else to the top (render once in the layout) */
// shortcut: only finds elements present on the page's first render, not lazy or fetched content; retry until it appears if a link needs that
export function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const back = useNavigationType() === "POP"; // back/forward: let the browser put the old position back

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on a page change even when the hash is the same
  useLayoutEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else if (!back) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}
