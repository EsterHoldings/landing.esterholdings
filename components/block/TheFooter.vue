<template>
  <footer class="footer">
    <UiTextH1>EsterHoldings</UiTextH1>
  </footer>
</template>

<script lang="ts" setup>
import UiTextH1 from "~/components/ui/UiTextH1.vue";
</script>

<style lang="scss" scoped>
.footer {
  background-color: #3c4248;
  color: white;

  width: 100%;
  height: 150px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
