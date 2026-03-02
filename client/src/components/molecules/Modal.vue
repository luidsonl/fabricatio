<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = 'unset'
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <!-- Backdrop click to close -->
      <div class="absolute inset-0" @click="emit('close')"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 class="text-xl font-semibold text-slate-800">{{ title }}</h2>
          <button
            @click="emit('close')"
            class="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
