<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold mb-2">
              ¡Bienvenido, {{ user?.name || 'Usuario' }}!
            </h1>
            <p class="text-blue-100">
              Aquí tienes un resumen de tu actividad reciente
            </p>
          </div>
          <div class="hidden md:block">
            <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Sparkles class="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="stat in stats" 
          :key="stat.title"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ stat.value }}</p>
              <div class="flex items-center mt-2">
                <span 
                  :class="[
                    'text-sm font-medium',
                    stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ stat.change }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
              </div>
            </div>
            <div 
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                stat.bgColor
              ]"
            >
              <component :is="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Actividad Semanal</h3>
            <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium">
              Ver detalles
            </button>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="text-center">
              <TrendingUp class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">Gráfico de actividad aquí</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Distribución de Datos</h3>
            <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium">
              Ver detalles
            </button>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="text-center">
              <PieChart class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">Gráfico circular aquí</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Actividad Reciente</h3>
            <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium">
              Ver todo
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <div 
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  activity.bgColor
                ]"
              >
                <component :is="activity.icon" :class="['w-5 h-5', activity.iconColor]" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ activity.title }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.description }}</p>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ activity.time }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            v-for="action in quickActions" 
            :key="action.title"
            class="flex flex-col items-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200 group"
          >
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-800">
              <component :is="action.icon" class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-200">
              {{ action.title }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../../layouts/dashboard/MainLayout.vue'
import {
  Sparkles,
  Users,
  FileText,
  TrendingUp,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle,
  Plus,
  Upload,
  Download,
  Share
} from 'lucide-vue-next'

export default {
  name: 'Dashboard',
  components: {
    MainLayout,
    Sparkles,
    Users,
    FileText,
    TrendingUp,
    PieChart,
    Activity,
    CheckCircle,
    AlertCircle,
    Plus,
    Upload,
    Download,
    Share
  },
  data() {
    return {
      user: null,
      stats: [
        {
          title: 'Usuarios Activos',
          value: '2,543',
          change: '+12%',
          icon: 'Users',
          bgColor: 'bg-blue-100 dark:bg-blue-950',
          iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
          title: 'Documentos',
          value: '1,234',
          change: '+8%',
          icon: 'FileText',
          bgColor: 'bg-green-100 dark:bg-green-950',
          iconColor: 'text-green-600 dark:text-green-400'
        },
        {
          title: 'Actividad',
          value: '89%',
          change: '+3%',
          icon: 'TrendingUp',
          bgColor: 'bg-purple-100 dark:bg-purple-950',
          iconColor: 'text-purple-600 dark:text-purple-400'
        },
        {
          title: 'Rendimiento',
          value: '94%',
          change: '+5%',
          icon: 'Activity',
          bgColor: 'bg-orange-100 dark:bg-orange-950',
          iconColor: 'text-orange-600 dark:text-orange-400'
        }
      ],
      recentActivities: [
        {
          id: 1,
          title: 'Nuevo usuario registrado',
          description: 'Juan Pérez se ha registrado en el sistema',
          time: 'Hace 2 min',
          icon: 'Users',
          bgColor: 'bg-blue-100 dark:bg-blue-950',
          iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
          id: 2,
          title: 'Documento actualizado',
          description: 'Informe mensual ha sido modificado',
          time: 'Hace 15 min',
          icon: 'FileText',
          bgColor: 'bg-green-100 dark:bg-green-950',
          iconColor: 'text-green-600 dark:text-green-400'
        },
        {
          id: 3,
          title: 'Tarea completada',
          description: 'Respaldo de base de datos finalizado',
          time: 'Hace 1 hora',
          icon: 'CheckCircle',
          bgColor: 'bg-green-100 dark:bg-green-950',
          iconColor: 'text-green-600 dark:text-green-400'
        },
        {
          id: 4,
          title: 'Alerta del sistema',
          description: 'Uso de memoria al 85%',
          time: 'Hace 2 horas',
          icon: 'AlertCircle',
          bgColor: 'bg-yellow-100 dark:bg-yellow-950',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        }
      ],
      quickActions: [
        {
          title: 'Crear Nuevo',
          icon: 'Plus'
        },
        {
          title: 'Subir Archivo',
          icon: 'Upload'
        },
        {
          title: 'Exportar Datos',
          icon: 'Download'
        },
        {
          title: 'Compartir',
          icon: 'Share'
        }
      ]
    }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          this.user = JSON.parse(userData)
        } catch (error) {
          console.error('Error al analizar los datos del usuario:', error)
          localStorage.removeItem('user')
          this.$router.push('/login')
        }
      }
    }
  }
}
</script>