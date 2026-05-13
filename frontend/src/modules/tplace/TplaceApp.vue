<template>
  <NavBar
    @changeStatus="showSideBar = !showSideBar"
    variant="nav"
  />

  <sideBar 
    :class="showSideBar === false ? '-translate-x-60 rotate-360' : 'translate-x-0 -rotate-360'"
    class="transition duration-200 z-50"
  />
  <TPlace :class="showSideBar ?'brightness-50 z-0' : 'brightness-100 z-10'"/>
</template>

<script setup>
import { ref } from 'vue';

import TPlace from './game/TPlace.vue';
import NavBar from '../../components/NavBar.vue';
import SideBar from '../../components/SideBar.vue';

const showSideBar = ref(false);


</script>

<style>
@import '../../style.css';

body {
  @apply bg-bg-main pt-20
}
</style>