<template>
  <div class="template-management">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">模板名称</label>
          <el-input v-model="searchForm.templateName" placeholder="请输入模板名称" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">模板分类</label>
          <el-select v-model="searchForm.category" placeholder="请选择" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="日常工作" value="daily" />
            <el-option label="专项任务" value="special" />
            <el-option label="应急任务" value="emergency" />
          </el-select>
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <el-button type="primary" @click="openCreateTemplateDialog">
          <el-icon><Plus /></el-icon>
          新建模板
        </el-button>
      </div>
      <el-table :data="filteredTemplates" border class="template-table">
        <el-table-column prop="templateName" label="模板名称" />
        <el-table-column prop="category" label="分类">
          <template #default="scope">
            <span :class="['category-tag', scope.row.category]">{{ getCategoryText(scope.row.category) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template #default="scope">
            <span :class="['priority-tag', scope.row.priority]">{{ getPriorityText(scope.row.priority) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deadlineDays" label="默认期限（天）" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="useTemplate(scope.row)">使用</el-button>
              <el-button type="primary" size="small" @click="editTemplate(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteTemplate(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTemplates.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="新建模板" v-model="createTemplateDialog" width="600px">
      <el-form :model="createTemplateForm" label-width="120px">
        <div class="form-row">
          <el-form-item label="*模板名称" class="form-item">
            <el-input v-model="createTemplateForm.templateName" placeholder="请输入模板名称" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="*模板分类" class="form-item">
            <el-select v-model="createTemplateForm.category" placeholder="请选择分类" style="width: 150px;">
              <el-option label="日常工作" value="daily" />
              <el-option label="专项任务" value="special" />
              <el-option label="应急任务" value="emergency" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*优先级" class="form-item">
            <el-select v-model="createTemplateForm.priority" placeholder="请选择优先级" style="width: 150px;">
              <el-option label="紧急" value="urgent" />
              <el-option label="高" value="high" />
              <el-option label="普通" value="normal" />
            </el-select>
          </el-form-item>
          <el-form-item label="默认期限（天）" class="form-item">
            <el-input-number v-model="createTemplateForm.deadlineDays" :min="1" :max="365" style="width: 150px;" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="模板描述" class="form-item">
            <el-input v-model="createTemplateForm.description" type="textarea" placeholder="请输入模板描述" style="width: 100%; height: 100px;" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="任务内容模板" class="form-item">
            <el-input v-model="createTemplateForm.taskContent" type="textarea" placeholder="请输入任务内容模板" style="width: 100%; height: 100px;" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="createTemplateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateTemplate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  templateName: '',
  category: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const templates = ref([
  { id: 1, templateName: '贫困户信息录入', category: 'daily', priority: 'high', deadlineDays: 7, description: '定期更新贫困户信息', taskContent: '完成全村贫困户信息的录入和核对工作' },
  { id: 2, templateName: '危房检查', category: 'special', priority: 'urgent', deadlineDays: 3, description: '检查危房改造情况', taskContent: '检查全村危房改造完成情况' },
  { id: 3, templateName: '党员学习组织', category: 'daily', priority: 'normal', deadlineDays: 15, description: '组织党员学习活动', taskContent: '组织本月党员学习活动' },
  { id: 4, templateName: '帮扶资料整理', category: 'daily', priority: 'high', deadlineDays: 10, description: '整理帮扶工作资料', taskContent: '整理本年度帮扶工作相关资料' },
  { id: 5, templateName: '村民收入统计', category: 'special', priority: 'high', deadlineDays: 5, description: '统计村民收入情况', taskContent: '统计全村村民本年度收入情况' }
])

const createTemplateDialog = ref(false)
const createTemplateForm = reactive({
  templateName: '',
  category: 'daily',
  priority: 'normal',
  deadlineDays: 7,
  description: '',
  taskContent: ''
})

const filteredTemplates = computed(() => {
  return templates.value.filter(template => {
    if (searchForm.templateName && !template.templateName.includes(searchForm.templateName)) return false
    if (searchForm.category && template.category !== searchForm.category) return false
    return true
  })
})

const getCategoryText = (category) => {
  const map = { daily: '日常工作', special: '专项任务', emergency: '应急任务' }
  return map[category] || category
}

const getPriorityText = (priority) => {
  const map = { urgent: '紧急', high: '高', normal: '普通' }
  return map[priority] || priority
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.templateName = ''
  searchForm.category = ''
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const openCreateTemplateDialog = () => {
  createTemplateForm.templateName = ''
  createTemplateForm.category = 'daily'
  createTemplateForm.priority = 'normal'
  createTemplateForm.deadlineDays = 7
  createTemplateForm.description = ''
  createTemplateForm.taskContent = ''
  createTemplateDialog.value = true
}

const confirmCreateTemplate = () => {
  if (!createTemplateForm.templateName) {
    ElMessage.error('请输入模板名称')
    return
  }

  const newTemplate = {
    id: Date.now(),
    templateName: createTemplateForm.templateName,
    category: createTemplateForm.category,
    priority: createTemplateForm.priority,
    deadlineDays: createTemplateForm.deadlineDays,
    description: createTemplateForm.description,
    taskContent: createTemplateForm.taskContent
  }
  templates.value.push(newTemplate)
  createTemplateDialog.value = false
  ElMessage.success('模板创建成功')
}

const useTemplate = (template) => {
  ElMessage.info(`使用模板: ${template.templateName}`)
}

const editTemplate = (template) => {
  Object.assign(createTemplateForm, template)
  createTemplateDialog.value = true
}

const deleteTemplate = (template) => {
  const index = templates.value.findIndex(t => t.id === template.id)
  if (index > -1) {
    templates.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}
</script>

<style scoped>
.template-management {
  padding: 20px;
}

.search-panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-label {
  font-size: 14px;
  color: #666;
}

.form-input, .form-select {
  width: 200px;
}

.search-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.table-panel {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.template-table {
  width: 100%;
}

.category-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.category-tag.daily { background: #dcfce7; color: #16a34a; }
.category-tag.special { background: #eef2ff; color: #4f46e5; }
.category-tag.emergency { background: #fee2e2; color: #dc2626; }

.priority-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.priority-tag.urgent { background: #fef0f0; color: #dc2626; }
.priority-tag.high { background: #fff7ed; color: #ea580c; }
.priority-tag.normal { background: #f0fdf4; color: #16a34a; }

.action-buttons {
  display: flex;
  gap: 5px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.form-row {
  margin-bottom: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>