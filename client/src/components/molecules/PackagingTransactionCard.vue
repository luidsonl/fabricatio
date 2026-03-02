<script setup lang="ts">
import Card from '../atoms/Card.vue'
import { TransactionType, type RawMaterialPackagingTransactionDTO } from '../../services/api.types'

const props = defineProps<{
  transaction: RawMaterialPackagingTransactionDTO
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div @click="emit('click')" :class="['', { 'cursor-pointer transition-all hover:-translate-y-1 duration-200': true }]">
    <Card class="h-full hover:shadow-md transition-shadow">
      <div class="space-y-3">
        <div class="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
          {{ transaction.packagingName || `Packaging ${transaction.packagingId}` }}
        </div>
        <div class="space-y-1">
          <div class="text-sm text-slate-600 flex justify-between">
            <span>Type:</span>
            <span :class="['font-medium px-2 py-0.5 rounded text-xs', transaction.type === TransactionType.INVENTORY_IN ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700']">
              {{ transaction.type }}
            </span>
          </div>
          <div class="text-sm text-slate-600 flex justify-between">
            <span>Quantity:</span>
            <span class="font-medium text-slate-900">{{ transaction.quantity }}</span>
          </div>
          <div v-if="transaction.transactionDate" class="text-sm text-slate-500 flex justify-between">
            <span>Date:</span>
            <span>{{ new Date(transaction.transactionDate).toLocaleDateString() }}</span>
          </div>
          <div v-if="transaction.note" class="text-sm text-slate-500 italic mt-2 pt-2 border-t border-slate-50">
            "{{ transaction.note }}"
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
