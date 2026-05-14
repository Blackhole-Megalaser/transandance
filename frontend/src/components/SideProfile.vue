<template>
  <dialog class="z-70 w-sm h-md fixed" ref="dialog">
    hello
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({open: Boolean});
const dialog = ref(null);

watch(() => props.open, (val) => {
  val ? dialog.value.showModal() : dialog.value.close()
})

</script>

<style scoped>

</style>

