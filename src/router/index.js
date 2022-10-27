import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: '/user/center',
        component: () => import('@/views/user/index'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

export const asyncRoutes = [
  // {
  //   path: '/cmdb',
  //   name: 'cmdb',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   alwaysShow: true,
  //   meta: { title: '资产管理', icon: 'documentation', roles: ['运维组'] },
  //   children: [
  //     {
  //       path: '/cmdb/servers',
  //       name: 'ServersList',
  //       component: () => import('@/views/cmdb/serverslist'),
  //       meta: {
  //         title: '资产列表',
  //         icon: 'user',
  //         roles: ['运维组'],
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/weekly',
    name: 'weekly',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: { title: '周报', icon: 'documentation', roles: ['admin', 'weekly'] },
    children: [
      {
        path: '/weekly/handletype',
        name: 'handleType',
        component: () => import('@/views/weekly/handleType'),
        meta: {
          title: '处理类别',
          icon: 'user',
          roles: ['admin', 'weekly'],
          noCache: true
        }
      },
      {
        path: '/weekly/project',
        name: 'project',
        component: () => import('@/views/weekly/project'),
        meta: {
          title: '项目',
          icon: 'user',
          roles: ['admin', 'weekly'],
          noCache: true
        }
      },
      {
        path: '/weekly/report',
        name: 'report',
        component: () => import('@/views/weekly/report'),
        meta: {
          title: '报告',
          icon: 'user',
          roles: ['admin', 'weekly'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'documentation', roles: ['admin'] },
    children: [
      {
        path: '/system/users',
        name: 'Users',
        component: () => import('@/views/system/users'),
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: '/system/roles',
        name: 'Roles',
        component: () => import('@/views/system/roles'),
        meta: {
          title: '角色管理',
          icon: 'peoples',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: '/system/while',
        name: 'while',
        component: () => import('@/views/system/while'),
        meta: {
          title: '白名单',
          icon: 'peoples',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: '/system/loginlog',
        name: 'loginLog',
        component: () => import('@/views/system/loginLog'),
        meta: {
          title: '登录日志',
          icon: 'peoples',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: '/system/operationlog',
        name: 'operationLog',
        component: () => import('@/views/system/operationLog'),
        meta: {
          title: '操作日志',
          icon: 'peoples',
          roles: ['admin'],
          noCache: true
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
