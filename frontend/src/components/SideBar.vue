<template>
  <div class="flex min-h-dvh w-60 bg-sidebar fixed">
    <aside class="p-6 w-full">
      <header class="w-full">
        <div class="flex-centered flex-col">
          <img 
            :src="!themeIndex ? cute_cat : mean_cat"" 
            alt="mini logo"
            class="size-20"
          >
        </div>
        <hr class="h-px my-6 border-sidebar-border">
      </header>
      <ul 
        class="flex flex-col text-red-500"
      >
        <li>
          <ButtonSideBar
            @changeStatus="showGames = !showGames"
          >Games</ButtonSideBar>
          <div 
            :class="showGames === false ? 'hidden' : 'flex flex-col'"
            class="pl-6"
          >
            <ul 
              class="bg-button-sidebar-2-normal rounded-3xl"
            >
              <li>
                <a href="">
                  <ButtonSideBar
                    variant="secondary"
                  >
                    skribbl.cat
                  </ButtonSideBar>
                </a>
              </li>
              <li>
                <a href="tplace.html">
                    <ButtonSideBar
                      variant="secondary"
                    >
                      tplace
                    </ButtonSideBar>
                  </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a href="http://localhost:8000/chat">
            <ButtonSideBar>
              Chat rooms
            </ButtonSideBar>
          </a>
        </li>
        <li>
          <ButtonSideBar>
            Friendlist
          </ButtonSideBar>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import { useThemeStore } from '../storage/theme.js';
import ThemeButton from './ThemeButton.vue';
import { computed, ref } from 'vue';
import ButtonSideBar from './ButtonSideBar.vue';
import mean_cat from '../assets/logo-dark-tr.png'
import cute_cat from '../assets/logo1-tr.png'

const theme = useThemeStore();
const themeIndex = computed (() => theme.getThemeIndex())
const showGames = ref(false);
const showFriendList = ref(false);

</script>

<style>
.flex-centered {
  @apply flex justify-center items-center
}
</style>