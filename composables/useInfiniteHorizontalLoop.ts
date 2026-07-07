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
  let pointerStartX = 0;
  let pointerStartOffset = 0;
  let pointerActive = false;
  let resumeAfterPointer = false;
  let suppressClick = false;
  let currentOffset = 0;
  let loopAnimation: Animation | null = null;
  let loopDuration = 0;
  let resizeObserver: ResizeObserver | null = null;
  let refreshFrame: number | null = null;
  let lastSegmentWidth = 0;

  const segmentWidth = (): number => {
    if (!track.value) return 0;

    return track.value.scrollWidth / copies;
  };

  const pixelsPerSecond = (): number => Math.max(1, speed * 60);

  const normalizeOffsetValue = (value: number): number => {
    const width = segmentWidth();
    if (width <= 0) return value;

    let nextValue = value;
    while (nextValue < width) {
      nextValue += width;
    }

    while (nextValue >= width * 2) {
      nextValue -= width;
    }

    return nextValue;
  };

  const animationOffset = (): number => {
    const width = segmentWidth();
    if (!loopAnimation || loopDuration <= 0 || width <= 0) return currentOffset;

    const time = Number(loopAnimation.currentTime ?? 0);
    const phase = (time % loopDuration) / loopDuration;

    return width + phase * width;
  };

  const applyTransform = (value: number) => {
    if (!track.value) return;

    currentOffset = normalizeOffsetValue(value);
    track.value.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
  };

  const cancelLoopAnimation = () => {
    if (!loopAnimation) return;

    currentOffset = animationOffset();
    loopAnimation.cancel();
    loopAnimation = null;
    applyTransform(currentOffset);
  };

  const createLoopAnimation = () => {
    const trackElement = track.value;
    const width = segmentWidth();
    if (!trackElement || width <= 0) return;

    const previousPlayState = loopAnimation?.playState;
    cancelLoopAnimation();
    currentOffset = normalizeOffsetValue(currentOffset || width);
    loopDuration = (width / pixelsPerSecond()) * 1000;
    loopAnimation = trackElement.animate(
      [{ transform: `translate3d(${-width}px, 0, 0)` }, { transform: `translate3d(${-width * 2}px, 0, 0)` }],
      {
        duration: loopDuration,
        iterations: Infinity,
        easing: "linear",
      }
    );
    loopAnimation.currentTime = ((currentOffset - width) / width) * loopDuration;

    if (previousPlayState && previousPlayState !== "running") {
      loopAnimation.pause();
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

        currentOffset = width;

        if (loopAnimation) {
          createLoopAnimation();
          return;
        }

        applyTransform(width);
      }, 0);
    });
  };

  const refreshLoopPosition = (attempt = 0) => {
    void nextTick(() => {
      window.setTimeout(() => {
        const viewportElement = viewport.value;
        const width = segmentWidth();
        if (!viewportElement) return;
        if (width <= 0) {
          if (attempt < 6) {
            window.setTimeout(() => refreshLoopPosition(attempt + 1), 50);
          }

          return;
        }

        if (loopAnimation) {
          createLoopAnimation();
          return;
        }

        applyTransform(currentOffset || width);
      }, 0);
    });
  };

  const scheduleLoopRefresh = () => {
    if (refreshFrame !== null) return;

    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = null;
      refreshLoopPosition();
    });
  };

  const observeTrackSize = (trackElement: HTMLElement | null) => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    lastSegmentWidth = segmentWidth();

    if (!trackElement || typeof ResizeObserver === "undefined") return;

    resizeObserver = new ResizeObserver(() => {
      const width = segmentWidth();
      if (width <= 0 || Math.abs(width - lastSegmentWidth) < 0.5) return;

      lastSegmentWidth = width;
      scheduleLoopRefresh();
    });
    resizeObserver.observe(trackElement);
  };

  const startAnimation = () => {
    if (loopAnimation) {
      loopAnimation.play();
      return;
    }

    createLoopAnimation();
  };

  const stopAnimation = () => {
    if (!loopAnimation) return;

    currentOffset = animationOffset();
    loopAnimation.pause();
  };

  const handleScroll = () => {
    viewport.value?.scrollTo({ left: 0 });
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !viewport.value) return;

    pointerActive = true;
    resumeAfterPointer = loopAnimation?.playState === "running";
    pointerStartX = event.clientX;
    pointerStartOffset = loopAnimation ? animationOffset() : currentOffset;
    cancelLoopAnimation();
    viewport.value.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!pointerActive || !viewport.value) return;

    const delta = event.clientX - pointerStartX;
    if (Math.abs(delta) > 3) {
      isDragging.value = true;
      suppressClick = true;
    }

    applyTransform(pointerStartOffset - delta);
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
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (refreshFrame !== null) {
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = null;
    }
    cancelLoopAnimation();
  });

  watch(
    [viewport, track],
    ([viewportElement, trackElement]) => {
      if (!viewportElement || !trackElement) return;

      resetLoopPosition();
      observeTrackSize(trackElement);
    },
    { flush: "post" }
  );

  return {
    copies,
    isDragging,
    resetLoopPosition,
    refreshLoopPosition,
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
