<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title?: string
}>()
</script>

<template>
  <header class="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="font-bold text-lg text-slate-900">{{ title ?? 'Inventory Manager' }}</div>
      <nav class="flex gap-6 text-sm font-medium">
        <RouterLink to="/" class="text-slate-600 hover:text-slate-900 transition-colors">Home</RouterLink>
        <RouterLink to="/raw-materials" class="text-slate-600 hover:text-slate-900 transition-colors">Raw Materials</RouterLink>
        <RouterLink to="/products" class="text-slate-600 hover:text-slate-900 transition-colors">Products</RouterLink>
        <RouterLink to="/packaging" class="text-slate-600 hover:text-slate-900 transition-colors">Packaging</RouterLink>
        <RouterLink to="/transactions/products" class="text-slate-600 hover:text-slate-900 transition-colors">Product Transactions</RouterLink>
        <RouterLink to="/transactions/packaging" class="text-slate-600 hover:text-slate-900 transition-colors">Packaging Transactions</RouterLink>
        <RouterLink to="/production" class="text-slate-600 hover:text-slate-900 transition-colors">Production</RouterLink>
      </nav>
    </div>
  </header>
</template>
