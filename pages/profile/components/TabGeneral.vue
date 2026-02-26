<template>
  <div class="profile__tab--general">
    <div class="profile__tab--general__profile-data__photo">
      <UserPhotoUploader class="ml-5 mr-5" />
    </div>

    <div class="profile__tab--general_wrapper">
      <div class="profile__tab--general__profile-data">
        <div class="profile__tab--general__profile-data__form">
          <UiFormControl
            class="profile__tab--general__profile-data__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.email')"
            :errors="validatorUserDataForm.errorsFormData.email.errors">
            <UiInput
              :isLoading="isLoadingAllComponentData"
              type="text"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.email')"
              :value="formData.email"
              :disabled="true"
              :isDirty="validatorUserDataForm.errorsFormData.email.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.email.errors.length > 0"
              @blur="validatorUserDataForm.doValidateField('email', formData.email)" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.first_name')"
            :errors="validatorUserDataForm.errorsFormData.first_name.errors">
            <UiInput
              :isLoading="isLoadingAllComponentData"
              type="text"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.first_name')"
              :value="formData.first_name"
              :isDirty="validatorUserDataForm.errorsFormData.first_name.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.first_name.errors.length > 0"
              @input="validatorUserDataForm.doValidateField('first_name', $event)"
              @blur="validatorUserDataForm.doValidateField('first_name', $event.target.value)" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.last_name')"
            :errors="validatorUserDataForm.errorsFormData.last_name.errors">
            <UiInput
              :isLoading="isLoadingAllComponentData"
              type="text"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.last_name')"
              :value="formData.last_name"
              :isDirty="validatorUserDataForm.errorsFormData.last_name.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.last_name.errors.length > 0"
              @input="validatorUserDataForm.doValidateField('last_name', $event)"
              @blur="validatorUserDataForm.doValidateField('last_name', $event.target.value)" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.mid_name')"
            :errors="validatorUserDataForm.errorsFormData.mid_name.errors">
            <UiInput
              :isLoading="isLoadingAllComponentData"
              type="text"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.mid_name')"
              :value="formData.mid_name"
              :isDirty="validatorUserDataForm.errorsFormData.mid_name.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.mid_name.errors.length > 0"
              @input="validatorUserDataForm.doValidateField('mid_name', $event)"
              @blur="validatorUserDataForm.doValidateField('mid_name', $event.target.value)" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.birthdate')"
            :errors="validatorUserDataForm.errorsFormData.birthdate.errors">
            <UiInputDate
              :isLoading="isLoadingAllComponentData"
              :value="formData.birthdate"
              :isDirty="validatorUserDataForm.errorsFormData.birthdate.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.birthdate.errors.length > 0"
              @input="handleInputBirthday"
              @blur="handleInputBirthday" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.phone')"
            :errors="validatorUserDataForm.errorsFormData.phone.errors">
            <UiInputPhone
              type="number"
              :isLoading="isLoadingAllComponentData"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.phone')"
              v-model="formData.phone"
              :isDirty="validatorUserDataForm.errorsFormData.phone.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.phone.errors.length > 0"
              @input="validatorUserDataForm.doValidateField('phone', $event)"
              @blur="validatorUserDataForm.doValidateField('phone', formData.phone)" />
          </UiFormControl>
        </div>
      </div>

      <div class="profile__tab--general__profile-data--additional">
        <div class="profile__tab--general__profile-data--additional__form">
          <UiFormControl
            class="profile__tab--general__profile-data--additional__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.country')"
            :errors="validatorUserDataForm.errorsFormData.country.errors">
            <UiSelect
              :data="countryOptions"
              :value="selectedCountryId"
              :isDirty="validatorUserDataForm.errorsFormData.country.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.country.errors.length > 0"
              searchable
              :searchValue="countrySearch"
              :searchPlaceholder="t('cabinet.profile.components.tab-general.labels.country')"
              @change="handleCountryChange"
              @blur="handleCountryBlur"
              @search="handleCountrySearch"
              @loadMore="loadMoreCountries" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data--additional__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.state')"
            :errors="validatorUserDataForm.errorsFormData.state.errors">
            <UiSelect
              :data="stateOptions"
              :value="selectedStateId"
              :isDirty="validatorUserDataForm.errorsFormData.state.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.state.errors.length > 0"
              searchable
              :searchValue="stateSearch"
              :searchPlaceholder="t('cabinet.profile.components.tab-general.labels.state')"
              @change="handleStateChange"
              @blur="handleStateBlur"
              @search="handleStateSearch"
              @loadMore="loadMoreStates" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data--additional__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.city')"
            :errors="validatorUserDataForm.errorsFormData.city.errors">
            <UiSelect
              :data="cityOptions"
              :value="selectedCityId"
              :isDirty="validatorUserDataForm.errorsFormData.city.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.city.errors.length > 0"
              searchable
              :searchValue="citySearch"
              :searchPlaceholder="t('cabinet.profile.components.tab-general.labels.city')"
              @change="handleCityChange"
              @blur="handleCityBlur"
              @search="handleCitySearch"
              @loadMore="loadMoreCities" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data--additional__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.address')"
            :errors="validatorUserDataForm.errorsFormData.address.errors">
            <UiInput
              :isLoading="isLoadingAllComponentData"
              type="text"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.address')"
              :value="formData.address"
              :isDirty="validatorUserDataForm.errorsFormData.address.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.address.errors.length > 0"
              @input="validatorUserDataForm.doValidateField('address', $event)"
              @blur="validatorUserDataForm.doValidateField('address', $event.target.value)" />
          </UiFormControl>

          <UiFormControl
            class="profile__tab--general__profile-data--additional__form__field"
            :label="t('cabinet.profile.components.tab-general.labels.postal_code')"
            :errors="validatorUserDataForm.errorsFormData.postal_code.errors">
            <UiInput
              :isLoading="isLoadingAllComponentData"
              type="text"
              :placeholder="t('cabinet.profile.components.tab-general.placeholders.postal_code')"
              :value="formData.postal_code"
              :isDirty="validatorUserDataForm.errorsFormData.postal_code.isDirty"
              :isInvalid="validatorUserDataForm.errorsFormData.postal_code.errors.length > 0"
              @input="validatorUserDataForm.doValidateField('postal_code', $event)"
              @blur="validatorUserDataForm.doValidateField('postal_code', $event.target.value)" />
          </UiFormControl>

          <div class="profile__tab--general__profile-data--additional__form__field__save_btn">
            <UiButtonDefault
              state="info--outline"
              @click="validateUserDataForm(handleSubmit)">
              <UiIconSpinnerDefault v-if="isLoading" />
              <span v-if="!isLoading">{{ t("cabinet.profile.components.tab-general.button") }}</span>
            </UiButtonDefault>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useToast } from "vue-toastification";
  import useAppCore from "~/composables/useAppCore";
  import { formData } from "~/pages/profile/composables";
  import {
    resetValidationUserDataForm,
    validateUserDataForm,
    validatorUserDataForm,
  } from "~/pages/profile/composables/validation";
  import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
  import UiFormControl from "~/components/ui/UiFormControl.vue";
  import UiIconSpinnerDefault from "~/components/ui/UiIconSpinnerDefault.vue";
  import UiInput from "~/components/ui/UiInput.vue";
  import UiInputDate from "~/components/ui/UiInputDate.vue";
  import UiInputPhone from "~/components/ui/UiInputPhone.vue";
  import UiSelect from "~/components/ui/UiSelect.vue";
  import UserPhotoUploader from "~/components/block/uploaders/UserPhotoUploader.vue";

  interface SelectOption {
    id: string;
    value: string;
    text: string;
  }

  interface LocationApiItem {
    id: number | string;
    name: string;
  }

  interface FetchOptions {
    query?: string;
    page?: number;
    append?: boolean;
  }

  const { t } = useI18n();
  const toast = useToast();
  const appCore = useAppCore();

  const isLoading = ref(false);
  const isLoadingAllComponentData = ref(false);

  const selectedCountryId = ref<string | null>(null);
  const selectedStateId = ref<string | null>(null);
  const selectedCityId = ref<string | null>(null);

  const countrySearch = ref("");
  const stateSearch = ref("");
  const citySearch = ref("");

  const countryOptions = ref<SelectOption[]>([]);
  const stateOptions = ref<SelectOption[]>([]);
  const cityOptions = ref<SelectOption[]>([]);

  const countriesMeta = reactive({ page: 1, lastPage: 1, loading: false });
  const statesMeta = reactive({ page: 1, lastPage: 1, loading: false });
  const citiesMeta = reactive({ page: 1, lastPage: 1, loading: false });

  let countrySearchTimer: ReturnType<typeof setTimeout> | null = null;
  let stateSearchTimer: ReturnType<typeof setTimeout> | null = null;
  let citySearchTimer: ReturnType<typeof setTimeout> | null = null;

  const normalizeText = (value: string): string => value.trim().toLowerCase();

  const toSelectOptions = (items: LocationApiItem[]): SelectOption[] =>
    items.map(item => ({
      id: String(item.id),
      value: String(item.id),
      text: item.name,
    }));

  const findOptionByValue = (options: SelectOption[], value: string | null): SelectOption | null => {
    if (!value) {
      return null;
    }

    return options.find(option => option.value === value) || null;
  };

  const findOptionByLabel = (options: SelectOption[], label: string): SelectOption | null => {
    const normalizedLabel = normalizeText(label || "");
    if (normalizedLabel === "") {
      return null;
    }

    return options.find(option => normalizeText(option.text) === normalizedLabel) || null;
  };

  const fetchCountries = async ({ query = countrySearch.value, page = 1, append = false }: FetchOptions = {}) => {
    if (countriesMeta.loading) {
      return;
    }

    countriesMeta.loading = true;
    try {
      const { data } = await appCore.locations.countries({
        q: query || undefined,
        per_page: 25,
        page,
      });

      const items = Array.isArray(data?.data) ? data.data : [];
      const mapped = toSelectOptions(items);

      countryOptions.value = append ? [...countryOptions.value, ...mapped] : mapped;
      countriesMeta.page = Number(data?.current_page || page);
      countriesMeta.lastPage = Number(data?.last_page || page);
    } finally {
      countriesMeta.loading = false;
    }
  };

  const fetchStates = async (
    countryId: string,
    { query = stateSearch.value, page = 1, append = false }: FetchOptions = {}
  ) => {
    if (!countryId || statesMeta.loading) {
      return;
    }

    statesMeta.loading = true;
    try {
      const { data } = await appCore.locations.states({
        country_id: countryId,
        q: query || undefined,
        per_page: 25,
        page,
      });

      const items = Array.isArray(data?.data) ? data.data : [];
      const mapped = toSelectOptions(items);

      stateOptions.value = append ? [...stateOptions.value, ...mapped] : mapped;
      statesMeta.page = Number(data?.current_page || page);
      statesMeta.lastPage = Number(data?.last_page || page);
    } finally {
      statesMeta.loading = false;
    }
  };

  const fetchCities = async (
    stateId: string,
    { query = citySearch.value, page = 1, append = false }: FetchOptions = {}
  ) => {
    if (!stateId || citiesMeta.loading) {
      return;
    }

    citiesMeta.loading = true;
    try {
      const { data } = await appCore.locations.cities({
        state_id: stateId,
        q: query || undefined,
        per_page: 25,
        page,
      });

      const items = Array.isArray(data?.data) ? data.data : [];
      const mapped = toSelectOptions(items);

      cityOptions.value = append ? [...cityOptions.value, ...mapped] : mapped;
      citiesMeta.page = Number(data?.current_page || page);
      citiesMeta.lastPage = Number(data?.last_page || page);
    } finally {
      citiesMeta.loading = false;
    }
  };

  const applyCitySelection = (nextValue: string | null, validate = true): void => {
    selectedCityId.value = nextValue;
    formData.city_id = nextValue;

    const selected = findOptionByValue(cityOptions.value, nextValue);
    formData.city = selected?.text || "";

    if (validate) {
      validatorUserDataForm.doValidateField("city", formData.city);
    }
  };

  const applyStateSelection = async (nextValue: string | null, validate = true): Promise<void> => {
    selectedStateId.value = nextValue;
    formData.state_id = nextValue;

    const selected = findOptionByValue(stateOptions.value, nextValue);
    formData.state = selected?.text || "";

    if (validate) {
      validatorUserDataForm.doValidateField("state", formData.state);
    }

    selectedCityId.value = null;
    formData.city_id = null;
    formData.city = "";
    citySearch.value = "";
    cityOptions.value = [];
    citiesMeta.page = 1;
    citiesMeta.lastPage = 1;

    if (nextValue) {
      await fetchCities(nextValue, { query: "", page: 1, append: false });
    }
  };

  const applyCountrySelection = async (nextValue: string | null, validate = true): Promise<void> => {
    selectedCountryId.value = nextValue;
    formData.country_id = nextValue;

    const selected = findOptionByValue(countryOptions.value, nextValue);
    formData.country = selected?.text || "";

    if (validate) {
      validatorUserDataForm.doValidateField("country", formData.country);
    }

    selectedStateId.value = null;
    formData.state_id = null;
    formData.state = "";
    stateSearch.value = "";
    stateOptions.value = [];
    statesMeta.page = 1;
    statesMeta.lastPage = 1;

    selectedCityId.value = null;
    formData.city_id = null;
    formData.city = "";
    citySearch.value = "";
    cityOptions.value = [];
    citiesMeta.page = 1;
    citiesMeta.lastPage = 1;

    if (nextValue) {
      await fetchStates(nextValue, { query: "", page: 1, append: false });
    }
  };

  const handleInputBirthday = (value: string) => {
    validatorUserDataForm.doValidateField("birthdate", value);
  };

  const handleCountryChange = async (value: string | null) => {
    await applyCountrySelection(value, true);
  };

  const handleStateChange = async (value: string | null) => {
    await applyStateSelection(value, true);
  };

  const handleCityChange = (value: string | null) => {
    applyCitySelection(value, true);
  };

  const handleCountryBlur = () => validatorUserDataForm.doValidateField("country", formData.country);
  const handleStateBlur = () => validatorUserDataForm.doValidateField("state", formData.state);
  const handleCityBlur = () => validatorUserDataForm.doValidateField("city", formData.city);

  const handleCountrySearch = (value: string) => {
    countrySearch.value = value;
    if (countrySearchTimer) {
      clearTimeout(countrySearchTimer);
    }
    countrySearchTimer = setTimeout(() => {
      void fetchCountries({ query: countrySearch.value, page: 1, append: false });
    }, 250);
  };

  const handleStateSearch = (value: string) => {
    stateSearch.value = value;
    if (stateSearchTimer) {
      clearTimeout(stateSearchTimer);
    }
    stateSearchTimer = setTimeout(() => {
      if (!selectedCountryId.value) {
        return;
      }
      void fetchStates(selectedCountryId.value, { query: stateSearch.value, page: 1, append: false });
    }, 250);
  };

  const handleCitySearch = (value: string) => {
    citySearch.value = value;
    if (citySearchTimer) {
      clearTimeout(citySearchTimer);
    }
    citySearchTimer = setTimeout(() => {
      if (!selectedStateId.value) {
        return;
      }
      void fetchCities(selectedStateId.value, { query: citySearch.value, page: 1, append: false });
    }, 250);
  };

  const loadMoreCountries = () => {
    if (countriesMeta.loading || countriesMeta.page >= countriesMeta.lastPage) {
      return;
    }
    void fetchCountries({ query: countrySearch.value, page: countriesMeta.page + 1, append: true });
  };

  const loadMoreStates = () => {
    if (!selectedCountryId.value || statesMeta.loading || statesMeta.page >= statesMeta.lastPage) {
      return;
    }
    void fetchStates(selectedCountryId.value, { query: stateSearch.value, page: statesMeta.page + 1, append: true });
  };

  const loadMoreCities = () => {
    if (!selectedStateId.value || citiesMeta.loading || citiesMeta.page >= citiesMeta.lastPage) {
      return;
    }
    void fetchCities(selectedStateId.value, { query: citySearch.value, page: citiesMeta.page + 1, append: true });
  };

  const initializeLocationSelections = async (
    countryName: string,
    stateName: string,
    cityName: string
  ): Promise<void> => {
    await fetchCountries({ query: countryName || "", page: 1, append: false });
    if (countryOptions.value.length === 0) {
      await fetchCountries({ query: "", page: 1, append: false });
    }

    const matchedCountry = findOptionByLabel(countryOptions.value, countryName || "");
    if (!matchedCountry) {
      formData.country = countryName || "";
      formData.state = stateName || "";
      formData.city = cityName || "";
      return;
    }

    await applyCountrySelection(matchedCountry.value, false);

    const resolvedCountryId = selectedCountryId.value;
    if (!resolvedCountryId) {
      formData.state = stateName || "";
      formData.city = cityName || "";
      return;
    }

    await fetchStates(resolvedCountryId, { query: stateName || "", page: 1, append: false });
    if (stateOptions.value.length === 0) {
      await fetchStates(resolvedCountryId, { query: "", page: 1, append: false });
    }

    const matchedState = findOptionByLabel(stateOptions.value, stateName || "");
    if (!matchedState) {
      formData.state = stateName || "";
      formData.city = cityName || "";
      return;
    }

    await applyStateSelection(matchedState.value, false);

    const resolvedStateId = selectedStateId.value;
    if (!resolvedStateId) {
      formData.city = cityName || "";
      return;
    }

    await fetchCities(resolvedStateId, { query: cityName || "", page: 1, append: false });
    if (cityOptions.value.length === 0) {
      await fetchCities(resolvedStateId, { query: "", page: 1, append: false });
    }

    const matchedCity = findOptionByLabel(cityOptions.value, cityName || "");
    if (!matchedCity) {
      formData.city = cityName || "";
      return;
    }

    applyCitySelection(matchedCity.value, false);
  };

  const handleSubmit = async () => {
    try {
      isLoading.value = true;

      await appCore.users.patch({
        ...formData,
        country_id: formData.country_id,
        state_id: formData.state_id,
        city_id: formData.city_id,
      });

      resetValidationUserDataForm();
      toast.success(t("cabinet.profile.components.tab-general.success"));
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    }
  };

  onMounted(async () => {
    isLoadingAllComponentData.value = true;
    try {
      const { data } = await appCore.auth.getAuthUser();

      formData.email = data?.email || "";
      formData.first_name = data?.first_name || "";
      formData.mid_name = data?.mid_name || "";
      formData.last_name = data?.last_name || "";
      formData.birthdate = data?.birthdate || "";
      formData.phone = data?.phone || "";
      formData.country = data?.country || "";
      formData.state = data?.state || "";
      formData.city = data?.city || "";
      formData.address = data?.address || "";
      formData.postal_code = data?.postal_code || "";

      formData.country_id = null;
      formData.state_id = null;
      formData.city_id = null;

      await initializeLocationSelections(formData.country, formData.state, formData.city);
    } finally {
      isLoadingAllComponentData.value = false;
    }
  });
</script>

<style lang="scss" scoped>
  .title {
    margin-bottom: 20px;
  }

  .profile__tab--general {
    min-height: 400px;
    width: 100%;
    border-radius: 10px;

    &_wrapper {
      display: flex;
      gap: 20px;
    }

    &__profile-data {
      width: 50%;
      height: 100%;

      &__title {
        padding: 0 20px;
        height: 40px;
        display: flex;
        align-items: center;
      }

      &__form {
        padding: 20px;

        &__field {
          margin-bottom: 10px;
        }
      }
    }

    &__profile-data--additional {
      width: 50%;
      height: 100%;

      &__title {
        padding: 0 20px;
        height: 40px;
        display: flex;
        align-items: center;
      }

      &__form {
        padding: 20px;

        &__field {
          margin-bottom: 10px;

          &__save_btn {
            margin-top: 35px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  @media (max-width: 1043px) {
    .profile__tab--general {
      &_wrapper {
        flex-direction: column;
        gap: 10px;
      }

      &__profile-data {
        width: 100%;

        &__form {
          padding: 15px;
        }

        &__photo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
      }

      &__profile-data--additional {
        width: 100%;

        &__form {
          padding: 15px;
        }
      }
    }
  }
</style>
