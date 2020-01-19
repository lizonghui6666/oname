import loadable from '../utils/loadable';

// 最大的容器
const PlatformPage = loadable(() => import('@/views'));

// 数据中心容器盒子组件
const DataContainerPage = loadable(() => import('@/views/platform/datacore'))
// 确权
const DataCorePage = loadable(() => import('@/views/platform/datacore/dataCore'));
// 过程取证
const ProcessPage = loadable(() => import('@/views/platform/datacore/process'));
// 网页取证
const WebPage = loadable(() => import('@/views/platform/datacore/web'))

const DataDetailPage = loadable(() => import('@/views/dataCoreDetail'))


const AdminContainerPage = loadable(() => import('@/views/platform/administration'))
const AdminKeysPage = loadable(() => import('@/views/platform/administration/setKeys'))

const TemplatePage = loadable(() => import('@/views/platform/administration/template'))

const AddressPage = loadable(() => import('@/views/platform/administration/address'))
const ControlTemplatePage = loadable(() => import('@/views/template/template'))


const routes = [
  {
    path: '/platform',
    component: PlatformPage,
    meta: { requireAuth: true },
    children: [
      {
        path: '/platform/data',
        component: DataContainerPage,
        meta: { requireAuth: true },
        children: [
          // {
          //   path: '/platform/data/core',
          //   meta: { requireAuth: true },
          //   component: DataCorePage
          // },
          {
            path: '/platform/data/process',
            meta: { requireAuth: true },
            component: ProcessPage
          },
          {
            path: '/platform/data/web',
            meta: { requireAuth: true },
            component: WebPage
          },
          {
            to: '/platform/data',
            meta: { requireAuth: true },
            redirect: '/platform/data/web'
          }
        ]
      },
      {
        path: '/platform/admin',
        meta: { requireAuth: true },
        component: AdminContainerPage,
        children: [
          // {
          //   path: '/platform/admin/adminSetKeys',
          //   meta: { requireAuth: true },
          //   component: AdminKeysPage
          // },
          {
            path: '/platform/admin/adminTemplate',
            meta: { requireAuth: true },
            component: TemplatePage
          },
          // {
          //   path: '/platform/admin/adminAddress',
          //   meta: { requireAuth: true },
          //   component: AddressPage
          // },
          {
            to: '/platform/admin',
            meta: { requireAuth: true },
            redirect: '/platform/admin/adminTemplate'
          }
        ]
      },
      {
        to: '/platform',
        meta: { requireAuth: true },
        redirect: '/platform/data'
      }
    ]
  },
  {
    path: '/controlTemplate/:id',
    meta: { requireAuth: true },
    component: ControlTemplatePage
  },
  {
    path: '/attestations/:id',
    meta: { requireAuth: true },
    component: DataDetailPage
  },
  {
    to: '/',
    redirect: '/login'
  }
]

export default routes