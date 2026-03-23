import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { eventBus, EventTypes } from '@/utils/eventBus';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail.vue'),
    meta: { title: '文章详情' },
  },
  {
    path: '/category',
    name: 'Categories',
    component: () => import('@/views/Categories.vue'),
    meta: { title: '分类列表' },
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/Category.vue'),
    meta: { title: '分类' },
  },
  {
    path: '/tag',
    name: 'Tags',
    component: () => import('@/views/Tags.vue'),
    meta: { title: '标签列表' },
  },
  {
    path: '/tag/:name',
    name: 'Tag',
    component: () => import('@/views/Tag.vue'),
    meta: { title: '标签' },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { title: '搜索' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', guest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Index.vue'),
    meta: { title: '管理后台', requiresAuth: true, requiresAdmin: true },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '仪表盘', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: () => import('@/views/admin/Articles.vue'),
        meta: { title: '文章管理', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'comments',
        name: 'AdminComments',
        component: () => import('@/views/admin/Comments.vue'),
        meta: { title: '评论审核', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { title: '系统设置', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'banners',
        name: 'AdminBanners',
        component: () => import('@/views/admin/Banners.vue'),
        meta: { title: '轮播图管理', requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  if (to.meta.requiresAuth && !token) {
    eventBus.emit(EventTypes.NOTIFICATION_SHOW, { 
      type: 'warning', 
      message: '请先登录' 
    });
    next('/login');
    return;
  }

  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    eventBus.emit(EventTypes.NOTIFICATION_SHOW, { 
      type: 'error', 
      message: '需要管理员权限' 
    });
    next('/');
    return;
  }

  if (to.meta.guest && token) {
    next('/');
    return;
  }

  next();
});

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Blog'} - 个人博客`;
  eventBus.emit(EventTypes.LOADING_END);
});

export default router;
