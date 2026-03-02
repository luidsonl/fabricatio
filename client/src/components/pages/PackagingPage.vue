<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PackagingList from '../organisms/PackagingList.vue'
import MainLayout from '../templates/MainLayout.vue'
import Button from '../atoms/Button.vue'
import Modal from '../molecules/Modal.vue'
import Input from '../atoms/Input.vue'
import { useApiStore } from '../../store/api'

const store = useApiStore()
const showForm = ref(false)

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
  formData.value = { name: '', rawMaterialId: 0, quantityInside: '', currentStock: '' }
  showForm.value = false
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Packaging</h1>
        <Button @click="showForm = true">Create New</Button>
      </div>

      <PackagingList />

      <Modal :isOpen="showForm" @close="showForm = false" title="Create New Packaging">
        <form @submit="handleSubmit" class="space-y-4">
          <Input label="Name" v-model="formData.name" required />
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Raw Material</label>
            <select
              class="px-3 py-2 rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
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
            step="0.01"
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

          <div class="flex gap-3 justify-end pt-4">
            <Button type="button" @click="showForm = false" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  </MainLayout>
</template>
