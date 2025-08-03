<script>
import { X } from 'lucide-vue-next'

export default {
  name: 'VehiculosForm',
  components: {
    X
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'create',
      validator: value => ['create', 'edit'].includes(value)
    },
    vehiculo: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      localForm: {
        id: null,
        placa: ''
      }
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initializeForm()
      }
    },
    vehiculo: {
      handler() {
        if (this.show) {
          this.initializeForm()
        }
      },
      deep: true
    }
  },
  methods: {
    initializeForm() {
      if (this.mode === 'edit' && this.vehiculo) {
        this.localForm = { ...this.vehiculo }
      } else {
        this.localForm = {
          id: null,
          placa: ''
        }
      }
    },
    handleSubmit() {
      this.$emit('save', { ...this.localForm })
    },
    handleBackdropClick() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 overflow-y-auto h-full w-full z-50"
    style="background-color: rgba(107, 114, 128, 0.5);"
    @click="handleBackdropClick"
  >
    <div
      class="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
      @click.stop
    >
      <div class="mt-3">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ mode === 'create' ? 'Nuevo Vehículo' : 'Editar Vehículo' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Placa *
            </label>
            <input
              v-model="localForm.placa"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ingrese la placa (ej: ABC-123)"
            />
          </div>
        
          
          <div class="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              {{ mode === 'create' ? 'Crear' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>