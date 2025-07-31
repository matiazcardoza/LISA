<template>
  <div>
    <h1>Dashboard</h1>
    <p>Bienvenido, {{ user?.name || 'Usuario' }}!</p>
    <button @click="logout">Cerrar Sesión</button>
  </div>
</template>

<script>
import api from '../../axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: null
    }
  },
  mounted() {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        this.user = JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    }
  },
  methods: {
    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    }
  }
}
</script>