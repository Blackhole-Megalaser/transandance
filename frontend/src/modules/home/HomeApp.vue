<template>
  <navBar
    @changeStatus="showSideBar = !showSideBar"
    class="z-60"
    @showProfile="showProfile = !showProfile; console.log(showProfile)"
  />
  <SideProfile :open="showProfile"/>
  <main class="fscreen">
    <sideBar 
      :class="!showSideBar ? '-translate-x-60 rotate-360' : 'translate-x-0 -rotate-360'"
      class="transition duration-200 z-50"
    />
    <div
        :class="showSideBar ? 'undefined':'hidden'"
        class="transition duration-200 fscreen fixed z-49 bg-black/40"
        @click="closeSideBar"
    ></div>
  </main>
</template>


<script setup>
import { useThemeStore } from '../../storage/theme.js';
import { useBreakpoints } from '@vueuse/core';
import { ref } from 'vue';

import Button from '../../components/Button.vue';
import NavBar from '../../components/NavBar.vue';
import SideBar from '../../components/SideBar.vue';
import SideProfile from '../../components/SideProfile.vue';

const breakpoints = useBreakpoints({sm: 640 });{}
const ismobile = breakpoints.smaller("sm");
const showSideBar = ref(false);
const showProfile = ref(false);

function closeSideBar() {
  if (showSideBar.value) showSideBar.value = false;
}
// function toggleSideBar() {
//   if (!ismobile.value) return;
//   if (!showProfile.value) showSideBar.value = true;
// }
// function toggleSideProfile() {
//   console.log(ismobile.value);
//   if (showSideBar.value && ismobile.value) {
//     showSideBar.value = false;
//     showProfile.value = true;
//   }
//   else
//     showProfile.value = true;
// }

</script>

<style scoped>
@import '../../style.css';

.fscreen {
  @apply h-[calc(100dvh-5rem)] w-dvw
}

</style>