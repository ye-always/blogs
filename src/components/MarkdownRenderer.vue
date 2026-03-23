<template>
  <div class="markdown-content" v-html="renderedContent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface Props {
  content: string;
}

const props = defineProps<Props>();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  },
});

const renderedContent = computed(() => {
  if (!props.content) return '';
  return md.render(props.content);
});
</script>

<style scoped>
.markdown-content :deep(h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.83em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 1em 0;
}

.markdown-content :deep(p) {
  margin: 1em 0;
  line-height: 1.6;
}

.markdown-content :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'Fira Code', Monaco, Consolas, 'Courier New', monospace;
}

.markdown-content :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin: 1em 0;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  margin: 0;
  font-size: 100%;
  border-radius: 0;
}

.markdown-content :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 1em 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 2em;
  margin: 1em 0;
}

.markdown-content :deep(li) {
  margin: 0.5em 0;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em 0;
}

.markdown-content :deep(table) {
  border-spacing: 0;
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown-content :deep(table th),
.markdown-content :deep(table td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-content :deep(table th) {
  font-weight: 600;
  background-color: #f6f8fa;
}

.markdown-content :deep(table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

.markdown-content :deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}
</style>
