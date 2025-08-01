import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'

import MainLayout from '../layouts/dashboard/MainLayout.vue'

import DashboardPage from '../pages/dashboard/DashboardPage.vue'
import InspectoresPage from '../pages/Inspectores/InspectoresPage.vue'
import VehiculosPage from '@/pages/vehiculos/VehiculosPage.vue'

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
        path: 'inspectores',
        name: 'Inspectores',
        component: InspectoresPage
      },
      {
        path: 'vehiculos',
        name: 'Vehiculos',
        component: VehiculosPage
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