import { useEffect, useRef } from "react";

export function useIntersectionObserver(
  onIntersect: () => void,
  { enabled = true, threshold = 0.1, rootMargin = "20px" } = {}
) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onIntersect, enabled, threshold, rootMargin]);

  return targetRef;
}
