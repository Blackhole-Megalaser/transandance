<template>
  <button 
    :class="['btn-base',`btn-${variant}`]"
    @click="$emit('changeStatus')"
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
@import "../style.css";

.btn-base {
  @apply px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-xs;
}
.btn-primary {
  @apply shadow-button-1-normal;
  background-color: var(--color-button-1-normal);
  color: var(--color-text-button-1);
}
.btn-primary:hover {
  background-color: var(--color-button-1-hover);
}
.btn-primary:active {
  @apply duration-100 px-5.5 py-1.5;
  background-color: var(--color-button-1-active);
}
.btn-primary:disabled {
  background-color: var(--color-button-1-disable);
}
.btn-secondary {
  @apply shadow-button-2-normal;
  background-color: var(--color-button-2-normal);
  color: var(--color-text-button-2);
}
.btn-secondary:hover {
  background-color: var(--color-button-2-hover);
}
.btn-secondary:active {
  @apply duration-100 px-5.5 py-1.5;
  background-color: var(--color-button-2-active);
}
.btn-secondary:disabled {
  background-color: var(--color-button-2-disable);
}

</style>