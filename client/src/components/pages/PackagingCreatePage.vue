<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'

const router = useRouter()
const store = useApiStore()

const formData = ref({
  name: '',
  rawMaterialId: 0,
  quantityInside: '' as string | number,
  currentStock: '' as string | number
})

onMounted(async () => {
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

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!formData.value.rawMaterialId) {
    alert('Please select a raw material')
    return
  }
  await store.createPackaging({
    ...formData.value,
    quantityInside: Number(formData.value.quantityInside),
    currentStock: Number(formData.value.currentStock)
  } as any)
  router.push('/packaging')
}
</script>

<template>
  <MainLayout>
    <div class="max-w-md mx-auto space-y-6">
      <h1 class="text-2xl mb-4 font-bold text-slate-800">Create New Packaging</h1>
      <form @submit="handleSubmit" class="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <Input label="Name" v-model="formData.name" required />
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-slate-700">Raw Material</label>
          <select
            class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
            v-model="formData.rawMaterialId"
            required
          >
            <option :value="0">-- Select --</option>
            <option v-for="rm in store.rawMaterials" :key="rm.id" :value="rm.id">{{ rm.name }}</option>
          </select>
        </div>
        <Input
          label="Quantity Inside"
          type="number"
          step="0.001"
          :modelValue="formData.quantityInside"
          @update:modelValue="val => formData.quantityInside = parseNumber(String(val))"
          required
        />
        <Input
          label="Current Stock"
          type="number"
          :modelValue="formData.currentStock"
          @update:modelValue="val => formData.currentStock = parseNumber(String(val))"
          required
        />
        <div class="flex gap-2 pt-2">
          <Button type="submit">Save</Button>
          <Button type="button" @click="router.push('/packaging')" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
        </div>
      </form>
    </div>
  </MainLayout>
</template>
