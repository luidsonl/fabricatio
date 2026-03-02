<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Button from '../atoms/Button.vue'
import Modal from '../molecules/Modal.vue'
import Input from '../atoms/Input.vue'
import PackagingTransactionList from '../organisms/PackagingTransactionList.vue'
import { TransactionType } from '../../services/api.types'

const store = useApiStore()
const showForm = ref(false)

const formData = ref({
  packagingId: 0,
  quantity: '' as string | number,
  type: TransactionType.INVENTORY_IN,
  note: ''
})

onMounted(async () => {
  if (store.packagings.length === 0) {
    await store.getPackagings()
  }
})

const parseNumber = (val: string) => {
  let niceValue = val
  if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
    niceValue = val.replace(/^0+/, '')
  }
  return niceValue
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!formData.value.packagingId) return
  await store.createPackagingTransaction({
    ...formData.value,
    quantity: Number(formData.value.quantity)
  } as any)
  formData.value = { packagingId: 0, quantity: '', type: TransactionType.INVENTORY_IN, note: '' }
  showForm.value = false
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Packaging Transactions</h1>
        <Button @click="showForm = true">New Transaction</Button>
      </div>

      <PackagingTransactionList />

      <Modal :isOpen="showForm" @close="showForm = false" title="New Packaging Transaction">
        <form @submit="handleSubmit" class="space-y-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Packaging</label>
            <select
              class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
              v-model="formData.packagingId"
              required
            >
              <option :value="0">-- Select --</option>
              <option v-for="pk in store.packagings" :key="pk.id" :value="pk.id">{{ pk.name }}</option>
            </select>
          </div>
          <Input
            label="Quantity"
            type="number"
            step="0.01"
            :modelValue="formData.quantity"
            @update:modelValue="val => formData.quantity = parseNumber(String(val))"
            required
          />
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Type</label>
            <select
              class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
              v-model="formData.type"
            >
              <option value="INVENTORY_IN">Inventory In</option>
              <option value="INVENTORY_OUT">Inventory Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>
          <Input label="Note" v-model="formData.note" />
          <div class="flex gap-3 justify-end pt-4">
            <Button type="button" @click="showForm = false" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
            <Button type="submit">Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  </MainLayout>
</template>
