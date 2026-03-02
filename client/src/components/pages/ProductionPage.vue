<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'
import Card from '../atoms/Card.vue'
import ProductTransactionList from '../organisms/ProductTransactionList.vue'
import type { ProductionExecutionDTO } from '../../services/api.types'

const store = useApiStore()

const suggestionsLoading = ref(true)
const selectedProductId = ref<number>(0)
const quantity = ref<number>(0)
const consumedMaterials = ref<ProductionExecutionDTO['consumedMaterials']>([])
const note = ref('')

onMounted(async () => {
  store.getProducts()
  store.getPackagings()
  try {
    await store.getProductionSuggestions()
  } finally {
    suggestionsLoading.value = false
  }
})

watch([selectedProductId, quantity, () => store.products, () => store.packagings], () => {
  const selectedProduct = store.products.find((p: any) => p.id === selectedProductId.value)
  if (selectedProduct && quantity.value > 0 && selectedProduct.rawMaterials) {
    const requirements = selectedProduct.rawMaterials.map((rm: any) => {
      const requiredQty = (rm.quantityNeeded || 0) * quantity.value
      const availablePackaging = store.packagings.filter((p: any) => p.rawMaterialId === rm.rawMaterialId) || []
      const defaultPackaging = availablePackaging[0]
      return {
        rawMaterialId: rm.rawMaterialId,
        rawMaterialName: rm.rawMaterialName,
        packagingId: defaultPackaging?.id || 0,
        quantity: requiredQty
      }
    })
    consumedMaterials.value = requirements.map((r: any) => ({ packagingId: r.packagingId, quantity: r.quantity }))
  } else {
    consumedMaterials.value = []
  }
}, { deep: true })

const handleConstraintChange = (index: number, field: 'packagingId' | 'quantity', value: number) => {
  const newConsumed = [...consumedMaterials.value]
  const current = newConsumed[index] || { packagingId: 0, quantity: 0 }
  newConsumed[index] = { ...current, [field]: value }
  consumedMaterials.value = newConsumed
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!selectedProductId.value || quantity.value <= 0) return

  const execBody: ProductionExecutionDTO = {
    producedProducts: [{ productId: selectedProductId.value, quantity: quantity.value }],
    consumedMaterials: consumedMaterials.value,
    note: note.value || undefined,
  }
  await store.executeProduction(execBody)
  selectedProductId.value = 0
  quantity.value = 0
  note.value = ''
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 class="text-2xl mb-4 font-bold text-slate-800">Production Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Production Suggestions -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-slate-800">Production Suggestions</h2>
          <div v-if="suggestionsLoading" class="text-slate-500">Loading...</div>
          <div v-else-if="store.productionSuggestions?.products" class="space-y-3">
            <Card v-for="s in store.productionSuggestions.products" :key="s.productId">
              <div class="font-medium text-slate-800">{{ s.productName }}: <span class="text-blue-600">{{ s.quantityToProduce }}</span></div>
              <div class="text-sm text-slate-500">Price: ${{ s.totalPrice }}</div>
            </Card>
            <div class="text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
              Total: ${{ store.productionSuggestions.grandTotalValue }}
            </div>
          </div>
          <div v-else class="text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-100">
            No suggestions available
          </div>
        </div>

        <!-- Production Execution Form -->
        <div class="space-y-6">
          <section class="p-5 border border-slate-200 rounded-lg bg-white shadow-sm">
            <h2 class="text-xl mb-4 font-semibold text-slate-800">Execute Production</h2>
            <form @submit="handleSubmit" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-slate-700">Product to Produce</label>
                  <select
                    class="px-3 py-2 rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white w-full"
                    v-model="selectedProductId"
                    required
                  >
                    <option :value="0">-- Select Product --</option>
                    <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                </div>
                <Input label="Quantity" type="number" v-model="quantity" required />
              </div>

              <div v-if="selectedProductId && store.products.find((p: any) => p.id === selectedProductId)?.rawMaterials?.length">
                <h3 class="font-semibold mb-2 text-slate-800">Materials to Consume</h3>
                <div class="overflow-x-auto rounded-lg border border-slate-200">
                  <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th class="px-4 py-3 font-medium">Raw Material</th>
                        <th class="px-4 py-3 font-medium">Packaging Source</th>
                        <th class="px-4 py-3 font-medium">Quantity</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="(rm, index) in store.products.find((p: any) => p.id === selectedProductId)?.rawMaterials" :key="rm.rawMaterialId" class="bg-white">
                        <td class="px-4 py-3 font-medium text-slate-800">{{ rm.rawMaterialName }}</td>
                        <td class="px-4 py-3">
                          <select
                            class="px-3 py-1.5 rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white w-full text-sm"
                            :value="consumedMaterials[index]?.packagingId || 0"
                            @change="e => handleConstraintChange(index, 'packagingId', Number((e.target as HTMLSelectElement).value))"
                          >
                            <option :value="0">-- Select Stock --</option>
                            <option
                              v-for="p in store.packagings.filter((pkg: any) => pkg.rawMaterialId === rm.rawMaterialId)"
                              :key="p.id"
                              :value="p.id"
                            >
                              {{ p.name }} (Stock: {{ p.currentStock }})
                            </option>
                          </select>
                        </td>
                        <td class="px-4 py-3">
                          <Input
                            type="number"
                            :modelValue="consumedMaterials[index]?.quantity || 0"
                            @update:modelValue="val => handleConstraintChange(index, 'quantity', Number(val))"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Input label="Production Note" v-model="note" />

              <div class="pt-2">
                <Button type="submit" :disabled="!selectedProductId || quantity <= 0" class="w-full sm:w-auto">
                  Execute Production
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="mt-8 pt-6 border-t border-slate-200">
        <h2 class="text-xl mb-4 font-bold text-slate-800">Recent Transactions</h2>
        <ProductTransactionList />
      </div>
    </div>
  </MainLayout>
</template>
