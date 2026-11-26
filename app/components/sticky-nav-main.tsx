import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StickyNavigationProps = {
  children: ReactNode;
  /** Render the scrolled, light-bar style from the start, without animation. */
  solid?: boolean;
};

export default function StickyNavigationMain({
  children,
  solid = false
}: StickyNavigationProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 shadow-xs",
        solid
          ? "bg-white"
          : "transition-colors duration-300 group-data-[scroll=false]:bg-transparent group-data-[scroll=true]:bg-white"
      )}>
      {children}
    </header>
  );
}
