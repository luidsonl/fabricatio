<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../../store/api'
import PackagingTransactionCard from '../molecules/PackagingTransactionCard.vue'

const store = useApiStore()
const router = useRouter()

const isLoading = ref(true)
const error = ref<Error | null>(null)

const transactions = computed(() => [...store.packagingTransactions].sort((a, b) => (b.id || 0) - (a.id || 0)))

onMounted(async () => {
  try {
    await store.getPackagingTransactions()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Error loading packaging transactions')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error loading transactions</div>
    <div v-else class="grid gap-3">
      <PackagingTransactionCard
        v-for="tx in transactions"
        :key="tx.id"
        :transaction="tx"
        @click="router.push(`/transactions/packaging/${tx.id}`)"
      />
    </div>
  </div>
</template>
