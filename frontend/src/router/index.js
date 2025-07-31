import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import Dashboard from '../pages/dashboard/DashboardPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const user = localStorage.getItem('user')
  const isAuthenticated = !!user
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }
  
  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router