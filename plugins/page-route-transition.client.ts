import { defineNuxtPlugin, useRouter } from "#app";

const LEAVE_MS = 220;
const ENTER_MS = 360;

const getPage = () => document.querySelector<HTMLElement>(".page-content > .page");

const cleanupPageClasses = (page?: HTMLElement | null) => {
  page?.classList.remove("page-route-leave", "page-route-enter", "page-route-enter-active");
  document.documentElement.classList.remove("page-route-is-changing");
};

export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.beforeEach((to, from) => {
    if (!from.name || to.path === from.path) return true;

    const page = getPage();
    if (!page) return true;

    cleanupPageClasses(page);
    document.documentElement.classList.add("page-route-is-changing");
    page.classList.add("page-route-leave");

    return new Promise<void>(resolve => {
      window.setTimeout(resolve, LEAVE_MS);
    });
  });

  router.afterEach((to, from, failure) => {
    if (failure) {
      cleanupPageClasses(getPage());
      return;
    }

    if (!from.name || to.path === from.path) return;

    window.requestAnimationFrame(() => {
      const page = getPage();

      if (!page) {
        cleanupPageClasses();
        return;
      }

      page.classList.remove("page-route-leave");
      page.classList.add("page-route-enter");

      window.requestAnimationFrame(() => {
        page.classList.add("page-route-enter-active");
      });

      window.setTimeout(() => cleanupPageClasses(page), ENTER_MS);
    });
  });

  router.onError(() => {
    cleanupPageClasses(getPage());
  });
});
