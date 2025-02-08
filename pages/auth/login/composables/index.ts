import {Ref, ref} from "vue";

export interface IFormDataDto {
  email: String;
  password?: String;
}

export const formData: Ref<IFormDataDto> = ref({
  email: "",
  password: "",
});
