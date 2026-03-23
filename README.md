# Blog Frontend

一个基于 Vue 3 + TypeScript + Element Plus + Tailwind CSS 的现代化博客前端项目。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **Element Plus** - Vue 3 组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由管理器
- **Axios** - HTTP 客户端
- **Markdown-it** - Markdown 解析器
- **Highlight.js** - 代码高亮库

## 功能特性

### 前台功能
- 文章列表展示
- 文章详情页（支持 Markdown 渲染）
- 分类和标签浏览
- 文章搜索
- 评论系统（支持回复）
- 点赞和收藏
- 个人中心
- 响应式设计

### 后台管理
- 仪表盘数据统计
- 文章管理（增删改查）
- 评论审核
- 分类和标签管理
- 系统设置

### 技术亮点
- 完整的 TypeScript 类型定义
- 统一的样式管理（Tailwind CSS + SASS）
- 全局事件总线（发布订阅模式）
- Axios 请求拦截和错误处理
- 路由守卫和权限控制
- 组件封装和复用
- 性能优化（懒加载、防抖等）

## 项目结构

```
blogs/
├── src/
│   ├── api/                    # API 接口定义
│   ├── assets/                 # 静态资源
│   ├── components/             # 通用组件
│   │   ├── Navbar.vue          # 导航栏
│   │   ├── ArticleCard.vue     # 文章卡片
│   │   ├── CommentDialog.vue   # 评论弹窗
│   │   ├── CommentItem.vue     # 评论项
│   │   ├── GlobalLoading.vue  # 全局加载
│   │   ├── GlobalNotification.vue  # 全局通知
│   │   ├── MarkdownRenderer.vue  # Markdown 渲染器
│   │   ├── ArticleFormDialog.vue  # 文章表单弹窗
│   │   ├── CategoryDialog.vue  # 分类弹窗
│   │   └── TagDialog.vue       # 标签弹窗
│   ├── config/                 # 配置文件
│   │   ├── index.ts            # 路由和 API 配置
│   │   └── theme.ts            # 主题配置
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   ├── stores/                 # 状态管理
│   │   ├── auth.ts             # 认证状态
│   │   └── theme.ts            # 主题状态
│   ├── styles/                 # 全局样式
│   │   └── index.scss
│   ├── utils/                  # 工具函数
│   │   ├── eventBus.ts         # 事件总线
│   │   ├── eventTypes.ts       # 事件类型定义
│   │   ├── eventEmitter.ts     # 事件发射器
│   │   └── httpClient.ts       # HTTP 客户端
│   ├── views/                  # 页面组件
│   │   ├── Home.vue            # 首页
│   │   ├── ArticleDetail.vue   # 文章详情
│   │   ├── Category.vue        # 分类页
│   │   ├── Tag.vue             # 标签页
│   │   ├── Search.vue          # 搜索页
│   │   ├── About.vue           # 关于页
│   │   ├── Login.vue           # 登录页
│   │   ├── Profile.vue         # 个人中心
│   │   ├── NotFound.vue        # 404 页面
│   │   └── admin/              # 后台管理
│   │       ├── Index.vue       # 后台布局
│   │       ├── Dashboard.vue   # 仪表盘
│   │       ├── Articles.vue    # 文章管理
│   │       ├── Comments.vue    # 评论审核
│   │       └── Settings.vue    # 系统设置
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── vite-env.d.ts           # Vite 类型声明
├── public/                     # 公共资源
├── index.html                  # HTML 模板
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # Tailwind 配置
└── postcss.config.js           # PostCSS 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 开发说明

### 样式管理

项目使用 Tailwind CSS 和 SASS 进行样式管理：

- Tailwind CSS 用于快速构建 UI
- SASS 用于编写复杂的自定义样式
- 全局样式定义在 `src/styles/index.scss`
- 主题配置统一管理在 `src/config/theme.ts`

### API 接口

所有 API 接口定义在 `src/api/index.ts`，使用 TypeScript 进行类型定义。

### 状态管理

使用 Pinia 进行状态管理，主要 store：
- `useAuthStore` - 认证状态
- `useThemeStore` - 主题状态

### 事件总线

使用发布订阅模式实现全局事件通信：
- `EventBus` - 事件总线核心类
- `eventEmitter` - 事件发射器封装
- `EventTypes` - 事件类型枚举

### 路由配置

路由配置在 `src/router/index.ts`，包含：
- 前台路由
- 后台管理路由
- 路由守卫（权限控制）

## 性能优化

- 组件懒加载
- 图片懒加载
- 请求防抖和节流
- 代码分割
- 资源压缩

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT
