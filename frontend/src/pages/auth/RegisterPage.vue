<script>
import api, { getCsrfCookie } from '../../axios'

export default {
  name: 'RegisterPage',
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
    }
  }
}
</script>

<template>
  <div>
    <h1>Registro</h1>
    <form @submit.prevent="register">
      <div>
        <label>Nombre:</label>
        <input 
          type="text" 
          v-model="form.name" 
          required 
        />
        <div v-if="errors.name" style="color: red;">
          {{ errors.name[0] }}
        </div>
      </div>
      
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
      
      <div>
        <label>Confirmar Password:</label>
        <input 
          type="password" 
          v-model="form.password_confirmation" 
          required 
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>
      
      <div v-if="error" style="color: red;">
        {{ error }}
      </div>
    </form>
    
    <p>
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>
  </div>
</template>