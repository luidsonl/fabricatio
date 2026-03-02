<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Button from '../atoms/Button.vue'
import Card from '../atoms/Card.vue'

const router = useRouter()
const route = useRoute()
const store = useApiStore()

const transactionId = computed(() => Number(route.params.id))
const isLoading = ref(true)

onMounted(async () => {
  try {
    await store.getPackagingTransactions()
  } finally {
    isLoading.value = false
  }
})

const transaction = computed(() => store.packagingTransactions.find((t: any) => t.id === transactionId.value))
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div v-if="isLoading" class="text-slate-500">Loading...</div>
      <div v-else-if="!transaction" class="text-red-500">Error loading transaction or not found.</div>
      <div v-else class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Transaction #{{ transaction.id }}</h1>
          <Button @click="router.push('/transactions/packaging')" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Back to List</Button>
        </div>

        <Card>
          <div class="space-y-4">
            <div>
              <span class="font-bold block text-sm text-slate-600">Packaging</span>
              <div class="text-lg font-medium text-slate-900">{{ transaction.packagingName || `ID: ${transaction.packagingId}` }}</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="font-bold block text-sm text-slate-600">Type</span>
                <div class="font-medium text-slate-800">{{ transaction.type }}</div>
              </div>
              <div>
                <span class="font-bold block text-sm text-slate-600">Quantity</span>
                <div :class="['font-medium', transaction.type === 'INVENTORY_OUT' ? 'text-red-600' : 'text-green-600']">
                  {{ transaction.type === 'INVENTORY_OUT' ? '-' : '+' }}{{ transaction.quantity }}
                </div>
              </div>
            </div>

            <div>
              <span class="font-bold block text-sm text-slate-600">Date</span>
              <div class="text-slate-800">{{ transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : 'N/A' }}</div>
            </div>

            <div v-if="transaction.note">
              <span class="font-bold block text-sm text-slate-600">Note</span>
              <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 italic text-slate-700">"{{ transaction.note }}"</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>
