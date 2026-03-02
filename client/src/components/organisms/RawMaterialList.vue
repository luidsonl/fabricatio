<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Card from '../atoms/Card.vue'
import { useApiStore } from '../../store/api'

const props = defineProps<{
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}>()

const store = useApiStore()

const isLoading = ref(true)
const error = ref<Error | null>(null)

const rawMaterials = computed(() => [...store.rawMaterials].sort((a, b) => (b.id || 0) - (a.id || 0)))

onMounted(async () => {
  try {
    await store.getRawMaterials()
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Error loading raw materials')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error loading raw materials</div>
    <div v-else class="space-y-3">
      <Card v-for="r in rawMaterials" :key="r.id">
        <div class="flex justify-between items-start">
          <div>
            <div><strong>{{ r.code }}</strong> - {{ r.name }}</div>
            <div v-if="r.description" class="text-sm italic text-slate-500">{{ r.description }}</div>
            <div class="text-sm text-slate-600">Unit: {{ r.unit }}</div>
            <div class="text-sm text-slate-600">Fractionable: {{ r.fractionable ? 'Yes' : 'No' }}</div>
          </div>
          <div class="flex gap-2">
            <button
              v-if="onEdit"
              @click="r.id && onEdit(r.id)"
              class="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            >
              Edit
            </button>
            <button
              v-if="onDelete"
              @click="r.id && onDelete(r.id)"
              class="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
