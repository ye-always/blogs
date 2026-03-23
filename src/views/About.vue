<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
    <Navbar />
    
    <main class="flex-1 pt-20">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-3xl mx-auto">
          <div class="card p-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">关于我们</h1>
            
            <div class="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                欢迎来到我的个人博客！这是一个分享技术见解、学习心得和生活感悟的平台。
              </p>
              
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">关于博主</h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                我是一名热爱技术的开发者，专注于前端开发和用户体验设计。通过这个博客，我希望能够：
              </p>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>分享最新的技术趋势和开发经验</li>
                <li>记录学习过程中的心得体会</li>
                <li>探讨编程中的问题和解决方案</li>
                <li>与志同道合的朋友交流互动</li>
              </ul>
              
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">技术栈</h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                本博客使用以下技术构建：
              </p>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>Vue 3 - 渐进式JavaScript框架</li>
                <li>TypeScript - JavaScript的超集</li>
                <li>Element Plus - Vue 3组件库</li>
                <li>Tailwind CSS - 实用优先的CSS框架</li>
                <li>Vite - 下一代前端构建工具</li>
              </ul>
              
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">联系方式</h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                如果你有任何问题或建议，欢迎通过以下方式联系我：
              </p>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>邮箱: example@email.com</p>
                <p>GitHub: github.com/yourusername</p>
                <p>Twitter: @yourusername</p>
              </div>
              
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">版权声明</h2>
              <p class="text-gray-700 dark:text-gray-300">
                除非另有说明，本博客所有内容均采用 CC BY-NC-SA 4.0 许可协议。欢迎转载，但请注明出处并保持内容完整。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>
