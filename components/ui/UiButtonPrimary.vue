<template>
  <UiButtonDefault class="btn--primary" :type="props.type" @click="handleClick">
    <slot v-if="!props.isLoading" />
    <div v-if="props.isLoading">
      <UiIconSpinnerDefault/>
    </div>
  </UiButtonDefault>
</template>

<script lang="ts" setup>
// @ts-ignore
import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
// @ts-ignore
import UiIconSpinnerDefault from "~/components/ui/UiIconSpinnerDefault.vue";

const props = defineProps({
  type: {
    // @ts-ignore
    type: String as PropType<"button" | "submit" | "reset" | undefined>,
    default: "button",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["click"]);
const handleClick = (): void => emit("click");
</script>

<style lang="scss" scoped>
.btn--primary {
  background-color: #0d6efd;
  color: white;
}
</style>
