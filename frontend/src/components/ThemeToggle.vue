<template>
  <button 
    @click="theme.cycle()" 
    class="themeBtn size-10 relative overflow-hidden flex-center"
  >
    <div class="m-auto size-8 absolute inset-y-0  flex-center rounded-full 
      themeCursor active:size-6">
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
   @apply rounded-full bg-theme-button inset-shadow-sm 
    inset-shadow-theme-button-shadow cursor-pointer
}
.themeCursor {
  @apply rounded-full border bg-theme-cursor border-theme-cursor-border 
    shadow-sm shadow-theme-cursor-shadow 
}
.flex-center {
  @apply flex justify-center items-center
}

</style>