import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresGuest) {
    if (token) {
      next(user?.role === 'admin' ? '/admin' : '/user')
      return
    }
    next()
    return
  }

  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
      return
    }

    if (to.meta.role && user?.role !== to.meta.role) {
      next('/')
      return
    }
  }

  next()
})

export default router
