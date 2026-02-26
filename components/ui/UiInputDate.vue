<template>
  <div class="input date-input-wrapper">
    <input
      type="date"
      class="date-input"
      :class="{
        'is-invalid': isDirty && isInvalid,
        'is-valid': isDirty && !isInvalid,
        disabled: disabled,
      }"
      :value="normalizedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      autocomplete="bday"
      @input="onInput"
      @blur="onBlur" />

    <div
      v-if="isLoading"
      class="is-loading">
      <UiIconSpinnerDefault class="absolute right-[20px] top-[50%] translate-y-[-50%] opacity-15" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { format, isValid, parseISO } from "date-fns";
  import UiIconSpinnerDefault from "~/components/ui/UiIconSpinnerDefault.vue";

  const props = defineProps({
    value: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    isDirty: { type: Boolean, default: false },
    isInvalid: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits<{
    (e: "input", v: string): void;
    (e: "blur", v: string): void;
  }>();

  const normalizedValue = computed(() => {
    const raw = (props.value || "").trim();
    if (raw === "") {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    const date = parseISO(raw);
    return isValid(date) ? format(date, "yyyy-MM-dd") : "";
  });

  const onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    emit("input", value);
  };

  const onBlur = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    emit("blur", value);
  };
</script>

<style scoped>
  .date-input-wrapper {
    position: relative;
  }

  .date-input {
    width: 100%;
    height: var(--ui-input--height);
    background-color: var(--color-stroke-ui-dark);
    border: 1px solid var(--color-stroke-ui-light);
    color: var(--color-ui-text);
    border-radius: 10px;
    padding: 0 15px;
    font-size: 14px;
    outline: none;
  }

  .date-input.is-invalid {
    border-color: var(--color-danger);
  }

  .date-input.is-valid {
    border-color: var(--color-success);
  }

  .date-input.disabled {
    background-color: var(--ui-background-panel);
    border-color: var(--color-stroke-ui-light);
    border-style: dashed;
    color: var(--ui-text-secondary);
    cursor: not-allowed;
  }

  .is-loading {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    overflow: hidden;
    background: linear-gradient(
      to right,
      rgba(243, 243, 243, 0.1) 5%,
      rgba(238, 238, 238, 0.15) 20%,
      rgba(243, 243, 243, 0.1) 35%
    );
    background-size: 1000px 100%;
    animation: placeholderShimmer 1.5s linear infinite;
  }

  @keyframes placeholderShimmer {
    0% {
      background-position: -500px 0;
    }
    100% {
      background-position: 500px 0;
    }
  }
</style>
