<template>
  <div class="container-fluid">
    <div class="page-wrapper">
      <TheHeaderSideBar/>
      <div class="page-content">
        <div class="page">
          <slot/>
        </div>
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
  height: 100vh;

  &-wrapper {
    display: flex;
  }

  &-content {
    width: 100%;
  }
}

</style>

