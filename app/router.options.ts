import type { RouterConfig } from "@nuxt/schema";
import type { RouteRecordRaw } from "vue-router";

const legacyArticleComponent = () => import("~/components/block/pages/LegacyArticleDetailPage.vue");
const legacyCompanyNewsCategoryComponent = () => import("~/components/block/pages/LegacyCompanyNewsCategoryPage.vue");
const legacyTraderBlogCategoryComponent = () => import("~/components/block/pages/LegacyTraderBlogCategoryPage.vue");

function legacyArticleRoutes(): RouteRecordRaw[] {
  return [
    {
      name: "legacy-article-en",
      path: "/en/:legacySlug",
      component: legacyArticleComponent,
    },
    {
      name: "legacy-article-ru",
      path: "/ru/:legacySlug",
      component: legacyArticleComponent,
    },
    {
      name: "legacy-article-ua",
      path: "/ua/:legacySlug",
      component: legacyArticleComponent,
    },
  ];
}

function legacyCategoryRoutes(): RouteRecordRaw[] {
  return [
    {
      name: "legacy-company-news-category-en",
      path: "/en/category/companys-news/:tail(.*)*",
      component: legacyCompanyNewsCategoryComponent,
    },
    {
      name: "legacy-company-news-category-ru",
      path: "/ru/category/companys-news/:tail(.*)*",
      component: legacyCompanyNewsCategoryComponent,
    },
    {
      name: "legacy-company-news-category-ua",
      path: "/ua/category/companys-news/:tail(.*)*",
      component: legacyCompanyNewsCategoryComponent,
    },
    {
      name: "legacy-trader-blog-category-en",
      path: "/en/category/traders-blog/:tail(.*)*",
      component: legacyTraderBlogCategoryComponent,
    },
    {
      name: "legacy-trader-blog-category-ru",
      path: "/ru/category/traders-blog/:tail(.*)*",
      component: legacyTraderBlogCategoryComponent,
    },
    {
      name: "legacy-trader-blog-category-ua",
      path: "/ua/category/traders-blog/:tail(.*)*",
      component: legacyTraderBlogCategoryComponent,
    },
  ];
}

export default <RouterConfig>{
  routes: routes => [...routes, ...legacyCategoryRoutes(), ...legacyArticleRoutes()],
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
