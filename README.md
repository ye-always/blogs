# 个人博客系统前端

一个功能完善的现代化博客前端项目，基于 Vue 3 + TypeScript + Element Plus + Tailwind CSS 构建，支持文章发布、评论互动、用户认证等功能。

## 项目概述

这是一个前后端分离的博客系统前端项目，提供完整的用户浏览和管理后台功能。项目采用现代化的技术栈，具有良好的用户体验和响应式设计。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Element Plus** - Vue 3 组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由管理器
- **Axios** - HTTP 客户端
- **md-editor-v3** - Markdown 编辑器
- **markdown-it** - Markdown 解析器
- **Highlight.js** - 代码高亮库
- **Day.js** - 日期处理库
- **SASS** - CSS 预处理器

## 功能特性

### 前台功能
- 首页轮播图展示
- 文章列表展示（支持分页）
- 文章详情页（支持 Markdown 渲染和代码高亮）
- 分类浏览和分类详情页
- 标签浏览和标签详情页
- 文章搜索功能
- 评论系统（支持回复、点赞）
- 文章点赞和收藏
- 用户注册和登录
- 忘记密码功能
- 个人中心（查看个人信息、收藏文章、修改密码）
- 关于页面
- 响应式设计（支持移动端）
- 深色模式支持

### 后台管理
- 仪表盘数据统计（文章数、评论数、用户数等）
- 文章管理（创建、编辑、删除文章）
- 分类管理（创建、编辑、删除分类）
- 标签管理（创建、编辑、删除标签）
- 评论审核（审核通过/拒绝、删除评论）
- 轮播图管理（上传、排序、启用/禁用）
- 用户管理（查看用户、修改角色、禁用账户）
- 系统设置（网站信息、评论设置、注册设置）

### 技术亮点
- 完整的 TypeScript 类型定义
- 统一的样式管理（Tailwind CSS + SASS）
- 全局事件总线（发布订阅模式）
- Axios 请求拦截和错误处理
- 路由守卫和权限控制
- 组件封装和复用
- 性能优化（懒加载、防抖等）
- JWT Token 认证
- 主题切换（亮色/暗色/自动）

## 项目结构

```
blogs/
├── src/
│   ├── api/                    # API 接口定义
│   │   └── index.ts            # 统一的 API 接口
│   ├── assets/                 # 静态资源
│   ├── components/             # 通用组件
│   │   ├── Navbar.vue          # 导航栏
│   │   ├── Footer.vue          # 页脚
│   │   ├── ArticleCard.vue     # 文章卡片
│   │   ├── BannerCarousel.vue  # 轮播图组件
│   │   ├── CommentDialog.vue   # 评论弹窗
│   │   ├── CommentItem.vue     # 评论项
│   │   ├── GlobalLoading.vue   # 全局加载组件
│   │   ├── GlobalNotification.vue  # 全局通知组件
│   │   ├── MarkdownRenderer.vue    # Markdown 渲染器
│   │   ├── ArticleFormDialog.vue   # 文章表单弹窗
│   │   ├── CategoryDialog.vue     # 分类弹窗
│   │   └── TagDialog.vue          # 标签弹窗
│   ├── config/                 # 配置文件
│   │   ├── index.ts            # 路由和 API 配置
│   │   ├── theme.ts            # 主题配置
│   │   └── admin.ts            # 管理员配置
│   ├── router/                 # 路由配置
│   │   └── index.ts            # 路由定义和守卫
│   ├── stores/                 # 状态管理
│   │   ├── auth.ts             # 认证状态
│   │   └── theme.ts            # 主题状态
│   ├── styles/                 # 全局样式
│   │   ├── index.css           # 全局 CSS
│   │   └── index.scss          # 全局 SASS
│   ├── utils/                  # 工具函数
│   │   ├── eventBus.ts         # 事件总线
│   │   ├── eventTypes.ts       # 事件类型定义
│   │   ├── eventEmitter.ts     # 事件发射器
│   │   └── httpClient.ts       # HTTP 客户端封装
│   ├── views/                  # 页面组件
│   │   ├── Home.vue            # 首页
│   │   ├── ArticleDetail.vue   # 文章详情
│   │   ├── Categories.vue      # 分类列表
│   │   ├── Category.vue        # 分类详情
│   │   ├── Tags.vue            # 标签列表
│   │   ├── Tag.vue             # 标签详情
│   │   ├── Search.vue          # 搜索页
│   │   ├── About.vue           # 关于页
│   │   ├── Login.vue           # 登录页
│   │   ├── Register.vue        # 注册页
│   │   ├── ForgotPassword.vue  # 忘记密码页
│   │   ├── Profile.vue         # 个人中心
│   │   ├── NotFound.vue        # 404 页面
│   │   └── admin/              # 后台管理
│   │       ├── Index.vue       # 后台布局
│   │       ├── Dashboard.vue   # 仪表盘
│   │       ├── Articles.vue    # 文章管理
│   │       ├── Comments.vue    # 评论审核
│   │       ├── Settings.vue    # 系统设置
│   │       ├── Banners.vue     # 轮播图管理
│   │       └── Users.vue       # 用户管理
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── vite-env.d.ts           # Vite 类型声明
├── public/                     # 公共资源
├── index.html                  # HTML 模板
├── .env                        # 环境变量（生产）
├── .env.development           # 环境变量（开发）
├── .env.production            # 环境变量（生产）
├── .gitignore                  # Git 忽略文件
├── package.json                # 项目配置
├── package-lock.json           # 依赖锁定文件
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # Node TypeScript 配置
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # Tailwind 配置
└── postcss.config.js           # PostCSS 配置
```

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 或 pnpm
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器，默认运行在 `http://localhost:3000`

```bash
npm run dev
```

### 类型检查

运行 TypeScript 类型检查

```bash
npm run type-check
```

### 构建生产版本

构建生产版本，输出到 `dist` 目录

```bash
npm run build
```

### 预览生产版本

预览生产构建版本

```bash
npm run preview
```

## 环境变量

项目支持多环境配置，根据不同环境加载对应的配置文件：

### 开发环境 (.env.development)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 生产环境 (.env.production)
```env
VITE_API_BASE_URL=https://your-domain.com/api
```

### 通用环境变量说明

- `VITE_API_BASE_URL` - 后端 API 基础地址

## 开发说明

### 样式管理

项目使用 Tailwind CSS 和 SASS 进行样式管理：

- **Tailwind CSS**: 用于快速构建 UI，提供原子类
- **SASS**: 用于编写复杂的自定义样式
- 全局样式定义在 `src/styles/index.css` 和 `src/styles/index.scss`
- 主题配置统一管理在 `src/config/theme.ts`
- 支持深色模式切换

### API 接口

所有 API 接口定义在 `src/api/index.ts`，使用 TypeScript 进行类型定义：

- 统一的请求拦截和响应处理
- 自动添加 JWT Token
- 统一的错误处理机制
- 支持请求取消

### 状态管理

使用 Pinia 进行状态管理，主要 store：

- `useAuthStore` - 认证状态（登录状态、用户信息、Token）
- `useThemeStore` - 主题状态（当前主题、主题切换）

### 事件总线

使用发布订阅模式实现全局事件通信：

- `EventBus` - 事件总线核心类
- `eventEmitter` - 事件发射器封装
- `EventTypes` - 事件类型枚举
- 支持全局通知、加载状态等事件

### 路由配置

路由配置在 `src/router/index.ts`，包含：

- **前台路由**: 首页、文章详情、分类、标签、搜索、关于等
- **后台路由**: 仪表盘、文章管理、评论审核、系统设置等
- **路由守卫**: 
  - 认证守卫（requiresAuth）
  - 管理员权限守卫（requiresAdmin）
  - 访客守卫（guest）
- **自动滚动**: 路由切换时自动滚动到顶部

### 组件说明

#### 通用组件
- **Navbar**: 顶部导航栏，支持主题切换、用户菜单
- **Footer**: 页脚组件
- **ArticleCard**: 文章卡片，展示文章摘要
- **BannerCarousel**: 轮播图组件
- **CommentDialog**: 评论弹窗
- **CommentItem**: 评论项组件
- **GlobalLoading**: 全局加载动画
- **GlobalNotification**: 全局通知提示
- **MarkdownRenderer**: Markdown 渲染器，支持代码高亮
- **ArticleFormDialog**: 文章编辑弹窗
- **CategoryDialog**: 分类管理弹窗
- **TagDialog**: 标签管理弹窗

## 性能优化

项目采用了多种性能优化策略：

- **组件懒加载**: 使用动态 import 实现路由级别的代码分割
- **图片懒加载**: 延迟加载图片资源
- **请求防抖和节流**: 优化频繁触发的操作
- **代码分割**: Vite 自动进行代码分割
- **资源压缩**: 生产环境自动压缩 JS、CSS 资源
- **Tree Shaking**: 自动移除未使用的代码
- **控制台清理**: 生产环境自动移除 console 和 debugger

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端浏览器（iOS Safari、Chrome Mobile）

## 项目配置

### Vite 配置

主要配置项：
- 开发服务器端口：3000
- 自动打开浏览器
- API 代理：`/api` 代理到 `http://localhost:8080`
- 输出目录：`dist`
- 资源目录：`assets`
- 代码分割大小限制：2000KB
- 生产环境移除 console

### TypeScript 配置

- 严格模式开启
- 路径别名：`@` 指向 `src` 目录
- 支持 Vue 单文件组件

### Tailwind 配置

- 支持深色模式
- 自定义主题颜色
- 响应式断点配置

## 默认账号

### 管理员账号
- 用户名：admin
- 密码：admin123

## 常见问题

### 1. 开发环境跨域问题

开发环境已配置代理，无需额外处理。如需修改，请编辑 `vite.config.ts` 中的 `proxy` 配置。

### 2. 类型检查失败

运行 `npm run type-check` 检查类型错误，确保所有类型定义正确。

### 3. 样式不生效

确保 Tailwind CSS 配置正确，检查 `tailwind.config.js` 和 `postcss.config.js`。

### 4. 路由跳转问题

检查路由配置和路由守卫，确保权限设置正确。

## 部署说明

### 构建项目

```bash
npm run build
```

### 部署到服务器

将 `dist` 目录部署到静态文件服务器（如 Nginx、Apache）。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 开发规范

### 代码风格
- 使用 TypeScript 进行类型定义
- 遵循 Vue 3 Composition API 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 PascalCase（组件）或 camelCase（工具函数）

### Git 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具链相关

## 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)

## 许可证

MIT License
