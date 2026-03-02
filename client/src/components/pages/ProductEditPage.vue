<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'
import Card from '../atoms/Card.vue'

const router = useRouter()
const route = useRoute()
const store = useApiStore()

const productId = computed(() => Number(route.params.id))
const product = computed(() => store.products.find((p: any) => p.id === productId.value))

const formData = ref({
  code: '',
  name: '',
  price: '' as string | number,
  fractionable: false
})

const newAssoc = ref({ rawMaterialId: 0, quantity: '' as string | number })

const loadData = async () => {
  if (!product.value) {
    await store.getProductById(productId.value)
    await store.getProducts() // Refresh the store list if needed
  }
}

watch(product, (newVal) => {
  if (newVal) {
    formData.value = {
      code: newVal.code || '',
      name: newVal.name || '',
      price: newVal.price || 0,
      fractionable: newVal.fractionable || false
    }
  }
}, { immediate: true })

onMounted(async () => {
  await loadData()
  if (store.rawMaterials.length === 0) {
    await store.getRawMaterials()
  }
})

const parseNumber = (val: string) => {
  let niceValue = val
  if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
    niceValue = val.replace(/^0+/, '')
  }
  return niceValue
}

const handleAddAssoc = async () => {
  if (newAssoc.value.rawMaterialId && Number(newAssoc.value.quantity) > 0) {
    await store.addRawMaterialToProduct(productId.value, newAssoc.value.rawMaterialId, Number(newAssoc.value.quantity))
    newAssoc.value = { rawMaterialId: 0, quantity: '' }
  }
}

const handleRemoveAssoc = async (assocId: number) => {
  await store.removeRawMaterialFromProduct(assocId)
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  await store.updateProduct(productId.value, {
    ...formData.value,
    price: Number(formData.value.price)
  } as any)
  router.push('/products')
}
</script>

<template>
  <MainLayout>
    <div class="space-y-6 max-w-3xl mx-auto p-4 sm:px-6 lg:px-8">
      <section>
        <h2 class="text-xl mb-3 font-bold text-slate-800">Product Details</h2>
        <form @submit="handleSubmit" class="space-y-3">
          <Input label="Code" v-model="formData.code" required />
          <Input label="Name" v-model="formData.name" required />
          <Input
            label="Price"
            type="number"
            step="0.01"
            :modelValue="formData.price"
            @update:modelValue="val => formData.price = parseNumber(String(val))"
          />
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="formData.fractionable" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span class="text-sm font-medium text-slate-700">Fractionable</span>
          </label>
          <div class="flex gap-2 pt-2">
            <Button type="submit">Save Changes</Button>
            <Button type="button" @click="router.push('/products')" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Back</Button>
          </div>
        </form>
      </section>

      <section class="border-t border-slate-200 pt-6">
        <h2 class="text-xl mb-4 font-semibold text-slate-800">Raw Material Associations</h2>
        <div class="space-y-4 mb-6">
          <div v-if="!product?.rawMaterials?.length" class="text-slate-500 italic">No raw materials associated.</div>
          <Card v-for="rm in product?.rawMaterials" :key="rm.id">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-semibold text-slate-800">{{ rm.rawMaterialName }}</span>
                <span class="text-slate-500 mx-2">|</span>
                <span class="text-sm text-slate-600">Qty: {{ rm.quantityNeeded }}</span>
              </div>
              <Button @click="handleRemoveAssoc(rm.id!)" class="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">Remove</Button>
            </div>
          </Card>
        </div>

        <div class="p-5 border border-slate-200 rounded-lg bg-slate-50">
          <h3 class="font-semibold mb-4 text-slate-800">Add Raw Material</h3>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">Select Raw Material</label>
              <select
                class="px-3 py-2 rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
                v-model="newAssoc.rawMaterialId"
              >
                <option :value="0">-- Select --</option>
                <option v-for="rm in store.rawMaterials" :value="rm.id" :key="rm.id">{{ rm.name }}</option>
              </select>
            </div>
            <Input
              label="Quantity"
              type="number"
              step="0.001"
              :modelValue="newAssoc.quantity"
              @update:modelValue="val => newAssoc.quantity = parseNumber(String(val))"
            />
            <div class="flex justify-end mt-2">
              <Button @click="handleAddAssoc" :disabled="!newAssoc.rawMaterialId || Number(newAssoc.quantity) <= 0">
                Add Association
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>
