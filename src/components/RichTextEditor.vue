<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <button 
        type="button" 
        class="toolbar-btn" 
        :class="{ active: editor?.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
        title="粗体"
      >
        <strong>B</strong>
      </button>
      <button 
        type="button" 
        class="toolbar-btn" 
        :class="{ active: editor?.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
        title="斜体"
      >
        <em>I</em>
      </button>
      <button 
        type="button" 
        class="toolbar-btn" 
        :class="{ active: editor?.isActive('strike') }"
        @click="editor?.chain().focus().toggleStrike().run()"
        title="删除线"
      >
        <s>S</s>
      </button>
      <div class="toolbar-divider"></div>
      <button 
        type="button" 
        class="toolbar-btn"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 1 }) }"
        title="标题1"
      >
        H1
      </button>
      <button 
        type="button" 
        class="toolbar-btn"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 2 }) }"
        title="标题2"
      >
        H2
      </button>
      <button 
        type="button" 
        class="toolbar-btn"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 3 }) }"
        title="标题3"
      >
        H3
      </button>
      <div class="toolbar-divider"></div>
      <button 
        type="button" 
        class="toolbar-btn"
        :class="{ active: editor?.isActive('bulletList') }"
        @click="editor?.chain().focus().toggleBulletList().run()"
        title="无序列表"
      >
        <span class="list-icon">• • •</span>
      </button>
      <button 
        type="button" 
        class="toolbar-btn"
        :class="{ active: editor?.isActive('orderedList') }"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        title="有序列表"
      >
        <span class="list-icon">1. 2. 3.</span>
      </button>
      <div class="toolbar-divider"></div>
      <button 
        type="button" 
        class="toolbar-btn"
        @click="editor?.chain().focus().undo().run()"
        :disabled="!editor?.can().undo()"
        title="撤销"
      >
        ↩
      </button>
      <button 
        type="button" 
        class="toolbar-btn"
        @click="editor?.chain().focus().redo().run()"
        :disabled="!editor?.can().redo()"
        title="重做"
      >
        ↪
      </button>
    </div>
    <div class="editor-content">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
  flex-wrap: wrap;
  gap: 2px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background-color: #e8e8e8;
}

.toolbar-btn.active {
  background-color: #1890ff;
  color: #fff;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: #e8e8e8;
  margin: 0 4px;
}

.list-icon {
  font-size: 12px;
}

.editor-content {
  min-height: 150px;
  padding: 12px;
  outline: none;
}

.editor-content :deep(p) {
  margin: 0 0 8px 0;
}

.editor-content :deep(h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.editor-content :deep(h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.editor-content :deep(h3) {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  padding-left: 24px;
  margin: 0 0 8px 0;
}

.editor-content :deep(li) {
  margin-bottom: 4px;
}

.editor-content :deep(s) {
  text-decoration: line-through;
}
</style>