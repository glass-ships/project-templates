// Block of preformatted code that keyboard users can focus and scroll

import { dedent } from "@/utils/string";
import styles from "./AppCodeBlock.module.scss";

export type AppCodeBlockProps = {
  /** The code. Surrounding blank lines and common indentation are removed, so it can be indented to match the JSX. */
  children: string;
  /** Adds `language-<name>` to the <code>, the class syntax highlighters (Prism, highlight.js, Shiki) look for. */
  language?: string;
  className?: string;
  id?: string;
};

export default function AppCodeBlock({ children, language, className = "", id }: AppCodeBlockProps) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable regions must be keyboard-focusable so keyboard users can scroll them (axe scrollable-region-focusable)
    <pre id={id} className={`${styles.codeblock} ${className}`} tabIndex={0}>
      <code className={language ? `language-${language}` : undefined}>{dedent(children)}</code>
    </pre>
  );
}
