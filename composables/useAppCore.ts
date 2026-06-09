import NewsModule from "~/composables/core/modules/news/news.module";
import SeoModule from "~/composables/core/modules/seo/seo.module";

export interface ICoreModules {
  news: NewsModule;
  seo: SeoModule;
}

export const useAppCore = (): ICoreModules => ({
  news: new NewsModule(),
  seo: new SeoModule(),
});

export default useAppCore;
