<template>
  <dialog 
    ref="dialog"
  >
    <div class="w-full flex justify-center items-center pt-6">
      <img :src='ProfilePicture' alt="profile picture" class="size-20 rounded-full">
    </div>
    <hr>
  </dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import defaultcat from '../assets/default_cat.png'

const props = defineProps({open: Boolean});
const dialog = ref(null);
const profilePic = ref(null);

watch(() => props.open, (val) => {
  val ? dialog.value.show() : dialog.value.close()
})

// Futur getter par API

const ProfilePicture = computed (() => {
  return profilePic.value ?? defaultcat;
})

</script>

<style scoped>
@import '../style.css';

dialog {
  @apply sm:m-2 w-full h-full z-70 sm:w-xs sm:h-56 sm:rounded-4xl 
    p-6 shadow-md fixed left-auto;
  background-color: var(--color-profile);
}
hr {
  @apply h-px border-navbar-border my-6
}
</style>

