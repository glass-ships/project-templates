/**
 * VisuallyHidden component for rendering content invisible,
 * but still accessible to screen readers / other assistive technologies
 */

// "use client";

import type React from "react";

import { useVisuallyHidden } from "react-aria";

type VisuallyHiddenSpanProps = {
  children: React.ReactNode;
};

const VisuallyHidden = ({ children }: VisuallyHiddenSpanProps) => {
  const { visuallyHiddenProps } = useVisuallyHidden();

  return <span {...visuallyHiddenProps}>{children}</span>;
};

export { VisuallyHidden };
