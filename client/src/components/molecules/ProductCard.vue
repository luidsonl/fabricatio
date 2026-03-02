<script setup lang="ts">
import Card from '../atoms/Card.vue'
import Button from '../atoms/Button.vue'
import type { ProductDTO } from '../../services/api.types'

const props = defineProps<{
  product: ProductDTO
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}>()

const handleEdit = () => {
  if (props.onEdit && props.product.id) props.onEdit(props.product.id)
}

const handleDelete = () => {
  if (props.onDelete && props.product.id) props.onDelete(props.product.id)
}
</script>

<template>
  <Card>
    <div class="space-y-3">
      <div class="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
        {{ product.code }} - {{ product.name }}
      </div>
      <div class="space-y-1">
        <div class="text-sm text-slate-600 flex justify-between">
          <span>Price:</span>
          <span class="font-medium text-slate-900">${{ product.price }}</span>
        </div>
        <div class="text-sm text-slate-600 flex justify-between">
          <span>Fractionable:</span>
          <span class="font-medium text-slate-900">{{ product.fractionable ? 'Yes' : 'No' }}</span>
        </div>
        <div v-if="product.rawMaterials && product.rawMaterials.length > 0" class="text-sm text-slate-600 flex justify-between">
          <span>Raw Materials:</span>
          <span class="font-medium text-slate-900">{{ product.rawMaterials.length }}</span>
        </div>
      </div>
      <div class="flex gap-2 mt-4 pt-2 border-t border-slate-100" v-if="onEdit || onDelete">
        <Button v-if="onEdit" @click="handleEdit" class="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300">Edit</Button>
        <Button v-if="onDelete" @click="handleDelete" class="flex-1 bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200">Delete</Button>
      </div>
    </div>
  </Card>
</template>
