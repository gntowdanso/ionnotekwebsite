"use client";

import { useEffect } from "react";

export function HashAnchorScroller() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;

      if (!hash) {
        return;
      }

      const targetId = decodeURIComponent(hash.slice(1));
      const attemptScroll = (attempt = 0) => {
        const target = document.getElementById(targetId);

        if (!target) {
          if (attempt < 6) {
            window.setTimeout(() => attemptScroll(attempt + 1), 150);
          }

          return;
        }

        const targetTop = target.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: attempt === 0 ? "auto" : "smooth" });

        if (attempt < 4 && Math.abs(target.getBoundingClientRect().top) > 8) {
          window.setTimeout(() => attemptScroll(attempt + 1), 150);
        }
      };

      requestAnimationFrame(() => {
        attemptScroll();
      });
    };

    scrollToHash();
    window.addEventListener("load", scrollToHash);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("load", scrollToHash);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}