<template>
  <div class="flex min-h-dvh w-60 bg-sidebar absolute">
    <aside class="p-6">
      <ul 
        class="flex flex-col text-red-500""
      >
        <li>
          <ButtonSideBar
            @changeStatus="showGames = !showGames"
            variant="primary"
          >Games</ButtonSideBar>
          <ul :class="showGames === false ? 'hidden' : 'flex flex-col pl-5'">
            <li>
              <button>skribbl.cat</button>
            </li>
            <li>
              <Button>
		            <a href="tplace.html">tplace</a>
              </Button>
            </li>
          </ul>
        </li>
        <li></li>
        <li></li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ButtonSideBar from './ButtonSideBar.vue';

const showGames = ref(false);
const showFriendList = ref(false);

</script>

<style>
</style>