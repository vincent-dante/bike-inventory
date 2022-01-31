import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Bicycle Inventory' }
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes
})

export default router
