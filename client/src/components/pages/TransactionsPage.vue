<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'
import ProductTransactionList from '../organisms/ProductTransactionList.vue'
import PackagingTransactionList from '../organisms/PackagingTransactionList.vue'
import { TransactionType } from '../../services/api.types'

const store = useApiStore()

const productFormData = ref({
  productId: 0,
  quantity: '' as string | number,
  type: TransactionType.INVENTORY_IN,
  note: ''
})

const packagingFormData = ref({
  packagingId: 0,
  quantity: '' as string | number,
  type: TransactionType.INVENTORY_IN,
  note: ''
})

onMounted(async () => {
  store.getProducts()
  store.getPackagings()
})

const handleProductSubmit = async (e: Event) => {
  e.preventDefault()
  if (!productFormData.value.productId) return
  await store.createProductTransaction({
    ...productFormData.value,
    quantity: Number(productFormData.value.quantity)
  } as any)
  productFormData.value = { productId: 0, quantity: '', type: TransactionType.INVENTORY_IN, note: '' }
}

const handlePackagingSubmit = async (e: Event) => {
  e.preventDefault()
  if (!packagingFormData.value.packagingId) return
  await store.createPackagingTransaction({
    ...packagingFormData.value,
    quantity: Number(packagingFormData.value.quantity)
  } as any)
  packagingFormData.value = { packagingId: 0, quantity: '', type: TransactionType.INVENTORY_IN, note: '' }
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <h1 class="text-2xl font-bold text-slate-800">Stock Transactions</h1>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Product Transactions -->
        <div class="space-y-6">
          <section class="p-5 border border-slate-200 rounded-lg bg-white shadow-sm">
            <h2 class="text-xl mb-4 font-semibold text-slate-800">Record Product Transaction</h2>
            <form @submit="handleProductSubmit" class="space-y-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-slate-700">Product</label>
                <select
                  class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
                  v-model="productFormData.productId"
                  required
                >
                  <option :value="0">-- Select --</option>
                  <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>
              </div>
              <Input label="Quantity" type="number" v-model="productFormData.quantity" required />
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-slate-700">Type</label>
                <select
                  class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
                  v-model="productFormData.type"
                >
                  <option value="INVENTORY_IN">Inventory In</option>
                  <option value="INVENTORY_OUT">Inventory Out</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>
              <Input label="Note" v-model="productFormData.note" />
              <div class="pt-2">
                <Button type="submit">Record</Button>
              </div>
            </form>
          </section>

          <section>
            <h3 class="text-lg mb-4 font-semibold text-slate-800">Product History</h3>
            <ProductTransactionList />
          </section>
        </div>

        <!-- Packaging Transactions -->
        <div class="space-y-6">
          <section class="p-5 border border-slate-200 rounded-lg bg-white shadow-sm">
            <h2 class="text-xl mb-4 font-semibold text-slate-800">Record Packaging Transaction</h2>
            <form @submit="handlePackagingSubmit" class="space-y-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-slate-700">Packaging</label>
                <select
                  class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
                  v-model="packagingFormData.packagingId"
                  required
                >
                  <option :value="0">-- Select --</option>
                  <option v-for="pk in store.packagings" :key="pk.id" :value="pk.id">{{ pk.name }}</option>
                </select>
              </div>
              <Input label="Quantity" type="number" v-model="packagingFormData.quantity" required />
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-slate-700">Type</label>
                <select
                  class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
                  v-model="packagingFormData.type"
                >
                  <option value="INVENTORY_IN">Inventory In</option>
                  <option value="INVENTORY_OUT">Inventory Out</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>
              <Input label="Note" v-model="packagingFormData.note" />
              <div class="pt-2">
                <Button type="submit">Record</Button>
              </div>
            </form>
          </section>

          <section>
            <h3 class="text-lg mb-4 font-semibold text-slate-800">Packaging History</h3>
            <PackagingTransactionList />
          </section>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
