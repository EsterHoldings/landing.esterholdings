import type { RouterConfig } from "@nuxt/schema";
import type { RouteRecordRaw } from "vue-router";

const legacyArticleComponent = () => import("~/components/block/pages/LegacyArticleDetailPage.vue");
const legacyCompanyNewsCategoryComponent = () => import("~/components/block/pages/LegacyCompanyNewsCategoryPage.vue");
const legacyTraderBlogCategoryComponent = () => import("~/components/block/pages/LegacyTraderBlogCategoryPage.vue");
const legacyRouteMeta = { layout: "main" };

const legacyLocales = ["en", "ru", "ua"] as const;
const legacyArticlePrefixes = [
  "company-news",
  "companys-news",
  "trader-blog",
  "traders-blog",
  "analytics",
  "strategy",
  "strategies",
] as const;

function legacyArticleRoutes(): RouteRecordRaw[] {
  const rootArticleRoutes = legacyLocales.map(locale => ({
    name: `legacy-article-${locale}`,
    path: `/${locale}/:legacySlug`,
    component: legacyArticleComponent,
    meta: legacyRouteMeta,
  }));

  const prefixedArticleRoutes = legacyLocales.flatMap(locale =>
    legacyArticlePrefixes.map(prefix => ({
      name: `legacy-article-${locale}-${prefix}`,
      path: `/${locale}/${prefix}/:legacySlug(.*)*`,
      component: legacyArticleComponent,
      meta: legacyRouteMeta,
    }))
  );

  return [...prefixedArticleRoutes, ...rootArticleRoutes];
}

function legacyCategoryRoutes(): RouteRecordRaw[] {
  return [
    {
      name: "legacy-company-news-category-en",
      path: "/en/category/companys-news/:tail(.*)*",
      component: legacyCompanyNewsCategoryComponent,
      meta: legacyRouteMeta,
    },
    {
      name: "legacy-company-news-category-ru",
      path: "/ru/category/companys-news/:tail(.*)*",
      component: legacyCompanyNewsCategoryComponent,
      meta: legacyRouteMeta,
    },
    {
      name: "legacy-company-news-category-ua",
      path: "/ua/category/companys-news/:tail(.*)*",
      component: legacyCompanyNewsCategoryComponent,
      meta: legacyRouteMeta,
    },
    {
      name: "legacy-trader-blog-category-en",
      path: "/en/category/traders-blog/:tail(.*)*",
      component: legacyTraderBlogCategoryComponent,
      meta: legacyRouteMeta,
    },
    {
      name: "legacy-trader-blog-category-ru",
      path: "/ru/category/traders-blog/:tail(.*)*",
      component: legacyTraderBlogCategoryComponent,
      meta: legacyRouteMeta,
    },
    {
      name: "legacy-trader-blog-category-ua",
      path: "/ua/category/traders-blog/:tail(.*)*",
      component: legacyTraderBlogCategoryComponent,
      meta: legacyRouteMeta,
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
