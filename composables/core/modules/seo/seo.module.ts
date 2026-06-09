import SeoService from "./seo.service";
import type { LandingSeoPayload } from "./seo.types";

export class SeoModule {
  private seoService: SeoService;

  constructor() {
    this.seoService = new SeoService();
  }

  async getLandingSeo(): Promise<{ data: LandingSeoPayload }> {
    return await this.seoService.getLandingSeo();
  }
}

export default SeoModule;
