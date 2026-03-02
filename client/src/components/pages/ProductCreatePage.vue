<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'

const router = useRouter()
const store = useApiStore()

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
  router.push('/products')
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 class="text-2xl mb-4 font-bold text-slate-800">Create New Product</h1>
      <form @submit="handleSubmit" class="max-w-md space-y-3">
        <Input label="Code" v-model="formData.code" required />
        <Input label="Name" v-model="formData.name" required />
        <Input
          label="Price"
          type="number"
          step="0.01"
          :modelValue="formData.price"
          @update:modelValue="val => formData.price = parsePrice(String(val))"
        />
        <label class="flex gap-2 items-center cursor-pointer">
          <input type="checkbox" v-model="formData.fractionable" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <span class="text-sm font-medium text-slate-700">Fractionable</span>
        </label>
        <div class="flex gap-2 pt-2">
          <Button type="submit">Save</Button>
          <Button type="button" @click="router.push('/products')" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
        </div>
      </form>
    </div>
  </MainLayout>
</template>
