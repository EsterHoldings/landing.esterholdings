import { reactive, Reactive } from "vue";

export interface IFormDataDto {
  email: string;
  first_name: string;
  mid_name: string;
  last_name: string;
  birthdate: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postal_code: string;
  country_id: string | null;
  state_id: string | null;
  city_id: string | null;
}

export const formData: Reactive<IFormDataDto> = reactive({
  email: "",
  first_name: "",
  mid_name: "",
  last_name: "",
  birthdate: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  address: "",
  postal_code: "",
  country_id: null,
  state_id: null,
  city_id: null,
});
