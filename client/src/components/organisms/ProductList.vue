<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../../store/api'
import ProductCard from '../molecules/ProductCard.vue'

const store = useApiStore()
const router = useRouter()

const isLoading = ref(true)
const error = ref<Error | null>(null)

const products = computed(() => [...store.products].sort((a, b) => (b.id || 0) - (a.id || 0)))

onMounted(async () => {
  try {
    await store.getProducts()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Error loading products')
  } finally {
    isLoading.value = false
  }
})

const handleEdit = (id: number) => {
  router.push(`/products/${id}/edit`)
}

const handleDelete = async (id: number) => {
  await store.deleteProduct(id)
}
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error loading products</div>
    <div v-else class="grid gap-3">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
