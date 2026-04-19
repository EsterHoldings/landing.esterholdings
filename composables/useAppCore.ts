import NewsModule from "~/composables/core/modules/news/news.module";

export interface ICoreModules {
  news: NewsModule;
}

export const useAppCore = (): ICoreModules => ({
  news: new NewsModule(),
});

export default useAppCore;
