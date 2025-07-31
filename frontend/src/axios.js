// axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use((config) => {
  const token = getCookieValue('XSRF-TOKEN')
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

function getCookieValue(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return null
}

export const getCsrfCookie = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    })
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    console.error('Error obteniendo CSRF cookie:', error)
    throw error
  }
}

export default api