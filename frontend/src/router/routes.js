import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'

import MainLayout from '../layouts/dashboard/MainLayout.vue'

import DashboardPage from '../pages/dashboard/DashboardPage.vue'
import FiscalizadoresPage from '../pages/fiscalizadores/FiscalizadoresPage.vue'

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
    path: '/dashboard',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage
      },

      {
        path: 'fiscalizadores',
        name: 'Fiscalizadores',
        component: FiscalizadoresPage
      },
    ]
  },
  
  {
    path: '/',
    redirect: '/dashboard'
  },
  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
]

export default routes