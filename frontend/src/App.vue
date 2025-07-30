<script setup>
import { onMounted, ref } from 'vue'
import api from './axios'

const mensaje = ref('Cargando...')

onMounted(async () => {
  try {
    const res = await api.get('/ping')
    mensaje.value = res.data.message
  } catch (err) {
    mensaje.value = 'Error de conexión con el backend'
  }
})
</script>

<template>
  <h1>{{ mensaje }}</h1>
</template>
