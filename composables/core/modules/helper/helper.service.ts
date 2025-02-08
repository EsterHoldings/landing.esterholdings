import useApi from "~/composables/useApi";

export class HelperService {

  private useApi:any;
  constructor() {
    this.useApi = new useApi();
  }
  async validationIsUnique(params: {}):Promise<any> {
    return await this.useApi.get("/validation-is-unique", params);
  }
}

export default HelperService;