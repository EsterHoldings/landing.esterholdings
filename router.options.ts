// app/router.options.ts
import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            top: 120,
            behavior: "smooth",
          });
        }, 60);
      });
    }

    if (to.fullPath.split("#")[0] === from.fullPath.split("#")[0]) {
      return false;
    }

    return { left: 0, top: 0 };
  },
};
