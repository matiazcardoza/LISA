<script>
import api, { getCsrfCookie } from '../../axios'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'

export default {
  name: 'RegisterPage',
  components: {
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Alert,
    AlertDescription
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      error: null,
      errors: {}
    }
  },
  methods: {
    async register() {
      this.loading = true
      this.error = null
      this.errors = {}
      
      try {
        await getCsrfCookie()
        const response = await api.post('/register', this.form)
        const userResponse = await api.get('/user')
        
        localStorage.setItem('user', JSON.stringify(userResponse.data))
        
        this.$router.push('/')
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || {}
          this.error = 'Por favor corrige los errores del formulario'
        } else if (error.response?.status === 419) {
          this.error = 'Error de seguridad CSRF. Por favor recarga la página e intenta nuevamente.'
          console.log('Error CSRF 419 - recarga necesaria')
        } else {
          this.error = error.response?.data?.message || 'Error al registrarse'
        }
      } finally {
        this.loading = false
      }
    },
    
    getFieldError(field) {
      return this.errors[field] ? this.errors[field][0] : null
    }
  }
}
</script>

<template>
  <!-- Contenedor principal que ocupa toda la pantalla -->
  <div class="w-screen h-screen flex flex-col lg:flex-row">
    
    <!-- Sección de Registro - Lado Izquierdo -->
    <div class="w-full lg:w-1/2 h-full bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <!-- Register Card -->
        <Card class="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader class="space-y-1 pb-6">
            <CardTitle class="text-2xl font-semibold text-center">
              <div class="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <!-- User Plus Icon SVG -->
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
              Crear Cuenta
            </CardTitle>
            <CardDescription class="text-center text-slate-600">
              Regístrate para comenzar tu experiencia
            </CardDescription>
          </CardHeader>
          
          <CardContent class="space-y-6">
            <form @submit.prevent="register" class="space-y-6">
              <!-- Name Field -->
              <div class="space-y-2">
                <Label for="name" class="text-sm font-medium text-slate-700">
                  Nombre Completo
                </Label>
                <div class="relative">
                  <!-- User Icon SVG -->
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <Input
                    id="name"
                    type="text"
                    v-model="form.name"
                    placeholder="Tu nombre completo"
                    required
                    class="pl-10 h-11 transition-all duration-200"
                    :class="{
                      'border-red-500 focus-visible:ring-red-500': getFieldError('name'),
                      'border-slate-200 focus-visible:ring-emerald-500': !getFieldError('name')
                    }"
                  />
                </div>
                <div v-if="getFieldError('name')" class="flex items-center space-x-2 text-sm text-red-600">
                  <!-- Alert Circle Icon SVG -->
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ getFieldError('name') }}</span>
                </div>
              </div>

              <!-- Email Field -->
              <div class="space-y-2">
                <Label for="email" class="text-sm font-medium text-slate-700">
                  Correo Electrónico
                </Label>
                <div class="relative">
                  <!-- Mail Icon SVG -->
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                  <Input
                    id="email"
                    type="email"
                    v-model="form.email"
                    placeholder="tu@ejemplo.com"
                    required
                    class="pl-10 h-11 transition-all duration-200"
                    :class="{
                      'border-red-500 focus-visible:ring-red-500': getFieldError('email'),
                      'border-slate-200 focus-visible:ring-emerald-500': !getFieldError('email')
                    }"
                  />
                </div>
                <div v-if="getFieldError('email')" class="flex items-center space-x-2 text-sm text-red-600">
                  <!-- Alert Circle Icon SVG -->
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ getFieldError('email') }}</span>
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <Label for="password" class="text-sm font-medium text-slate-700">
                  Contraseña
                </Label>
                <div class="relative">
                  <!-- Lock Icon SVG -->
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <Input
                    id="password"
                    type="password"
                    v-model="form.password"
                    placeholder="••••••••"
                    required
                    class="pl-10 h-11 transition-all duration-200"
                    :class="{
                      'border-red-500 focus-visible:ring-red-500': getFieldError('password'),
                      'border-slate-200 focus-visible:ring-emerald-500': !getFieldError('password')
                    }"
                  />
                </div>
                <div v-if="getFieldError('password')" class="flex items-center space-x-2 text-sm text-red-600">
                  <!-- Alert Circle Icon SVG -->
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ getFieldError('password') }}</span>
                </div>
              </div>

              <!-- Password Confirmation Field -->
              <div class="space-y-2">
                <Label for="password_confirmation" class="text-sm font-medium text-slate-700">
                  Confirmar Contraseña
                </Label>
                <div class="relative">
                  <!-- Shield Check Icon SVG -->
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <Input
                    id="password_confirmation"
                    type="password"
                    v-model="form.password_confirmation"
                    placeholder="••••••••"
                    required
                    class="pl-10 h-11 transition-all duration-200 border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <Button
                type="submit"
                :disabled="loading"
                class="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70"
              >
                <!-- Loading Spinner SVG -->
                <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <!-- User Plus Icon SVG -->
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
              </Button>

              <!-- Error Alert -->
              <Alert v-if="error" variant="destructive" class="border-red-200 bg-red-50">
                <!-- Alert Circle Icon SVG -->
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <AlertDescription class="text-red-800">
                  {{ error }}
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-slate-600">
            ¿Ya tienes una cuenta?
            <router-link 
              to="/login" 
              class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200 hover:underline"
            >
              Inicia sesión aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Sección de Imagen - Lado Derecho -->
    <div class="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden">
      <!-- Contenedor de imagen -->
      <img src="/img/portada.jpg" alt="Imagen pública" class="w-full h-full object-cover"/>
    </div>

    <!-- Versión móvil de la imagen (opcional) -->
    <div class="lg:hidden w-full h-32 bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center">
      <div class="text-white text-center">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
        </svg>
        <p class="text-sm font-medium">Únete a Nosotros</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones adicionales */
.transform {
  transition: transform 0.2s ease-in-out;
}

/* Efectos de enfoque mejorados */
.focus-visible\:ring-emerald-500:focus-visible {
  --tw-ring-color: rgb(16 185 129 / 0.5);
}

.focus-visible\:ring-red-500:focus-visible {
  --tw-ring-color: rgb(239 68 68 / 0.5);
}
</style>