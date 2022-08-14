import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject) }
  return originalPush.call(this, location).catch((err) => {
    if (Router.isNavigationFailure(err)) {
      // resolve err
      return err
    }
    // rethrow error
    return Promise.reject(err)
  })
}

/* Layout */
import Layout from '@/views/layout/Layout'

const disabledFeatures = process.env.DISABLED_FEATURES || []
const settingsDisabled = disabledFeatures.includes('settings')
const settingsChildren = () => {
  return localStorage.getItem('settingsTabs')
    ? JSON.parse(localStorage.getItem('settingsTabs')).map(({ label, path }) => {
      return {
        path,
        component: () => import(`@/views/settings`),
        name: label,
        meta: { title: label }
      }
    })
    : []
}
const settings = {
  path: '/settings',
  component: Layout,
  name: 'Settings',
  hasSubmenu: true,
  meta: { title: 'settings', icon: 'el-icon-setting', noCache: true },
  children: settingsChildren()
}
const statusesDisabled = disabledFeatures.includes('statuses')
const statuses = {
  path: '/statuses',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/statuses/index'),
      name: 'Statuses',
      meta: { title: 'statuses', icon: 'el-icon-chat-line-square', noCache: true }
    }
  ]
}

const reportsDisabled = disabledFeatures.includes('reports')
const reports = {
  path: '/reports',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/reports/index'),
      name: 'Reports',
      meta: { title: 'reports', icon: 'el-icon-receiving', noCache: true }
    }
  ]
}

const invitesDisabled = disabledFeatures.includes('invites')
const invites = {
  path: '/invites',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/invites/index'),
      name: 'Invites',
      meta: { title: 'invites', icon: 'el-icon-postcard', noCache: true }
    }
  ]
}

const relaysDisabled = disabledFeatures.includes('relays')
const relays = {
  path: '/relays',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/relays/index'),
      name: 'Relays',
      meta: { title: 'relays', icon: 'el-icon-connection', noCache: true }
    }
  ]
}

const moderationLogDisabled = disabledFeatures.includes('moderation-log')
const moderationLog = {
  path: '/moderation_log',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/moderationLog/index'),
      name: 'Moderation Log',
      meta: { title: 'moderationLog', icon: 'el-icon-notebook-2', noCache: true }
    }
  ]
}

const mediaProxyCacheDisabled = disabledFeatures.includes('media-proxy-cache')
const mediaProxyCache = {
  path: '/media_proxy_cache',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/mediaProxyCache/index'),
      name: 'MediaProxy Cache',
      meta: { title: 'mediaProxyCache', icon: 'el-icon-coin', noCache: true }
    }
  ]
}

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login-pleroma',
    component: () => import('@/views/login/pleroma'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/users/index',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/users/index'),
        name: 'Users',
        meta: { title: 'users', icon: 'el-icon-user', noCache: true }
      }
    ]
  },
  ...(statusesDisabled ? [] : [statuses]),
  ...(reportsDisabled ? [] : [reports]),
  ...(invitesDisabled ? [] : [invites]),
  ...(moderationLogDisabled ? [] : [moderationLog]),
  ...(relaysDisabled ? [] : [relays]),
  ...(mediaProxyCacheDisabled ? [] : [mediaProxyCache]),
  ...(settingsDisabled ? [] : [settings]),
  {
    path: '/users/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'UsersShow',
        component: () => import('@/views/users/show')
      }
    ],
    hidden: true
  },
  {
    path: '/statuses/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'StatusShow',
        component: () => import('@/views/statuses/show')
      }
    ],
    hidden: true
  },
  {
    path: '/reports/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ReportsShow',
        component: () => import('@/views/reports/show')
      }
    ],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]
