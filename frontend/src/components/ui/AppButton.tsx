// Generic button component that either does something (<button>) or goes somewhere (<a>)

/**
 * TODO: add copy
 * TODO: add tooltip
 */
import type React from "react";
import { useContext } from "react";
import styles from "./AppButton.module.scss";
import AppIcon, { type AppIconProps } from "./AppIcon";
import { LinkContext } from "./LinkContext";

// import { copyToClipboard } from "@/utils/string";

interface AppButtonBaseProps {
  id?: string;
  color?: "primary" | "secondary" | "tertiary" | "none";
  design?: "normal" | "circle" | "small";
  type?: "button" | "link" | "submit";
  icon?: string;
  iconColor?: string;
  iconPosition?: "left" | "right";
  linkTo?: string;
  newTab?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | null) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Needs visible `text`, an `ariaLabel`, or both, so the button always has an accessible name.
 * An `ariaLabel` replaces `text` as the accessible name; if you pass both, include the text in the label.
 */
export type AppButtonProps = AppButtonBaseProps &
  ({ text: string; ariaLabel?: string } | { text?: string; ariaLabel: string });

export default function AppButton({
  id,
  color = "primary",
  design = "normal",
  type = "button",
  text = "",
  ariaLabel,
  icon = "",
  iconColor,
  iconPosition = "right",
  linkTo = "",
  newTab = false,
  onClick = undefined,
  onKeyDown = undefined,
}: AppButtonProps) {
  const Anchor = useContext(LinkContext);
  const buttonClass = `${styles.button} ${styles[color]} ${styles[design]} ${text ? styles.text : ""}`;
  const iconArgs: AppIconProps = {
    icon,
    color: iconColor ?? "currentColor", // match the button text in both themes
    size: text ? "tiny" : "small",
  };

  const content = (
    <>
      {icon && iconPosition === "left" && <AppIcon {...iconArgs} />}
      {text && <span className={styles.text}>{text}</span>}
      {icon && iconPosition === "right" && <AppIcon {...iconArgs} />}
    </>
  );

  if (type === "link" || linkTo !== "") {
    return (
      <Anchor id={id} href={linkTo} target={newTab ? "_blank" : "_self"} aria-label={ariaLabel} className={buttonClass}>
        {content}
      </Anchor>
    );
  }
  return (
    <button id={id} type={type} onClick={onClick} onKeyDown={onKeyDown} aria-label={ariaLabel} className={buttonClass}>
      {content}
    </button>
  );
}
