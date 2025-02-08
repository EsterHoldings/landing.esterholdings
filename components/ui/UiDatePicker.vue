<template>
  <div class="date-picker" @click="openDatePicker">
    <div class="date-picker__body">
      {{ selectedDate || "No selected date" }}
    </div>
    <input ref="dateInput" type="date" @input="updateDate">
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const dateInput = ref<HTMLInputElement | null>(null);
const selectedDate = ref<string | null>(null);

const openDatePicker = () => {
  dateInput.value?.showPicker();
};

const updateDate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedDate.value = target.value;
};
</script>

<style lang="scss" scoped>
input {
  position: absolute;
  visibility: hidden;
}

.date-picker {
  position: relative;
  padding: 0 20px;
  border: 1px solid #0f0f0f;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
</style>
