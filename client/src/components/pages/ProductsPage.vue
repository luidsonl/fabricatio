<script setup lang="ts">
import { ref } from 'vue'
import ProductList from '../organisms/ProductList.vue'
import MainLayout from '../templates/MainLayout.vue'
import Button from '../atoms/Button.vue'
import Modal from '../molecules/Modal.vue'
import Input from '../atoms/Input.vue'
import { useApiStore } from '../../store/api'

const store = useApiStore()

const showForm = ref(false)
const formData = ref({
  code: '',
  name: '',
  price: '' as string | number,
  fractionable: false
})

const parsePrice = (val: string) => {
  let niceValue = val
  if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
    niceValue = val.replace(/^0+/, '')
  }
  return niceValue
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  await store.createProduct({
    code: formData.value.code,
    name: formData.value.name,
    price: Number(formData.value.price),
    fractionable: formData.value.fractionable
  } as any)
  formData.value = { code: '', name: '', price: '', fractionable: false }
  showForm.value = false
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Products</h1>
        <Button @click="showForm = true">Create New</Button>
      </div>

      <ProductList />

      <Modal :isOpen="showForm" @close="showForm = false" title="Create New Product">
        <form @submit="handleSubmit" class="space-y-4">
          <Input label="Code" v-model="formData.code" required />
          <Input label="Name" v-model="formData.name" required />
          <Input
            label="Price"
            type="number"
            step="0.01"
            :modelValue="formData.price"
            @update:modelValue="val => formData.price = parsePrice(String(val))"
          />
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="formData.fractionable"
              class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-slate-700">Fractionable</span>
          </label>
          <div class="flex gap-3 justify-end pt-4">
            <Button type="button" @click="showForm = false" class="bg-slate-100 text-slate-700 hover:bg-slate-200">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  </MainLayout>
</template>
