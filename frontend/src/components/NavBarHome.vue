<template>
  <nav class="flex justify-center">
    <div class="flex items-center w-full h-20 bg-navbar px-6">

      <div class="flex flex-none justify-start w-16 sm:w-38 lg:w-40">
        <button class="flex-center" type="button" @click="$emit('changeStatus')">
          <cute_paw 
            v-if="themeIndex === 0"
            class="fill-navbar-menu size-12" 
          />
          <mean_paw 
            v-else
            class="fill-navbar-menu size-12" 
          />
        </button>
      </div>

      <div 
        class="h-20 flex flex-1 justify-center items-center sm:items-start"
      >
        <a href="/" class="cursor-pointer" aria-label="back to home">
          <img 
            :src="themeIndex === 0 ? ft_cat : ft_mean"
            alt="LOGO"
            class="max-h-20 md:max-h-40"
          >
        </a>
      </div>

      <div 
        class="flex flex-none justify-end w-16 sm:w-38 lg:w-40 md:gap-10"
      >
        <ThemeButton class="hidden lg:flex"></ThemeButton>
        <button class="flex items-center">
          profile
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { useThemeStore } from '../storage/theme.js';
import { computed } from 'vue';
import ThemeButton from './ThemeButton.vue';
import cute_paw from '../assets/cute_paw.svg?component';
import mean_paw from '../assets/mean_paw.svg?component';
import ft_cat from '../assets/ft_cat.png';
import ft_mean from '../assets/ft_cat-dark.png'

const theme = useThemeStore();
const themeIndex = computed (() => theme.getThemeIndex());
const emit = defineEmits(['changeStatus']);

</script>

<style scoped>
@import "../style.css";

nav {
  @apply absolute w-full top-0
}
button {
  @apply cursor-pointer
}
.flex-center {
  @apply flex justify-center items-center
}

</style>
