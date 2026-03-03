<script setup lang="ts">
import Card from '../atoms/Card.vue'
import Button from '../atoms/Button.vue'
import type { RawMaterialPackagingDTO } from '../../services/api.types'

const props = defineProps<{
  packaging: RawMaterialPackagingDTO
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}>()

const handleEdit = () => {
  if (props.onEdit && props.packaging.id) props.onEdit(props.packaging.id)
}

const handleDelete = () => {
  if (props.onDelete && props.packaging.id) props.onDelete(props.packaging.id)
}
</script>

<template>
  <Card>
    <div class="space-y-3">
      <div class="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">{{ packaging.name }}</div>
      <div class="space-y-1">
        <div class="text-sm text-slate-600 flex justify-between" v-if="packaging.rawMaterialName">
          <span>Raw Material:</span>
          <span class="font-medium text-slate-900">{{ packaging.rawMaterialName }}</span>
        </div>
        <div class="text-sm text-slate-600 flex justify-between">
          <span>Quantity Inside:</span>
          <span class="font-medium text-slate-900">{{ packaging.quantityInside }}</span>
        </div>
        <div class="text-sm text-slate-600 flex justify-between">
          <span>Current Stock:</span>
          <span class="font-medium text-slate-900">{{ packaging.currentStock }}</span>
        </div>
      </div>
      <div class="flex gap-2 mt-4 pt-2 border-t border-slate-100" v-if="onEdit || onDelete">
        <Button v-if="onEdit" @click="handleEdit" class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300">Edit</Button>
        <Button v-if="onDelete" @click="handleDelete" class="flex-1 bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200">Delete</Button>
      </div>
    </div>
  </Card>
</template>
