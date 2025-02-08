<template>
  <span class="loader">
    <span class="dot" :style="{ animationDelay: '0s' }"></span>
    <span class="dot" :style="{ animationDelay: '0.2s' }"></span>
    <span class="dot" :style="{ animationDelay: '0.4s' }"></span>
  </span>
</template>

<script setup>
</script>

<style scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 5px;
}

.dot {
  width: 3px;
  height: 3px;
  background-color: #333;
  border-radius: 50%;
  animation: dotBounce 1.2s infinite ease-in-out;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.3);
    opacity: 0.6;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>