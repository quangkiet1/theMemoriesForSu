"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * Hook to pause animations when the document/tab is not visible.
 * Returns a ref that you can check to know whether to animate.
 */
export function useVisibilityPause(
  onVisible: () => void,
  onHidden: () => void
): void {
  const onVisibleRef = useRef(onVisible);
  const onHiddenRef = useRef(onHidden);

  useEffect(() => {
    onVisibleRef.current = onVisible;
    onHiddenRef.current = onHidden;
  });

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      onHiddenRef.current();
    } else {
      onVisibleRef.current();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
}
