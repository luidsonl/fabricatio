<script setup lang="ts">
import { ref } from 'vue'
import RawMaterialList from '../organisms/RawMaterialList.vue'
import MainLayout from '../templates/MainLayout.vue'
import Button from '../atoms/Button.vue'
import Input from '../atoms/Input.vue'
import Modal from '../molecules/Modal.vue'
import { useApiStore } from '../../store/api'

const store = useApiStore()

const showForm = ref(false)
const editingId = ref<number | null>(null)

const formData = ref({
  code: '',
  name: '',
  description: '',
  unit: 'UNIT',
  fractionable: false
})

const handleCreate = () => {
  editingId.value = null
  formData.value = { code: '', name: '', description: '', unit: 'UNIT', fractionable: false }
  showForm.value = true
}

const handleEdit = (id: number) => {
  const item = store.rawMaterials.find((r: any) => r.id === id)
  if (item) {
    editingId.value = id
    formData.value = {
      code: item.code || '',
      name: item.name || '',
      description: item.description || '',
      unit: item.unit || 'UNIT',
      fractionable: item.fractionable || false
    }
    showForm.value = true
  }
}

const handleDelete = async (id: number) => {
  if (window.confirm('Are you sure you want to delete this raw material?')) {
    await store.deleteRawMaterial(id)
  }
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (editingId.value !== null) {
    await store.updateRawMaterial(editingId.value, formData.value as any)
  } else {
    await store.createRawMaterial(formData.value as any)
  }
  showForm.value = false
}
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Raw Materials</h1>
        <Button @click="handleCreate">Create New</Button>
      </div>

      <RawMaterialList @edit="handleEdit" @delete="handleDelete" />

      <Modal
        :isOpen="showForm"
        @close="showForm = false"
        :title="editingId ? 'Edit Raw Material' : 'Create New Raw Material'"
      >
        <form @submit="handleSubmit" class="space-y-4">
          <Input label="Code" v-model="formData.code" required />
          <Input label="Name" v-model="formData.name" required />
          <Input label="Description" v-model="formData.description" />
          
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Unit</label>
            <select
              v-model="formData.unit"
              class="px-3 py-2 rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none bg-white"
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
