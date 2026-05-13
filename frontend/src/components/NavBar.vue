<template>
  <nav class="flex justify-center relative">
    <div class="flex items-center w-full h-20 bg-navbar border-b border-navbar-border px-3 sm:px-6 shadow-md">
      <div class="flex flex-none justify-start w-1/5">
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
            :class="`s-${variant}`"
          >
        </a>
      </div>

      <div 
        class="flex flex-none justify-end w-1/5 gap-5 lg:gap-10"
      >
        <div class="hidden lg:flex">
          <ThemeButton></ThemeButton>
        </div>
        <div class="hidden sm:max-lg:flex">
          <ThemeToggle></ThemeToggle>
        </div>
        <div class="flex items-center justify-end">
          <div v-if="isLogged">
            <Button class="flex items-center">
              Profile
            </Button>
          </div>
          <div v-else class="h-10 w-24 flex-center">
            <a href="/">
              <ButtonLogIn>
                Log in
              </ButtonLogIn>
            </a>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { useThemeStore } from '../storage/theme.js';
import { computed, ref } from 'vue';
import ButtonLogIn from './ButtonLogIn.vue';
import Button from './Button.vue';
import ThemeButton from './ThemeButton.vue';
import ThemeToggle from './ThemeToggle.vue';
import cute_paw from '../assets/cute_paw.svg?component';
import mean_paw from '../assets/mean_paw.svg?component';
import ft_cat from '../assets/ft_cat.png';
import ft_mean from '../assets/ft_cat-dark.png'

const theme = useThemeStore();
const themeIndex = computed (() => theme.getThemeIndex());
const emit = defineEmits(['changeStatus']);
const isLogged = ref(false);

defineProps ({
  variant: {
    type: String,
    default: "home"
  }
});

</script>

<style scoped>
@import "../style.css";

nav {
  @apply fixed w-full top-0 h-20 lg:h-40
}
button {
  @apply cursor-pointer
}
.flex-center {
  @apply flex justify-center items-center
}
.s-home {
  @apply max-h-20 lg:max-h-40
}
.s-nav {
  @apply max-h-20
}
</style>
