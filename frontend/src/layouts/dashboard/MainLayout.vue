<script>
import {
  LayoutDashboard,
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Menu,
  X,
  User,
  LogOut,
  Bell,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-vue-next'
import api from '../../axios'

export default {
  name: 'MainLayout',
  components: {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    BarChart3,
    FileText,
    Menu,
    X,
    User,
    LogOut,
    Bell,
    ChevronDown,
    Sparkles,
    Sun,
    Moon,
    ShieldCheck
  },
  data() {
    return {
      sidebarOpen: false,
      userMenuOpen: false,
      user: null,
      isDarkMode: false,
      navigationItems: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: 'LayoutDashboard'
        },
        {
          name: 'Usuarios',
          href: '/dashboard/users',
          icon: 'Users'
        },
        {
          name: 'Fiscalizadores',
          href: '/dashboard/fiscalizadores', // ✅ Corregido: agregada la ruta correcta
          icon: 'ShieldCheck'
        },
        {
          name: 'Reportes',
          href: '/dashboard/reports',
          icon: 'BarChart3'
        },
        {
          name: 'Documentos',
          href: '/dashboard/documents',
          icon: 'FileText'
        },
        {
          name: 'Configuración',
          href: '/dashboard/settings',
          icon: 'Settings'
        }
      ]
    }
  },
  computed: {
    pageTitle() {
      const currentRoute = this.$route.matched[this.$route.matched.length - 1]
      if (currentRoute && currentRoute.name) {
        return currentRoute.name
      }
      return 'Dashboard'
    }
  },
  mounted() {
    this.loadUserData()
    document.addEventListener('click', this.handleOutsideClick)
    this.checkDarkMode()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
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
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
    },
    handleOutsideClick(event) {
      if (this.userMenuOpen && this.$refs.userMenu && !this.$refs.userMenu.contains(event.target)) {
        this.userMenuOpen = false
      }
    },
    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    },
    checkDarkMode() {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
        this.isDarkMode = true
      } else {
        document.documentElement.classList.remove('dark')
        this.isDarkMode = false
      }
    },
    toggleDarkMode() {
      if (this.isDarkMode) {
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
      } else {
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
      }
      this.isDarkMode = !this.isDarkMode
    },
    // ✅ Nuevo método para manejar la navegación y cerrar sidebar en móvil
    handleNavigation() {
      if (window.innerWidth < 1024) { // lg breakpoint
        this.sidebarOpen = false
      }
    }
  }
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
      class="lg:translate-x-0 lg:static lg:flex lg:flex-col"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <router-link to="/dashboard" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-semibold text-gray-900 dark:text-gray-100">Panel Admin</span>
        </router-link>
        <button
          @click="toggleSidebar"
          class="lg:hidden p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          @click="handleNavigation"
          :class="[
            'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
            $route.path === item.href || ($route.path.startsWith(item.href) && item.href !== '/dashboard')
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-r-2 border-blue-600'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
              {{ user?.name || 'Cargando...' }}
            </p>
            <p class="text-xs truncate text-gray-500 dark:text-gray-400">
              {{ user?.email || 'email@ejemplo.com' }}
            </p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors duration-200"
        >
          <LogOut class="w-4 h-4 mr-2" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col lg:pl-2">
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-40">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center space-x-4">
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu class="w-5 h-5" />
            </button>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {{ pageTitle }}
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <button
              @click="toggleDarkMode"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Moon v-if="isDarkMode" class="w-5 h-5" />
              <Sun v-else class="w-5 h-5" />
            </button>

            <div class="relative" ref="userMenu">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User class="w-4 h-4" />
                </div>
                <ChevronDown class="w-4 h-4" :class="{ 'rotate-180': userMenuOpen }" />
              </button>
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 origin-top-right"
                >
                  <router-link
                    to="/dashboard/profile"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User class="w-4 h-4 mr-2" />
                    <span>Mi Perfil</span>
                  </router-link>
                  <router-link
                    to="/dashboard/settings"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings class="w-4 h-4 mr-2" />
                    <span>Configuración</span>
                  </router-link>
                  <hr class="my-1 border-gray-200 dark:border-gray-700">
                  <button
                    @click="logout"
                    class="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <LogOut class="w-4 h-4 mr-2" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <!-- ✅ IMPORTANTE: Agregar router-view para renderizar las páginas hijas -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
    ></div>
  </div>
</template>