<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'
import { TransactionType } from '../../services/api.types'

const router = useRouter()
const store = useApiStore()

const formData = ref({
  productId: 0,
  quantity: '' as string | number,
  type: TransactionType.INVENTORY_IN,
  note: ''
})

onMounted(async () => {
  if (store.products.length === 0) {
    await store.getProducts()
  }
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!formData.value.productId) return
  await store.createProductTransaction({
    ...formData.value,
    quantity: Number(formData.value.quantity)
  } as any)
  router.push('/transactions/products')
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-slate-800">New Product Transaction</h1>
      <form @submit="handleSubmit" class="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-slate-700">Product</label>
          <select
            class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
            v-model="formData.productId"
            required
          >
            <option :value="0">-- Select --</option>
            <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <Input label="Quantity" type="number" v-model="formData.quantity" required />
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
        <div class="flex gap-2 pt-2">
          <Button type="button" @click="router.push('/transactions/products')" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
          <Button type="submit">Record</Button>
        </div>
      </form>
    </div>
  </MainLayout>
</template>
