<template>
  <div class="input">
    <div class="input-icon--left">
      <slot name="icon-left" />
    </div>
    <input
        :class="{
        'border': !borderNone,
        'padding': !paddingNone,
        'is-invalid': isDirty && isInvalid,
        'is-valid': isDirty && !isInvalid,
      }"
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.value"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  // Deperecated
  errorObject: {
    type: Object,
    default: {},
  },
  isDirty: {
    type: Boolean,
    default: false,
  },
  isInvalid: {
    type: Boolean,
    default: false,
  },
  borderNone: {
    type: Boolean,
    default: false,
  },
  paddingNone: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["focus", "input", "blur"]);

const onFocus = (event: any): void => emit("focus", event);
const onInput = (event: any): void => emit("input", event);
const onBlur = (event: any): void => emit("blur", event);
</script>

<style lang="scss" scoped>
@use "~/assets/styles/variables";

input {
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  background-color: transparent;
}

.input {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  margin: 0;
  background-color: transparent;
  outline: none;
  // TODO :: Add disable color
  color: var(--color-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  &-icon--left {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 40px;
    width: 40px;
  }

  &.padding {
    padding: 15px;
  }

  &.border {
    border: 1px solid var(--color-text);
    border-radius: 5px;
  }

  &::placeholder {
    // TODO :: Add disable color
    color: var(--color-text-muted);
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0em;
  }
}

.is-invalid {
  border-color: red;
}

.is-valid {
  border-color: green;
}
</style>
