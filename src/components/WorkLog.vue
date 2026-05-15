<template>
  <div class="work-log-container">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">村组</label>
          <el-select v-model="searchForm.villageGroup" placeholder="请选择" class="search-select">
            <el-option label="请选择" value="" />
            <el-option label="城东村" value="城东村" />
            <el-option label="大平方村" value="大平方村" />
            <el-option label="光明新村二组" value="光明新村二组" />
            <el-option label="井沟村" value="井沟村" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">类型</label>
          <el-select v-model="searchForm.type" placeholder="请选择" class="search-select">
            <el-option label="请选择" value="" />
            <el-option label="村务工作" value="村务工作" />
            <el-option label="党务工作" value="党务工作" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">记录人</label>
          <el-input v-model="searchForm.recorder" placeholder="请输入记录人" class="search-input" />
        </div>
        <div class="search-item">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">标题</label>
          <el-input v-model="searchForm.title" placeholder="请输入标题" class="search-input" />
        </div>
        <div class="search-item">
          <label class="search-label">时间</label>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="→"
            start-placeholder="开始..."
            end-placeholder="结束..."
            class="search-picker"
          />
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="paginatedData" border>
        <el-table-column prop="villageGroup" label="村组" sortable />
        <el-table-column prop="type" label="类型" sortable />
        <el-table-column prop="recorder" label="记录人" sortable />
        <el-table-column prop="title" label="标题" sortable />
        <el-table-column prop="date" label="时间" sortable />
        <el-table-column prop="content" label="内容" />
        <el-table-column label="操作">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" plain @click="handleView(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="paginatedData.length === 0" class="empty-data">
        <div class="empty-icon">📋</div>
        <p>暂无数据</p>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="数据信息" width="90%" class="dialog-container">
      <div class="form-container">
        <div class="form-row-three">
          <div class="form-item required">
            <label class="form-label">村组</label>
            <el-select v-model="formData.villageGroup" placeholder="请选择" class="form-select">
              <el-option label="城东村" value="城东村" />
              <el-option label="大平方村" value="大平方村" />
              <el-option label="光明新村二组" value="光明新村二组" />
              <el-option label="井沟村" value="井沟村" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">类型</label>
            <el-select v-model="formData.type" placeholder="请选择" class="form-select">
              <el-option label="村务工作" value="村务工作" />
              <el-option label="党务工作" value="党务工作" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">记录人</label>
            <el-input v-model="formData.recorder" placeholder="请输入记录人" class="form-input" />
          </div>
        </div>
        <div class="form-row-two">
          <div class="form-item required">
            <label class="form-label">标题</label>
            <el-input v-model="formData.title" placeholder="请输入标题" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">时间</label>
            <el-date-picker
              v-model="formData.date"
              type="date"
              placeholder="请选择日期"
              class="form-picker"
            />
          </div>
        </div>
        <div class="form-row-full">
          <div class="form-item">
            <label class="form-label">内容</label>
            <div class="editor-container">
              <div class="editor-toolbar">
                <el-button size="small" icon="undo">撤销</el-button>
                <el-button size="small" icon="redo">重做</el-button>
                <span class="toolbar-divider"></span>
                <el-button size="small" icon="bold">加粗</el-button>
                <el-button size="small" icon="italic">斜体</el-button>
                <el-button size="small" icon="underline">下划线</el-button>
                <el-button size="small" icon="strikethrough">删除线</el-button>
                <span class="toolbar-divider"></span>
                <el-button size="small" icon="align-left">左对齐</el-button>
                <el-button size="small" icon="align-center">居中</el-button>
                <el-button size="small" icon="align-right">右对齐</el-button>
                <el-button size="small" icon="align-justify">两端对齐</el-button>
                <span class="toolbar-divider"></span>
                <el-button size="small" icon="list">有序列表</el-button>
                <el-button size="small" icon="list">无序列表</el-button>
                <span class="toolbar-divider"></span>
                <el-button size="small" icon="minus">横线</el-button>
                <el-button size="small" icon="image">图片</el-button>
              </div>
              <textarea v-model="formData.content" placeholder="请输入内容" class="form-textarea-large"></textarea>
            </div>
          </div>
        </div>
        <div class="form-row-full">
          <div class="form-item">
            <label class="form-label">上传照片</label>
            <div class="upload-section">
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="handlePhotoUpload"
                accept="image/*"
                class="upload-btn"
              >
                <el-button size="small" icon="upload">上传</el-button>
              </el-upload>
              <div v-if="formData.photo" class="upload-preview">
                <img :src="formData.photo" alt="照片" />
                <span class="remove-btn" @click="formData.photo = ''">移除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row-full">
          <div class="form-item">
            <label class="form-label">上传附件</label>
            <div class="upload-section">
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="handleAttachmentUpload"
                class="upload-btn"
                multiple
              >
                <el-button size="small" icon="upload">上传</el-button>
              </el-upload>
              <div v-if="formData.attachments && formData.attachments.length > 0" class="attachment-list">
                <div v-for="(file, index) in formData.attachments" :key="index" class="attachment-item">
                  <span>{{ file.name }}</span>
                  <span class="remove-btn" @click="formData.attachments.splice(index, 1)">移除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="工作日志详情" v-model="viewDialogVisible" width="60%" class="dialog-container">
      <div class="view-container">
        <div class="view-row">
          <span class="view-label">村组：</span>
          <span class="view-value">{{ viewData.villageGroup }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">类型：</span>
          <span class="view-value">{{ viewData.type }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">记录人：</span>
          <span class="view-value">{{ viewData.recorder }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">时间：</span>
          <span class="view-value">{{ viewData.date }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">标题：</span>
          <span class="view-value">{{ viewData.title }}</span>
        </div>
        <div class="view-row full">
          <span class="view-label">内容：</span>
          <span class="view-value">{{ viewData.content }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const searchForm = reactive({
  villageGroup: '',
  type: '',
  recorder: '',
  title: '',
  dateRange: []
})

const tableData = ref([
  { id: 1, villageGroup: '城东村', type: '村务工作', recorder: '李', title: '春节期间注意防火', date: '2024-02-01', content: '春节期间燃放爆竹，注意防火' },
  { id: 2, villageGroup: '大平方村', type: '村务工作', recorder: '牛莉', title: '春节期间工作安排', date: '2024-02-01', content: '春节期间燃放爆竹，注意防火' },
  { id: 3, villageGroup: '光明新村二组', type: '党务工作', recorder: '小品', title: '清理村路上的雪', date: '2024-01-02', content: '清理路上的雪' },
  { id: 4, villageGroup: '光明新村二组', type: '党务工作', recorder: '', title: '开展主题党日活动', date: '2023-08-01', content: '开展主题党日活动' },
  { id: 5, villageGroup: '井沟村', type: '党务工作', recorder: '秦玫', title: '推进法制建设工作', date: '2023-05-18', content: '推进法治建设部这一"领头雁' },
  { id: 6, villageGroup: '井沟村', type: '村务工作', recorder: '郑艳霞', title: '健全各项制度', date: '2023-02-10', content: '健全监督责任作督导制度、' },
  { id: 7, villageGroup: '井沟村', type: '村务工作', recorder: '郑艳霞', title: '健全各项制度', date: '2023-02-10', content: '健全监督责任作督导制度、' },
  { id: 8, villageGroup: '井沟村', type: '村务工作', recorder: '郑艳霞', title: '加强监委会成员教育培训', date: '2023-03-10', content: '组织对新当选会成员培训，' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => tableData.value.length)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const formData = reactive({
  villageGroup: '',
  type: '',
  recorder: '',
  date: '',
  title: '',
  content: '',
  photo: '',
  attachments: []
})

const viewData = reactive({
  villageGroup: '',
  type: '',
  recorder: '',
  date: '',
  title: '',
  content: ''
})

const viewDialogVisible = ref(false)

const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const handleReset = () => {
  searchForm.villageGroup = ''
  searchForm.type = ''
  searchForm.recorder = ''
  searchForm.title = ''
  searchForm.dateRange = []
}

const handleAdd = () => {
  isEdit.value = false
  editId.value = null
  resetFormData()
  dialogVisible.value = true
}

const handleView = (row) => {
  Object.assign(viewData, row)
  viewDialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '您确定要删除吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handlePhotoUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.photo = e.target.result
  }
  reader.readAsDataURL(file)
  return false
}

const handleAttachmentUpload = (file) => {
  formData.attachments.push({
    name: file.name,
    size: file.size,
    url: URL.createObjectURL(file)
  })
  return false
}

const resetFormData = () => {
  formData.villageGroup = ''
  formData.type = ''
  formData.recorder = ''
  formData.date = ''
  formData.title = ''
  formData.content = ''
  formData.photo = ''
  formData.attachments = []
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSubmit = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(item => item.id === editId.value)
    if (index > -1) {
      tableData.value[index] = { ...formData, id: editId.value }
    }
    ElMessage.success('修改成功')
  } else {
    tableData.value.push({
      ...formData,
      id: Date.now()
    })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.work-log-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.dialog-container :deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}

.search-panel {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #e8e8e8;
}

.search-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.search-label {
  width: 60px;
  text-align: right;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
}

.search-input {
  width: 160px;
  max-width: 100%;
}

.search-select {
  width: 140px;
  max-width: 100%;
}

.search-picker {
  width: 240px;
  max-width: 100%;
}

.table-panel {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  min-height: 300px;
}

.table-panel :deep(.el-table) {
  width: 100%;
}

.table-panel :deep(.el-table__header-row) {
  background-color: #fafafa;
}

.table-panel :deep(.el-table__header-cell),
.table-panel :deep(.el-table__body-cell) {
  padding: 8px 12px;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-buttons :deep(.el-button) {
  padding: 4px 8px;
  font-size: 12px;
}

.table-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
}

.empty-data {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.empty-data p {
  color: #999;
}

.form-container {
  padding: 10px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-item {
  flex: 1;
}

.form-item.full-item {
  flex: 1 1 100%;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #666;
}

.form-select,
.form-input,
.form-picker {
  width: 100%;
}

.form-textarea {
  width: 100%;
  height: 120px;
}

.form-textarea-large {
  width: 100%;
  height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
}

.form-row-three {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-three .form-item {
  flex: 1;
}

.form-row-two {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-two .form-item {
  flex: 1;
}

.form-row-full {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-full .form-item {
  flex: 1;
}

.form-item.required .form-label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px 10px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  flex-wrap: wrap;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: #dcdfe6;
  margin: 0 5px;
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.upload-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #f56c6c;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
}

.view-container {
  padding: 10px;
}

.view-row {
  display: flex;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.view-row:last-child {
  border-bottom: none;
}

.view-row.full {
  flex-direction: column;
}

.view-label {
  width: 80px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.view-value {
  flex: 1;
}

.pagination-wrapper {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
}
</style>