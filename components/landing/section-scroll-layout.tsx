"use client";

import {
  Children,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

const SECTION_SELECTOR = "[data-scroll-section]";
const SNAP_THRESHOLD = 48;
const SNAP_SETTLE_DISTANCE = 8;
const SECTION_EDGE_THRESHOLD = 96;
const SNAP_TIMEOUT_MS = 1400;
const SNAP_COOLDOWN_MS = 500;
const COMPACT_SECTION_RATIO = 1.08;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isBlockedTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable='true'], [data-disable-section-snap]"
    )
  );
}

export function SectionScrollLayout({
  children,
}: {
  children: ReactNode;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wheelBufferRef = useRef(0);
  const isSnappingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const getSections = useEffectEvent(() =>
    Array.from(
      shellRef.current?.querySelectorAll<HTMLElement>(SECTION_SELECTOR) ?? []
    )
  );

  const getCurrentIndex = useEffectEvent((sections: HTMLElement[]) => {
    const viewportMiddle = window.scrollY + window.innerHeight * 0.5;

    const containingIndex = sections.findIndex((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      return viewportMiddle >= top && viewportMiddle < bottom;
    });

    if (containingIndex !== -1) {
      return containingIndex;
    }

    const scrollTop = window.scrollY;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section, index) => {
      const distance = Math.abs(section.offsetTop - scrollTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  });

  const canSnapFromSection = useEffectEvent(
    (section: HTMLElement, direction: -1 | 1) => {
      const viewportHeight = window.innerHeight;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      const scrollTop = window.scrollY;
      const topDistance = Math.max(0, scrollTop - sectionTop);
      const bottomDistance = Math.max(
        0,
        sectionBottom - (scrollTop + viewportHeight)
      );
      const isCompactSection =
        sectionHeight <= viewportHeight * COMPACT_SECTION_RATIO;

      if (isCompactSection) {
        return Math.abs(scrollTop - sectionTop) <= SNAP_SETTLE_DISTANCE;
      }

      if (direction > 0) {
        return bottomDistance <= SECTION_EDGE_THRESHOLD;
      }

      return topDistance <= SECTION_EDGE_THRESHOLD;
    }
  );

  const finishSnap = useEffectEvent(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isSnappingRef.current = false;
    wheelBufferRef.current = 0;
    cooldownUntilRef.current = performance.now() + SNAP_COOLDOWN_MS;
  });

  const snapToIndex = useEffectEvent((targetIndex: number) => {
    const sections = getSections();
    const nextSection = sections[targetIndex];

    if (!nextSection) {
      return;
    }

    const targetTop = nextSection.offsetTop;
    const startedAt = performance.now();

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    isSnappingRef.current = true;
    wheelBufferRef.current = 0;
    window.scrollTo({ top: targetTop, behavior: "smooth" });

    const watch = () => {
      const distance = Math.abs(window.scrollY - targetTop);
      const timedOut = performance.now() - startedAt >= SNAP_TIMEOUT_MS;

      if (distance <= SNAP_SETTLE_DISTANCE || timedOut) {
        finishSnap();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(watch);
    };

    animationFrameRef.current = requestAnimationFrame(watch);
  });

  useEffect(() => {
    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    const syncEnabledState = () => {
      setIsEnabled(desktopMedia.matches && !reducedMotionMedia.matches);
    };

    syncEnabledState();

    desktopMedia.addEventListener("change", syncEnabledState);
    reducedMotionMedia.addEventListener("change", syncEnabledState);

    return () => {
      desktopMedia.removeEventListener("change", syncEnabledState);
      reducedMotionMedia.removeEventListener("change", syncEnabledState);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("has-section-snap");
    document.body.classList.add("has-section-snap");

    return () => {
      document.documentElement.classList.remove("has-section-snap");
      document.body.classList.remove("has-section-snap");
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      finishSnap();
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        Math.abs(event.deltaY) < 3 ||
        isBlockedTarget(event.target)
      ) {
        return;
      }

      if (isSnappingRef.current || performance.now() < cooldownUntilRef.current) {
        event.preventDefault();
        return;
      }

      const sections = getSections();
      if (sections.length < 2) {
        return;
      }

      const currentIndex = getCurrentIndex(sections);
      const currentSection = sections[currentIndex];
      const direction = event.deltaY > 0 ? 1 : -1;
      const canSnap =
        direction > 0
          ? currentIndex < sections.length - 1 &&
            canSnapFromSection(currentSection, 1)
          : currentIndex > 0 && canSnapFromSection(currentSection, -1);

      if (!canSnap) {
        wheelBufferRef.current = 0;
        return;
      }

      if (
        wheelBufferRef.current !== 0 &&
        Math.sign(wheelBufferRef.current) !== direction
      ) {
        wheelBufferRef.current = 0;
      }

      wheelBufferRef.current += event.deltaY;

      if (Math.abs(wheelBufferRef.current) < SNAP_THRESHOLD) {
        event.preventDefault();
        return;
      }

      const nextIndex = clamp(currentIndex + direction, 0, sections.length - 1);
      wheelBufferRef.current = 0;

      if (nextIndex === currentIndex) {
        return;
      }

      event.preventDefault();
      snapToIndex(nextIndex);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      finishSnap();
    };
  }, [canSnapFromSection, finishSnap, getCurrentIndex, getSections, isEnabled, snapToIndex]);

  return (
    <div ref={shellRef} className="relative">
      {Children.toArray(children).map((child, index) => (
        <div
          key={index}
          data-scroll-section
          className="section-scroll-target relative"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
