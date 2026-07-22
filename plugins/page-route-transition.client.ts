import { defineNuxtPlugin, useRouter } from "#app";

const ENTER_MS = 220;

const getPage = () => document.querySelector<HTMLElement>(".page-content > .page");

const cleanupPageClasses = (page?: HTMLElement | null) => {
  page?.classList.remove("page-route-leave", "page-route-enter", "page-route-enter-active");
  document.documentElement.classList.remove("page-route-is-changing");
};

export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.beforeEach((to, from) => {
    if (!from.name || to.path === from.path) return true;

    cleanupPageClasses(getPage());
    document.documentElement.classList.add("page-route-is-changing");
    return true;
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
