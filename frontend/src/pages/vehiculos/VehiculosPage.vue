<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Vehículos</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Administra los vehículos del sistema</p>
        </div>
        <button
          @click="openModal('create')"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus class="w-5 h-5 mr-2" />
          Nuevo Vehículo
        </button>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
            <Car class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vehículos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ vehiculos.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ vehiculosActivos }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center">
            <XCircle class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Inactivos</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ vehiculosInactivos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Búsqueda y filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por placa o marca..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <select
          v-model="filtroEstado"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>
    </div>

    <!-- Tabla de vehículos -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Lista de Vehículos</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Placa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Marca
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Modelo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="vehiculo in vehiculosFiltrados" 
              :key="vehiculo.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                #{{ vehiculo.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Car class="w-5 h-5 text-gray-400 mr-2" />
                  <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ vehiculo.placa }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ vehiculo.marca }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ vehiculo.modelo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    vehiculo.estado === 'activo' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  <div 
                    :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      vehiculo.estado === 'activo' ? 'bg-green-400' : 'bg-red-400'
                    ]"
                  ></div>
                  {{ vehiculo.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(vehiculo.fechaRegistro) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openModal('edit', vehiculo)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(vehiculo)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Estado vacío -->
        <div v-if="vehiculosFiltrados.length === 0" class="text-center py-12">
          <Car class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">No se encontraron vehículos</p>
          <button
            @click="openModal('create')"
            class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus class="w-4 h-4 mr-2" />
            Agregar Primer Vehículo
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ modalMode === 'create' ? 'Nuevo Vehículo' : 'Editar Vehículo' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <form @submit.prevent="saveVehiculo" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Placa *
              </label>
              <input
                v-model="currentVehiculo.placa"
                type="text"
                required
                placeholder="ABC-123"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marca *
              </label>
              <input
                v-model="currentVehiculo.marca"
                type="text"
                required
                placeholder="Toyota, Honda, etc."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modelo *
              </label>
              <input
                v-model="currentVehiculo.modelo"
                type="text"
                required
                placeholder="Corolla, Civic, etc."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                v-model="currentVehiculo.estado"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                {{ modalMode === 'create' ? 'Crear' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirmar Eliminación</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            ¿Estás seguro de que deseas eliminar el vehículo con placa <strong>{{ vehiculoToDelete?.placa }}</strong>? 
            Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              @click="deleteVehiculo"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Plus,
  Car,
  Edit,
  Trash2,
  Search,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-vue-next'

export default {
  name: 'VehiculosPage',
  components: {
    Plus,
    Car,
    Edit,
    Trash2,
    Search,
    X,
    CheckCircle,
    XCircle,
    AlertTriangle
  },
  data() {
    return {
      vehiculos: [
        {
          id: 1,
          placa: 'ABC-123',
          marca: 'Toyota',
          modelo: 'Corolla',
          estado: 'activo',
          fechaRegistro: '2024-01-15'
        },
        {
          id: 2,
          placa: 'DEF-456',
          marca: 'Honda',
          modelo: 'Civic',
          estado: 'activo',
          fechaRegistro: '2024-02-20'
        },
        {
          id: 3,
          placa: 'GHI-789',
          marca: 'Nissan',
          modelo: 'Sentra',
          estado: 'inactivo',
          fechaRegistro: '2024-03-10'
        }
      ],
      showModal: false,
      showDeleteModal: false,
      modalMode: 'create', // 'create' or 'edit'
      currentVehiculo: {
        id: null,
        placa: '',
        marca: '',
        modelo: '',
        estado: 'activo'
      },
      vehiculoToDelete: null,
      searchTerm: '',
      filtroEstado: ''
    }
  },
  computed: {
    vehiculosFiltrados() {
      let filtered = this.vehiculos

      // Filtrar por término de búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(vehiculo => 
          vehiculo.placa.toLowerCase().includes(term) ||
          vehiculo.marca.toLowerCase().includes(term) ||
          vehiculo.modelo.toLowerCase().includes(term)
        )
      }

      // Filtrar por estado
      if (this.filtroEstado) {
        filtered = filtered.filter(vehiculo => vehiculo.estado === this.filtroEstado)
      }

      return filtered
    },
    vehiculosActivos() {
      return this.vehiculos.filter(v => v.estado === 'activo').length
    },
    vehiculosInactivos() {
      return this.vehiculos.filter(v => v.estado === 'inactivo').length
    }
  },
  methods: {
    openModal(mode, vehiculo = null) {
      this.modalMode = mode
      if (mode === 'edit' && vehiculo) {
        this.currentVehiculo = { ...vehiculo }
      } else {
        this.resetCurrentVehiculo()
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.resetCurrentVehiculo()
    },
    resetCurrentVehiculo() {
      this.currentVehiculo = {
        id: null,
        placa: '',
        marca: '',
        modelo: '',
        estado: 'activo'
      }
    },
    saveVehiculo() {
      if (this.modalMode === 'create') {
        // Crear nuevo vehículo
        const newId = Math.max(...this.vehiculos.map(v => v.id)) + 1
        const newVehiculo = {
          ...this.currentVehiculo,
          id: newId,
          fechaRegistro: new Date().toISOString().split('T')[0]
        }
        this.vehiculos.push(newVehiculo)
      } else {
        // Editar vehículo existente
        const index = this.vehiculos.findIndex(v => v.id === this.currentVehiculo.id)
        if (index !== -1) {
          this.vehiculos[index] = { ...this.currentVehiculo }
        }
      }
      this.closeModal()
    },
    confirmDelete(vehiculo) {
      this.vehiculoToDelete = vehiculo
      this.showDeleteModal = true
    },
    deleteVehiculo() {
      const index = this.vehiculos.findIndex(v => v.id === this.vehiculoToDelete.id)
      if (index !== -1) {
        this.vehiculos.splice(index, 1)
      }
      this.showDeleteModal = false
      this.vehiculoToDelete = null
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>