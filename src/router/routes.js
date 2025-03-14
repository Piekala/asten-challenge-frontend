const routes = [
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        return user.role === 'admin' ? '/admin' : '/user'
      }
      return '/login'
    },
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/AdminDashboard.vue') },
      { path: 'awaiting-users', component: () => import('pages/admin/awaitingUsers.vue') },
      { path: 'user-list', component: () => import('pages/admin/userList.vue') },
      { path: 'documents', component: () => import('pages/DocumentsPage.vue') },
      { path: 'intern-area', component: () => import('pages/InternAreaPage.vue') },
      { path: 'private-area', component: () => import('pages/PrivateAreaPage.vue') },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/UserDashboard.vue') },
      { path: 'access', component: () => import('pages/auth/UserPermissionsPage.vue') },
      { path: 'documents', component: () => import('pages/DocumentsPage.vue') },
      { path: 'intern-area', component: () => import('pages/InternAreaPage.vue') },
      { path: 'private-area', component: () => import('pages/PrivateAreaPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
