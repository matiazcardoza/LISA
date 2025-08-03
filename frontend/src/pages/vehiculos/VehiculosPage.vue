<script>
import VehiculosService from '@/services/VehiculosService';
import {
  Plus,
  Search,
  Filter,
  Car,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2
} from 'lucide-vue-next';
import VehiculosForm from './VehiculosForm.vue';

export default {
  name: 'VehiculosPage',
  components: {
    Plus,
    Search,
    Filter,
    Car,
    CheckCircle,
    XCircle,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    VehiculosForm,
    Loader2
  },
  data() {
    return {
      vehiculos: [],
      loading: false,
      error: null,
      searchTerm: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      showDeleteModal: false,
      modalMode: 'create',
      vehiculoToDelete: null,
      selectedVehiculo: null,
      // Estado para manejar la carga del botón de eliminar
      isDeleting: false,
    };
  },
  computed: {
    filteredVehiculos() {
      let filtered = this.vehiculos;

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(vehiculo =>
          vehiculo.placa.toLowerCase().includes(term)
        );
      }

      if (this.statusFilter) {
        filtered = filtered.filter(vehiculo => vehiculo.estado === this.statusFilter);
      }

      return filtered;
    },
    paginatedVehiculos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredVehiculos.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredVehiculos.length / this.itemsPerPage);
    },
    startItem() {
      if (this.filteredVehiculos.length === 0) return 0;
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.filteredVehiculos.length ? this.filteredVehiculos.length : end;
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        } else if (current >= total - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = total - 4; i <= total; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        }
      }

      return pages;
    },
  },
  methods: {
    async fetchVehiculos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await VehiculosService.get();
        this.vehiculos = response;
      } catch (e) {
        this.error = 'Error al cargar los vehículos. Por favor, inténtalo de nuevo.';
        console.error('Error al cargar vehículos:', e);
      } finally {
        this.loading = false;
      }
    },
    openModal(mode, vehiculo = null) {
      this.modalMode = mode;
      this.selectedVehiculo = vehiculo;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedVehiculo = null;
    },
    async saveVehiculo(formData) {
      if (this.modalMode === 'create') {
        try {
          await VehiculosService.save(formData);
          this.fetchVehiculos();
        } catch (e) {
          console.error('Error al guardar el vehículo:', e);
          this.error = 'No se pudo guardar el vehículo.';
        }
      } else {
        try {
          await VehiculosService.save(formData);
          this.fetchVehiculos();
        } catch (e) {
          console.error('Error al actualizar el vehículo:', e);
          this.error = 'No se pudo actualizar el vehículo.';
        }
      }
      this.closeModal();
    },
    confirmDelete(vehiculo) {
      this.vehiculoToDelete = vehiculo;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.vehiculoToDelete = null;
    },
    // Método 'deleteVehiculo' actualizado para llamar al servicio de la API
    async deleteVehiculo() {
      this.isDeleting = true;
      this.error = null;
      try {
        await VehiculosService.eliminar(this.vehiculoToDelete.id);
        
        // Si la eliminación es exitosa, refrescamos la lista completa
        await this.fetchVehiculos();

        // Cerramos el modal de confirmación
        this.closeDeleteModal();
        
      } catch (e) {
        console.error('Error al eliminar el vehículo:', e);
        this.error = 'No se pudo eliminar el vehículo.';
      } finally {
        this.isDeleting = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  watch: {
    filteredVehiculos() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchVehiculos();
  }
};
</script>

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
          <Plus class="w-4 h-4 mr-2" />
          Nuevo Vehículo
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
              placeholder="Buscar vehículos..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
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
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ filteredVehiculos.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Loader2 class="h-6 w-6 animate-spin text-blue-500 mr-2" />
      <span class="text-gray-600 dark:text-gray-400">Cargando vehículos...</span>
    </div>
    <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl p-4 shadow-sm">
      <div class="flex items-center">
        <AlertTriangle class="h-5 w-5 mr-2" />
        <div>{{ error }}</div>
      </div>
    </div>
    <div v-else-if="vehiculos.length === 0 && !loading" class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
      <p class="text-gray-600 dark:text-gray-400">No se encontraron vehículos. Agrega uno nuevo para empezar.</p>
    </div>

    <!-- Tabla de Vehículos -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vehículo
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
              v-for="vehiculo in paginatedVehiculos"
              :key="vehiculo.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                    <Car class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ vehiculo.placa }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ vehiculo.id }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(vehiculo.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openModal('edit', vehiculo)"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors duration-200"
                  >
                    <Edit2 class="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button
                    @click="confirmDelete(vehiculo)"
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
                <span class="font-medium">{{ filteredVehiculos.length }}</span>
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

    <!-- Modal de formulario -->
    <VehiculosForm
      :show="showModal"
      :mode="modalMode"
      :vehiculo="selectedVehiculo"
      @close="closeModal"
      @save="saveVehiculo"
    />

    <!-- Modal de confirmación para eliminar -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(107, 114, 128, 0.5);"
      @click="closeDeleteModal"
    >
      <div
        class="p-5 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Eliminar Vehículo
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            ¿Estás seguro de que deseas eliminar el vehículo con placa
            <strong>{{ vehiculoToDelete?.placa }}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
              :disabled="isDeleting"
            >
              Cancelar
            </button>
            <button
              @click="deleteVehiculo"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 flex items-center"
              :disabled="isDeleting"
            >
              <Loader2 v-if="isDeleting" class="h-4 w-4 animate-spin mr-2" />
              <Trash2 v-else class="h-4 w-4 mr-2" />
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>