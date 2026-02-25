import { ref, onMounted, onBeforeUnmount } from "vue";

const isBlurred = ref(false);
export const isSlideWithoutPicture = ref(false);

export default function useTrackScroll() {
  const checkScroll = () => {
    isBlurred.value = window.scrollY > 50;
  };

  const checkPicture = (images: { src?: string }[], slide: number): boolean => {
    const noImage = !images[slide]?.src;

    isSlideWithoutPicture.value = noImage;
    return noImage;
  };

  onMounted(() => {
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", checkScroll);
    isBlurred.value = false;
  });

  return {
    isBlurred,
    checkPicture,
  };
}
