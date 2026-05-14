<template>
  <NavBar
    @changeStatus="showSideBar = !showSideBar"
    variant="nav"
    class="z-60"
  />

  <sideBar 
    :class="showSideBar === false ? '-translate-x-60 rotate-360' : 'translate-x-0 -rotate-360'"
    class="transition duration-200 z-50"
  />
  <main>
    <div
        :class="showSideBar ? 'undefined':'hidden'"
        class="transition duration-200 w-dvw h-dvh fixed z-49 bg-black/40"
        @click="closeSideBar"
    ></div>
    <TPlace class="z-40"/>
  </main>
</template>

<script setup>
import { ref } from 'vue';

import TPlace from './game/TPlace.vue';
import NavBar from '../../components/NavBar.vue';
import SideBar from '../../components/SideBar.vue';

const showSideBar = ref(false);

function closeSideBar() {
  if (showSideBar.value) showSideBar.value = false;
}

</script>

<style>
@import '../../style.css';

body {
  @apply bg-bg-main pt-20
}
</style>