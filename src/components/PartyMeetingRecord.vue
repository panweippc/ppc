<template>
  <div class="meeting-record-container">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">会议主题</label>
          <el-input v-model="searchForm.topic" placeholder="请输入会议主题" class="search-input" />
        </div>
        <div class="search-item">
          <label class="search-label">会议类型</label>
          <el-select v-model="searchForm.type" placeholder="请选择" class="search-select">
            <el-option label="请选择" value="" />
            <el-option label="党员大会" value="partyMeeting" />
            <el-option label="支委会" value="branchMeeting" />
            <el-option label="党小组会" value="groupMeeting" />
            <el-option label="党课" value="partyClass" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">主持人</label>
          <el-input v-model="searchForm.host" placeholder="请输入主持人" class="search-input" />
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
          <label class="search-label">地点</label>
          <el-input v-model="searchForm.location" placeholder="请输入会议地点" class="search-input" />
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
        <el-table-column prop="topic" label="会议主题" sortable />
        <el-table-column prop="type" label="会议类型" sortable />
        <el-table-column prop="host" label="主持人" sortable />
        <el-table-column prop="location" label="地点" sortable />
        <el-table-column prop="date" label="时间" sortable />
        <el-table-column prop="participants" label="参会人数" />
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
            <label class="form-label">会议主题</label>
            <el-input v-model="formData.topic" placeholder="请输入会议主题" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">会议类型</label>
            <el-select v-model="formData.type" placeholder="请选择" class="form-select">
              <el-option label="党员大会" value="党员大会" />
              <el-option label="支委会" value="支委会" />
              <el-option label="党小组会" value="党小组会" />
              <el-option label="党课" value="党课" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">主持人</label>
            <el-input v-model="formData.host" placeholder="请输入主持人" class="form-input" />
          </div>
        </div>
        <div class="form-row-three">
          <div class="form-item">
            <label class="form-label">地点</label>
            <el-input v-model="formData.location" placeholder="请输入会议地点" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">时间</label>
            <el-date-picker
              v-model="formData.date"
              type="datetime"
              placeholder="请选择时间"
              class="form-picker"
            />
          </div>
          <div class="form-item">
            <label class="form-label">参会人数</label>
            <el-input v-model="formData.participants" type="number" placeholder="请输入参会人数" class="form-input" />
          </div>
        </div>
        <div class="form-row-full">
          <div class="form-item">
            <label class="form-label">参会人员</label>
            <div class="participant-selector">
              <el-select
                v-model="formData.selectedParticipants"
                multiple
                placeholder="请选择参会人员"
                class="form-select-large"
                filterable
              >
                <el-option
                  v-for="member in partyMembers"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                />
              </el-select>
              <div class="selected-names">
                <span v-for="(member, index) in selectedParticipantNames" :key="index" class="name-tag">
                  {{ member }}
                  <span class="tag-close" @click="removeParticipant(index)">×</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row-full">
          <div class="form-item">
            <label class="form-label">会议内容</label>
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
              <textarea v-model="formData.content" placeholder="请输入会议内容" class="form-textarea-large"></textarea>
            </div>
          </div>
        </div>
        <div class="form-row-full">
          <div class="form-item">
            <label class="form-label">决议事项</label>
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
              <textarea v-model="formData.resolution" placeholder="请输入决议事项" class="form-textarea-large"></textarea>
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

    <el-dialog title="会议记录详情" v-model="viewDialogVisible" width="90%" class="dialog-container">
      <div class="view-container">
        <div class="view-section">
          <table class="view-table">
            <tr>
              <td class="view-label">会议主题</td>
              <td class="view-value">{{ viewData.topic }}</td>
              <td class="view-label">会议类型</td>
              <td class="view-value">{{ viewData.type }}</td>
            </tr>
            <tr>
              <td class="view-label">主持人</td>
              <td class="view-value">{{ viewData.host }}</td>
              <td class="view-label">地点</td>
              <td class="view-value">{{ viewData.location }}</td>
            </tr>
            <tr>
              <td class="view-label">时间</td>
              <td class="view-value">{{ viewData.date }}</td>
              <td class="view-label">参会人数</td>
              <td class="view-value">{{ viewData.participants }}人</td>
            </tr>
          </table>
        </div>

        <div class="view-section">
          <div class="section-header">
            <span class="section-title">参会人员</span>
          </div>
          <div class="view-content">{{ viewData.participantList }}</div>
        </div>

        <div class="view-section">
          <div class="section-header">
            <span class="section-title">会议内容</span>
          </div>
          <div class="view-content">{{ viewData.content }}</div>
        </div>

        <div class="view-section">
          <div class="section-header">
            <span class="section-title">决议事项</span>
          </div>
          <div class="view-content">{{ viewData.resolution }}</div>
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
  topic: '',
  type: '',
  host: '',
  location: '',
  dateRange: []
})

const tableData = ref([
  { id: 1, topic: '2024年度工作总结会议', type: '党员大会', host: '张书记', location: '村委会会议室', date: '2024-12-20 14:00', participants: 25 },
  { id: 2, topic: '主题党日活动部署', type: '支委会', host: '李主任', location: '村支部办公室', date: '2024-12-15 10:00', participants: 7 },
  { id: 3, topic: '党员学习会议', type: '党小组会', host: '王组长', location: '第一党小组活动室', date: '2024-12-10 09:00', participants: 12 },
  { id: 4, topic: '党风廉政建设党课', type: '党课', host: '赵副书记', location: '村委会大会议室', date: '2024-12-05 15:00', participants: 30 },
  { id: 5, topic: '发展党员讨论会议', type: '支委会', host: '张书记', location: '村支部办公室', date: '2024-11-28 14:00', participants: 8 }
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

const partyMembers = ref([
  { id: 1, name: '张书记' },
  { id: 2, name: '李主任' },
  { id: 3, name: '王组长' },
  { id: 4, name: '赵副书记' },
  { id: 5, name: '刘委员' },
  { id: 6, name: '陈干事' },
  { id: 7, name: '周党员' },
  { id: 8, name: '吴党员' },
  { id: 9, name: '郑党员' },
  { id: 10, name: '孙党员' },
  { id: 11, name: '钱党员' },
  { id: 12, name: '冯党员' }
])

const formData = reactive({
  topic: '',
  type: '',
  host: '',
  location: '',
  date: '',
  participants: '',
  selectedParticipants: [],
  participantList: '',
  content: '',
  resolution: '',
  attachments: []
})

const selectedParticipantNames = computed(() => {
  return formData.selectedParticipants.map(id => {
    const member = partyMembers.value.find(m => m.id === id)
    return member ? member.name : ''
  }).filter(Boolean)
})

const removeParticipant = (index) => {
  formData.selectedParticipants.splice(index, 1)
}

const viewData = reactive({
  topic: '',
  type: '',
  host: '',
  location: '',
  date: '',
  participants: '',
  participantList: '',
  content: '',
  resolution: ''
})

const viewDialogVisible = ref(false)

const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const handleReset = () => {
  searchForm.topic = ''
  searchForm.type = ''
  searchForm.host = ''
  searchForm.location = ''
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
  viewData.participantList = row.participantList || '暂无详细名单'
  viewData.content = row.content || '暂无会议内容'
  viewData.resolution = row.resolution || '暂无决议事项'
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

const handleAttachmentUpload = (file) => {
  formData.attachments.push({
    name: file.name,
    size: file.size,
    url: URL.createObjectURL(file)
  })
  return false
}

const resetFormData = () => {
  formData.topic = ''
  formData.type = ''
  formData.host = ''
  formData.location = ''
  formData.date = ''
  formData.participants = ''
  formData.selectedParticipants = []
  formData.participantList = ''
  formData.content = ''
  formData.resolution = ''
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
.meeting-record-container {
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
  width: 70px;
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

.form-row-three {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-three .form-item {
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

.form-item {
  flex: 1;
}

.form-item.required .form-label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
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
  height: 80px;
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

.remove-btn {
  color: #f56c6c;
  cursor: pointer;
  margin-left: 10px;
}

.form-select-large {
  width: 100%;
  margin-bottom: 10px;
}

.participant-selector {
  width: 100%;
}

.selected-names {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.name-tag {
  display: inline-flex;
  align-items: center;
  background-color: #e8f4fd;
  color: #1989fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.tag-close {
  margin-left: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #999;
}

.tag-close:hover {
  color: #f56c6c;
}

.pagination-wrapper {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
}

.view-container {
  padding: 10px;
}

.view-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.view-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.view-table {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
}

.view-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.view-label {
  width: 120px;
  background-color: #fafafa;
  font-weight: 500;
  color: #666;
  text-align: right;
}

.view-value {
  flex: 1;
}

.section-header {
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #007bff;
}

.section-title {
  font-weight: 600;
  color: #333;
}

.view-content {
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  min-height: 60px;
  white-space: pre-wrap;
}
</style>