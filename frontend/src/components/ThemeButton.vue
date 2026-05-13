<template>
  <button @click="theme.cycle()" class="themeBtn w-20 h-10 relative overflow-hidden px-1 flex items-center">
    <div 
      class="size-8 transition-transform duration-300 ease-in-out flex-center themeCursor"
      :style="{ transform: theme.getThemeIndex() == 0 ? 'translateX(0)' : 'translateX(40px)' }"
    >
    </div>
    <div class="absolute inset-y-0 flex items-center pointer-events-none"
        :class="theme.getThemeIndex() == 0 ? 'right-3' : 'left-2'">
      {{ theme.current === 'dark' ? "😈" : "🌸" }}
    </div>
  </button>
</template>

<script setup>
import { useThemeStore } from '../storage/theme.js';

const theme = useThemeStore();
</script>

<style scoped>
@import "../style.css";

.themeBtn {
   @apply rounded-full bg-theme-button inset-shadow-sm inset-shadow-theme-button-shadow cursor-pointer
}
.themeCursor {
  @apply rounded-full border bg-theme-cursor border-theme-cursor-border shadow-theme-cursor-shadow
}
.flex-center {
  @apply flex justify-center items-center
}

</style>