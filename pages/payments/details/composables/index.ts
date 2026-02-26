import { reactive, Reactive } from "vue";

export interface IFormDataDto {
  paymentSystemId: string;
  name: string;
  data: Record<string, string>;
  documents: Array<Record<string, any>>;
}

export const formData: Reactive<IFormDataDto> = reactive({
  paymentSystemId: "",
  name: "",
  data: {},
  documents: [],
});
