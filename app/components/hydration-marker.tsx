"use client";

import { useEffect } from "react";

/**
 * Marks the document as hydrated once React attaches its handlers.
 *
 * Client-only widgets (language picker, copy buttons) do nothing until
 * hydration finishes, so end-to-end tests wait for this attribute instead of
 * racing the first paint. Renders nothing.
 */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return null;
}
