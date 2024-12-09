import { createRouter, createWebHistory } from 'vue-router'
// import routes from '~pages'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '~pages'

const routes = setupLayouts(generatedRoutes)

// const routes = [
//   {
//     path: '/dtpsub',
//     name: 'dtpsub',
//     component: () => import('@/views/Dtpsub.vue'),
//   },
//   {
//     path: '/dev',
//     name: 'dev',
//     component: () => import('@/views/DevView.vue'),
//   }
// ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
