<template>
  <div class="container-fluid">
    <div class="page-wrapper">
      <div class="page-content">
        <div class="page">
          <slot />
        </div>
        <TheFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeaderSideBar from "~/components/block/TheHeaderSideBar.vue";
import TheFooter from "@/components/block/TheFooter.vue";
</script>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 150px);
  overflow: scroll;
  background-color: #3c42483d;

  &-wrapper {
    display: flex;
  }

  &-content {
    width: 100%;
  }
}

</style>

