<script>
import api, { getCsrfCookie } from '../../axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: null,
      errors: {}
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.error = null
      this.errors = {}
      
      try {
        await getCsrfCookie()
        const loginResponse = await api.post('/login', this.form)

        const userResponse = await api.get('/user')

        localStorage.setItem('user', JSON.stringify(userResponse.data))
        
        this.$router.push('/')
        
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || {}
          this.error = 'Por favor corrige los errores del formulario'
        } else if (error.response?.status === 419) {
          this.error = 'Error de seguridad CSRF. Por favor recarga la página e intenta nuevamente.'
          console.log('Error CSRF 419 en login - recarga necesaria')
        } else if (error.response?.status === 401) {
          this.error = 'Las credenciales proporcionadas son incorrectas.'
        } else {
          this.error = error.response?.data?.message || 'Error al iniciar sesión'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div>
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="login">
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          v-model="form.email" 
          required 
        />
        <div v-if="errors.email" style="color: red;">
          {{ errors.email[0] }}
        </div>
      </div>
      
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          v-model="form.password" 
          required 
        />
        <div v-if="errors.password" style="color: red;">
          {{ errors.password[0] }}
        </div>
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
      
      <div v-if="error" style="color: red;">
        {{ error }}
      </div>
    </form>
    
    <p>
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>