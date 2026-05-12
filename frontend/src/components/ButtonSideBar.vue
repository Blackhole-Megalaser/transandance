<template>
  <button 
    :class="['btn-base',`btn-${variant}`]"
    @click="$emit('changeStatus')"
    type="button"
  >
    <slot />
  </button>

</template>

<script setup>

defineProps ({
  variant: {
    type: String,
    default: "primary"
  }
});

const emit = defineEmits(['changeStatus']);
</script>

<style scoped>
@import '../style.css';

.btn-base {
  @apply px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-xs;
}
.btn-primary {
  @apply shadow-button-sidebar-normal ;
  background-color: var(--color-button-sidebar-normal);
  color: var(--color-text-button-2);
}
.btn-primary:hover {
  background-color: var(--color-button-sidebar-hover);
}
.btn-primary:active {
  @apply duration-100 px-5.5 py-1.5;
  background-color: var(--color-pink-pastel-100);
}

</style>