"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type DocsTocItem = {
  id: string;
  label: string;
};

type DocsTocProps = {
  label: string;
  items: DocsTocItem[];
  className?: string;
};

/**
 * "On this page" navigation with scroll-spy active state.
 *
 * Sections are observed with a narrow band near the top of the viewport so
 * the highlighted entry follows the section being read, like Vercel's docs.
 */
export function DocsToc({ label, items, className }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={cn("text-sm", className)}>
      <p className="text-hyperjump-black mb-3 text-xs font-semibold">{label}</p>
      <ul className="space-y-0.5">
        {items.map(({ id, label: itemLabel }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={activeId === id ? "location" : undefined}
              className={cn(
                "block border-l py-1.5 pl-3 text-[13px] leading-snug transition-colors",
                activeId === id
                  ? "border-hyperjump-blue text-hyperjump-black font-medium"
                  : "text-hyperjump-muted hover:text-hyperjump-black border-black/10 hover:border-black/30"
              )}>
              {itemLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
