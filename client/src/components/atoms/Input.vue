<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue?: string | number;
}>();

defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <label class="flex flex-col gap-1.5">
    <span v-if="label" class="text-sm font-medium text-slate-700">{{ label }}</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="px-3 py-2 rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
      v-bind="$attrs"
    />
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
