<template>
  <navBar
    @changeStatus="showSideBar = !showSideBar"
  />

  <sideBar 
    :class="showSideBar === false ? '-translate-x-60 rotate-360' : 'translate-x-0 -rotate-360'"
    class="transition duration-200"
  />
</template>

<script setup>
import { useThemeStore } from '../../storage/theme.js';
import { ref } from 'vue';

import Button from '../../components/Button.vue';
import NavBar from '../../components/NavBarHome.vue';
import SideBar from '../../components/SideBar.vue';

const showSideBar = ref(false);

</script>

<style>
@import '../../style.css';

body {
  @apply bg-bg-main pt-20
}
</style>