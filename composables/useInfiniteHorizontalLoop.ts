import { nextTick, onUnmounted, ref, watch, type Ref } from "vue";

type InfiniteLoopOptions = {
  copies?: number;
  speed?: number;
};

const DEFAULT_COPIES = 3;

export const useInfiniteHorizontalLoop = (
  viewport: Ref<HTMLElement | null>,
  track: Ref<HTMLElement | null>,
  options: InfiniteLoopOptions = {}
) => {
  const isDragging = ref(false);
  const copies = Math.max(3, options.copies ?? DEFAULT_COPIES);
  const speed = options.speed ?? 0.4;
  let animationFrameId: number | null = null;
  let pointerStartX = 0;
  let pointerStartScrollLeft = 0;
  let pointerActive = false;
  let resumeAfterPointer = false;
  let suppressClick = false;
  let scrollPosition = 0;
  let isApplyingScroll = false;

  const segmentWidth = (): number => {
    if (!track.value) return 0;

    return track.value.scrollWidth / copies;
  };

  const setScrollLeft = (value: number) => {
    const viewportElement = viewport.value;
    if (!viewportElement) return;

    scrollPosition = value;
    isApplyingScroll = true;
    viewportElement.scrollLeft = value;
    window.setTimeout(() => {
      isApplyingScroll = false;
    }, 0);
  };

  const normalizeScrollPosition = () => {
    const viewportElement = viewport.value;
    const width = segmentWidth();
    if (!viewportElement || width <= 0) return;

    const min = width * 0.5;
    const max = width * 1.5;
    const currentScrollLeft = scrollPosition || viewportElement.scrollLeft;

    if (currentScrollLeft < min) {
      setScrollLeft(currentScrollLeft + width);
    } else if (currentScrollLeft > max) {
      setScrollLeft(currentScrollLeft - width);
    }
  };

  const resetLoopPosition = (attempt = 0) => {
    void nextTick(() => {
      window.setTimeout(() => {
        const viewportElement = viewport.value;
        const width = segmentWidth();
        if (!viewportElement) return;
        if (width <= 0) {
          if (attempt < 6) {
            window.setTimeout(() => resetLoopPosition(attempt + 1), 50);
          }

          return;
        }

        setScrollLeft(width);
      }, 0);
    });
  };

  const animate = () => {
    const viewportElement = viewport.value;
    if (viewportElement) {
      scrollPosition = scrollPosition || viewportElement.scrollLeft;
      setScrollLeft(scrollPosition + speed);
      normalizeScrollPosition();
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationFrameId !== null) return;

    scrollPosition = viewport.value?.scrollLeft ?? scrollPosition;
    animate();
  };

  const stopAnimation = () => {
    if (animationFrameId === null) return;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };

  const handleScroll = () => {
    if (!isApplyingScroll) {
      scrollPosition = viewport.value?.scrollLeft ?? scrollPosition;
    }

    normalizeScrollPosition();
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !viewport.value) return;

    pointerActive = true;
    resumeAfterPointer = animationFrameId !== null;
    pointerStartX = event.clientX;
    pointerStartScrollLeft = viewport.value.scrollLeft;
    scrollPosition = pointerStartScrollLeft;
    stopAnimation();
    viewport.value.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!pointerActive || !viewport.value) return;

    const delta = event.clientX - pointerStartX;
    if (Math.abs(delta) > 3) {
      isDragging.value = true;
      suppressClick = true;
    }

    setScrollLeft(pointerStartScrollLeft - delta);
    normalizeScrollPosition();
  };

  const finishPointer = (event: PointerEvent) => {
    if (!pointerActive) return;

    viewport.value?.releasePointerCapture?.(event.pointerId);
    pointerActive = false;
    isDragging.value = false;

    if (resumeAfterPointer) {
      startAnimation();
    }

    window.setTimeout(() => {
      suppressClick = false;
    }, 120);
  };

  const handleClickCapture = (event: MouseEvent) => {
    if (!suppressClick) return;

    event.preventDefault();
    event.stopPropagation();
  };

  onUnmounted(() => {
    stopAnimation();
  });

  watch(
    [viewport, track],
    ([viewportElement, trackElement]) => {
      if (!viewportElement || !trackElement) return;

      resetLoopPosition();
    },
    { flush: "post" }
  );

  return {
    copies,
    isDragging,
    resetLoopPosition,
    startAnimation,
    stopAnimation,
    handleScroll,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointer,
    handlePointerCancel: finishPointer,
    handleClickCapture,
  };
};
