<script setup lang="ts">
// Button.vue
</script>

<template>
  <button
    class="px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>
