<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Inspectores</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Administra el personal de inspección</p>
        </div>
        <button
          @click="openModal('create')"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus class="w-4 h-4 mr-2" />
          Nuevo Inspector
        </button>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar inspectores..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Filter class="w-4 h-4 text-gray-500" />
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Inspectores</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ filteredInspectores.length }}</p>
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
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ activeInspectores }}</p>
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
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ inactiveInspectores }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Inspectores -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Inspector
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Celular
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
              v-for="inspector in paginatedInspectores"
              :key="inspector.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ inspector.nombres }} {{ inspector.apellidos }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ inspector.id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Phone class="w-4 h-4 text-gray-400 mr-2" />
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ inspector.celular }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    inspector.estado === 'activo'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ inspector.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(inspector.fechaRegistro) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openModal('edit', inspector)"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors duration-200"
                  >
                    <Edit2 class="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button
                    @click="confirmDelete(inspector)"
                    class="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors duration-200"
                  >
                    <Trash2 class="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginación -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando
                <span class="font-medium">{{ startItem }}</span>
                a
                <span class="font-medium">{{ endItem }}</span>
                de
                <span class="font-medium">{{ filteredInspectores.length }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Crear/Editar -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ modalMode === 'create' ? 'Nuevo Inspector' : 'Editar Inspector' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <form @submit.prevent="saveInspector" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombres *
              </label>
              <input
                v-model="form.nombres"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ingrese los nombres"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apellidos *
              </label>
              <input
                v-model="form.apellidos"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ingrese los apellidos"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número Celular *
              </label>
              <input
                v-model="form.celular"
                type="tel"
                required
                pattern="[0-9]{9}"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="999999999"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                v-model="form.estado"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                {{ modalMode === 'create' ? 'Crear' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeDeleteModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Eliminar Inspector
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            ¿Estás seguro de que deseas eliminar al inspector 
            <strong>{{ inspectorToDelete?.nombres }} {{ inspectorToDelete?.apellidos }}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              @click="deleteInspector"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
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
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle
} from 'lucide-vue-next'

export default {
  name: 'InspectoresPage',
  components: {
    Plus,
    Search,
    Filter,
    Users,
    CheckCircle,
    XCircle,
    User,
    Phone,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    AlertTriangle
  },
  data() {
    return {
      inspectores: [
        {
          id: 1,
          nombres: 'Juan Carlos',
          apellidos: 'Pérez López',
          celular: '987654321',
          estado: 'activo',
          fechaRegistro: '2024-01-15'
        },
        {
          id: 2,
          nombres: 'María Elena',
          apellidos: 'García Rodríguez',
          celular: '956123789',
          estado: 'activo',
          fechaRegistro: '2024-01-20'
        },
        {
          id: 3,
          nombres: 'Carlos Alberto',
          apellidos: 'Martínez Silva',
          celular: '945678123',
          estado: 'inactivo',
          fechaRegistro: '2024-02-01'
        },
        {
          id: 4,
          nombres: 'Ana Sofía',
          apellidos: 'López Torres',
          celular: '934567890',
          estado: 'activo',
          fechaRegistro: '2024-02-10'
        }
      ],
      searchTerm: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      showDeleteModal: false,
      modalMode: 'create', // 'create' o 'edit'
      inspectorToDelete: null,
      form: {
        id: null,
        nombres: '',
        apellidos: '',
        celular: '',
        estado: 'activo'
      }
    }
  },
  computed: {
    filteredInspectores() {
      let filtered = this.inspectores

      // Filtrar por término de búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(inspector =>
          inspector.nombres.toLowerCase().includes(term) ||
          inspector.apellidos.toLowerCase().includes(term) ||
          inspector.celular.includes(term)
        )
      }

      // Filtrar por estado
      if (this.statusFilter) {
        filtered = filtered.filter(inspector => inspector.estado === this.statusFilter)
      }

      return filtered
    },
    paginatedInspectores() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredInspectores.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredInspectores.length / this.itemsPerPage)
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage
      return end > this.filteredInspectores.length ? this.filteredInspectores.length : end
    },
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    },
    activeInspectores() {
      return this.inspectores.filter(inspector => inspector.estado === 'activo').length
    },
    inactiveInspectores() {
      return this.inspectores.filter(inspector => inspector.estado === 'inactivo').length
    }
  },
  methods: {
    openModal(mode, inspector = null) {
      this.modalMode = mode
      if (mode === 'edit' && inspector) {
        this.form = { ...inspector }
      } else {
        this.form = {
          id: null,
          nombres: '',
          apellidos: '',
          celular: '',
          estado: 'activo'
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = {
        id: null,
        nombres: '',
        apellidos: '',
        celular: '',
        estado: 'activo'
      }
    },
    saveInspector() {
      if (this.modalMode === 'create') {
        // Crear nuevo inspector
        const newId = Math.max(...this.inspectores.map(i => i.id)) + 1
        const newInspector = {
          ...this.form,
          id: newId,
          fechaRegistro: new Date().toISOString().split('T')[0]
        }
        this.inspectores.push(newInspector)
      } else {
        // Editar inspector existente
        const index = this.inspectores.findIndex(i => i.id === this.form.id)
        if (index !== -1) {
          this.inspectores[index] = { ...this.form }
        }
      }
      this.closeModal()
    },
    confirmDelete(inspector) {
      this.inspectorToDelete = inspector
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.inspectorToDelete = null
    },
    deleteInspector() {
      const index = this.inspectores.findIndex(i => i.id === this.inspectorToDelete.id)
      if (index !== -1) {
        this.inspectores.splice(index, 1)
      }
      this.closeDeleteModal()
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    goToPage(page) {
      if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    }
  },
  watch: {
    filteredInspectores() {
      // Resetear a la primera página cuando cambien los filtros
      this.currentPage = 1
    }
  }
}
</script>