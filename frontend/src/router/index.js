import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'

// Crear el router con las rutas importadas
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards de navegación global (si necesitas agregar más lógica)
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  const isAuthenticated = !!user
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  // Verificar si es una ruta para invitados
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Continuar con la navegación
  next()
})

// Guard después de cada navegación (opcional)
router.afterEach((to, from) => {
  // Lógica después de cada navegación
  // Por ejemplo, analytics, scroll to top, etc.
  window.scrollTo(0, 0)
})

export default router