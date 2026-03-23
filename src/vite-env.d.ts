declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it' {
  import { PluginSimple } from 'markdown-it'
  const markdownIt: any
  export default markdownIt
}
