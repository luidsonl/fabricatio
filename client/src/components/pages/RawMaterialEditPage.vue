<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApiStore } from '../../store/api'
import MainLayout from '../templates/MainLayout.vue'
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'

const router = useRouter()
const route = useRoute()
const store = useApiStore()

const rawMaterialId = computed(() => Number(route.params.id))
const rawMaterial = computed(() => store.rawMaterials.find((r: any) => r.id === rawMaterialId.value))

const formData = ref({
  code: '',
  name: '',
  description: '',
  unit: 'UNIT',
  fractionable: false
})

watch(rawMaterial, (newVal) => {
  if (newVal) {
    formData.value = {
      code: newVal.code || '',
      name: newVal.name || '',
      description: newVal.description || '',
      unit: newVal.unit || 'UNIT',
      fractionable: newVal.fractionable || false
    }
  }
}, { immediate: true })

onMounted(async () => {
  if (!rawMaterial.value) {
    await store.getRawMaterialById(rawMaterialId.value)
    await store.getRawMaterials()
  }
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  await store.updateRawMaterial(rawMaterialId.value, formData.value as any)
  router.push('/raw-materials')
}
</script>

<template>
  <MainLayout>
    <div class="max-w-md mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-slate-800 text-center">Edit Raw Material</h1>
      <form @submit="handleSubmit" class="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <Input label="Code" v-model="formData.code" required />
        <Input label="Name" v-model="formData.name" required />
        <Input label="Description" v-model="formData.description" />
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-slate-700">Unit</label>
          <select
            class="px-3 py-2 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
            v-model="formData.unit"
          >
            <option value="MILLIGRAM">Milligram</option>
            <option value="GRAM">Gram</option>
            <option value="KILOGRAM">Kilogram</option>
            <option value="TON">Ton</option>
            <option value="MILLILITER">Milliliter</option>
            <option value="LITER">Liter</option>
            <option value="UNIT">Unit</option>
            <option value="PIECE">Piece</option>
            <option value="BOX">Box</option>
            <option value="PACK">Pack</option>
            <option value="DOZEN">Dozen</option>
          </select>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="formData.fractionable"
            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-slate-700">Fractionable</span>
        </label>
        <div class="flex gap-2 justify-end pt-2">
          <Button type="button" @click="router.push('/raw-materials')" class="bg-slate-100 text-slate-700 hover:bg-slate-200">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  </MainLayout>
</template>
