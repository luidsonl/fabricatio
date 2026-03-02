<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../../store/api'
import PackagingCard from '../molecules/PackagingCard.vue'

const store = useApiStore()
const router = useRouter()

const isLoading = ref(true)
const error = ref<Error | null>(null)

const packagings = computed(() => [...store.packagings].sort((a, b) => (b.id || 0) - (a.id || 0)))

onMounted(async () => {
  try {
    await store.getPackagings()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Error loading packaging')
  } finally {
    isLoading.value = false
  }
})

const handleEdit = (id: number) => {
  router.push(`/packaging/${id}/edit`)
}

const handleDelete = async (id: number) => {
  await store.deletePackaging(id)
}
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error loading packaging</div>
    <div v-else class="grid gap-3">
      <PackagingCard
        v-for="packaging in packagings"
        :key="packaging.id"
        :packaging="packaging"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
