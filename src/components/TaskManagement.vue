<template>
  <div class="task-management">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">任务名称</label>
          <el-input v-model="searchForm.taskName" placeholder="请输入任务名称" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">优先级</label>
          <el-select v-model="searchForm.priority" placeholder="请选择" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="紧急" value="urgent" />
            <el-option label="高" value="high" />
            <el-option label="普通" value="normal" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">状态</label>
          <el-select v-model="searchForm.status" placeholder="请选择" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="待分配" value="pending" />
            <el-option label="进行中" value="inProgress" />
            <el-option label="待验收" value="pendingReview" />
            <el-option label="已完成" value="completed" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="已超时" value="timeout" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">指派人员</label>
          <el-select v-model="searchForm.assignee" placeholder="请选择" class="form-select">
            <el-option label="全部" value="" />
            <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
          </el-select>
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <el-button type="primary" @click="openCreateTaskDialog">
          <el-icon><Plus /></el-icon>
          创建任务
        </el-button>
      </div>
      <el-table :data="filteredTasks" border class="task-table">
        <el-table-column prop="taskName" label="任务名称" min-width="200" />
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="scope">
            <span :class="['priority-tag', scope.row.priority]">
              {{ getPriorityText(scope.row.priority) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="assigneeName" label="指派人员" width="100" />
        <el-table-column prop="deadline" label="截止时间" width="120">
          <template #default="scope">
            <span :class="{ 'timeout': isTimeout(scope.row) }">{{ scope.row.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="scope">
            <div class="progress-wrapper">
              <el-progress :percentage="scope.row.progress" :show-text="false" />
              <span class="progress-text">{{ scope.row.progress }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span :class="['status-tag', scope.row.status]">
              {{ getStatusText(scope.row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button v-if="scope.row.status === 'pending'" type="primary" size="small" @click="assignTask(scope.row)">指派</el-button>
              <el-button v-if="scope.row.status === 'inProgress'" type="primary" size="small" @click="updateProgress(scope.row)">更新进度</el-button>
              <el-button v-if="scope.row.status === 'inProgress'" type="success" size="small" @click="submitTask(scope.row)">提交验收</el-button>
              <el-button v-if="scope.row.status === 'pendingReview'" type="success" size="small" @click="approveTask(scope.row)">通过</el-button>
              <el-button v-if="scope.row.status === 'pendingReview'" type="danger" size="small" @click="rejectTask(scope.row)">驳回</el-button>
              <el-button type="text" size="small" @click="viewTask(scope.row)">查看</el-button>
              <el-button type="danger" size="small" @click="deleteTask(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTasks.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="创建任务" v-model="createTaskDialog" width="700px">
      <el-form :model="createTaskForm" label-width="120px">
        <div class="form-row">
          <el-form-item label="*任务名称" class="form-item">
            <el-input v-model="createTaskForm.taskName" placeholder="请输入任务名称" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="*优先级" class="form-item">
            <el-select v-model="createTaskForm.priority" placeholder="请选择优先级" style="width: 150px;">
              <el-option label="紧急" value="urgent" />
              <el-option label="高" value="high" />
              <el-option label="普通" value="normal" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*指派人员" class="form-item">
            <el-select v-model="createTaskForm.assigneeId" placeholder="请选择指派人员" style="width: 200px;" filterable>
              <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="*截止时间" class="form-item">
            <el-date-picker v-model="createTaskForm.deadline" type="date" placeholder="请选择截止时间" style="width: 200px;" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="任务描述" class="form-item">
            <el-input v-model="createTaskForm.description" type="textarea" placeholder="请输入任务描述" style="width: 500px; height: 100px;" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="createTaskDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateTask">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="更新进度" v-model="updateProgressDialog" width="400px">
      <el-form :model="progressForm" label-width="100px">
        <el-form-item label="*进度百分比">
          <el-slider v-model="progressForm.progress" :min="0" :max="100" :show-input="true" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="progressForm.remark" type="textarea" placeholder="请输入进度说明" style="width: 100%; height: 80px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateProgressDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateProgress">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="驳回任务" v-model="rejectDialog" width="400px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="*驳回理由" class="form-item">
          <el-input v-model="rejectForm.reason" type="textarea" placeholder="请输入驳回理由" style="width: 100%; height: 100px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="任务详情" v-model="viewTaskDialog" width="600px">
      <div class="task-detail">
        <div class="detail-row">
          <span class="detail-label">任务名称</span>
          <span class="detail-value">{{ viewingTask.taskName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">优先级</span>
          <span :class="['priority-tag', viewingTask.priority]">{{ getPriorityText(viewingTask.priority) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">指派人员</span>
          <span class="detail-value">{{ viewingTask.assigneeName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">截止时间</span>
          <span class="detail-value">{{ viewingTask.deadline }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">当前进度</span>
          <div class="progress-wrapper">
            <el-progress :percentage="viewingTask.progress" :show-text="false" />
            <span class="progress-text">{{ viewingTask.progress }}%</span>
          </div>
        </div>
        <div class="detail-row">
          <span class="detail-label">任务状态</span>
          <span :class="['status-tag', viewingTask.status]">{{ getStatusText(viewingTask.status) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">任务描述</span>
          <p class="detail-value">{{ viewingTask.description }}</p>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建时间</span>
          <span class="detail-value">{{ viewingTask.createTime }}</span>
        </div>
        <div v-if="viewingTask.interactionRecords && viewingTask.interactionRecords.length > 0" class="interaction-section">
          <h4>交互记录</h4>
          <div v-for="(record, index) in viewingTask.interactionRecords" :key="index" class="interaction-item">
            <span class="record-time">{{ record.time }}</span>
            <span class="record-action">{{ record.action }}</span>
            <span v-if="record.reason" class="record-reason">{{ record.reason }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewTaskDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  taskName: '',
  priority: '',
  status: '',
  assignee: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const users = ref([
  { id: 1, name: '张三', department: '第一组' },
  { id: 2, name: '李四', department: '第一组' },
  { id: 3, name: '王五', department: '第二组' },
  { id: 4, name: '赵六', department: '第二组' },
  { id: 5, name: '钱七', department: '第三组' }
])

const tasks = ref([
  {
    id: 1,
    taskName: '完成贫困户信息录入',
    priority: 'urgent',
    assigneeId: 1,
    assigneeName: '张三',
    deadline: '2026-05-20',
    progress: 75,
    status: 'inProgress',
    description: '完成全村贫困户信息的录入和核对工作',
    createTime: '2026-05-15 09:00',
    interactionRecords: [
      { time: '2026-05-15 09:00', action: '任务创建', reason: '' },
      { time: '2026-05-15 09:30', action: '任务指派给张三', reason: '' }
    ]
  },
  {
    id: 2,
    taskName: '整理帮扶资料',
    priority: 'high',
    assigneeId: 2,
    assigneeName: '李四',
    deadline: '2026-05-25',
    progress: 40,
    status: 'inProgress',
    description: '整理本年度帮扶工作相关资料',
    createTime: '2026-05-16 10:00',
    interactionRecords: [
      { time: '2026-05-16 10:00', action: '任务创建', reason: '' },
      { time: '2026-05-16 10:15', action: '任务指派给李四', reason: '' }
    ]
  },
  {
    id: 3,
    taskName: '检查危房改造情况',
    priority: 'urgent',
    assigneeId: 3,
    assigneeName: '王五',
    deadline: '2026-05-18',
    progress: 100,
    status: 'pendingReview',
    description: '检查全村危房改造完成情况',
    createTime: '2026-05-10 08:00',
    interactionRecords: [
      { time: '2026-05-10 08:00', action: '任务创建', reason: '' },
      { time: '2026-05-10 08:30', action: '任务指派给王五', reason: '' },
      { time: '2026-05-17 17:00', action: '提交验收', reason: '已完成全部危房检查' }
    ]
  },
  {
    id: 4,
    taskName: '组织党员学习',
    priority: 'normal',
    assigneeId: 4,
    assigneeName: '赵六',
    deadline: '2026-05-30',
    progress: 20,
    status: 'inProgress',
    description: '组织本月党员学习活动',
    createTime: '2026-05-14 14:00',
    interactionRecords: [
      { time: '2026-05-14 14:00', action: '任务创建', reason: '' },
      { time: '2026-05-14 14:30', action: '任务指派给赵六', reason: '' }
    ]
  },
  {
    id: 5,
    taskName: '统计村民收入情况',
    priority: 'high',
    assigneeId: 5,
    assigneeName: '钱七',
    deadline: '2026-05-15',
    progress: 100,
    status: 'timeout',
    description: '统计全村村民本年度收入情况',
    createTime: '2026-05-10 09:00',
    interactionRecords: [
      { time: '2026-05-10 09:00', action: '任务创建', reason: '' },
      { time: '2026-05-10 09:15', action: '任务指派给钱七', reason: '' },
      { time: '2026-05-16 00:00', action: '任务已超时', reason: '未在截止时间前完成' }
    ]
  }
])

const createTaskDialog = ref(false)
const createTaskForm = reactive({
  taskName: '',
  priority: 'normal',
  assigneeId: '',
  deadline: '',
  description: ''
})

const updateProgressDialog = ref(false)
const progressForm = reactive({
  progress: 0,
  remark: ''
})
const editingTask = ref(null)

const rejectDialog = ref(false)
const rejectForm = reactive({
  reason: ''
})
const rejectingTask = ref(null)

const viewTaskDialog = ref(false)
const viewingTask = reactive({})

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    if (searchForm.taskName && !task.taskName.includes(searchForm.taskName)) return false
    if (searchForm.priority && task.priority !== searchForm.priority) return false
    if (searchForm.status && task.status !== searchForm.status) return false
    if (searchForm.assignee && task.assigneeId !== parseInt(searchForm.assignee)) return false
    return true
  })
})

const getPriorityText = (priority) => {
  const map = { urgent: '紧急', high: '高', normal: '普通' }
  return map[priority] || priority
}

const getStatusText = (status) => {
  const map = {
    pending: '待分配',
    inProgress: '进行中',
    pendingReview: '待验收',
    completed: '已完成',
    rejected: '已驳回',
    timeout: '已超时'
  }
  return map[status] || status
}

const isTimeout = (task) => {
  if (task.status === 'completed') return false
  return new Date(task.deadline) < new Date()
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.taskName = ''
  searchForm.priority = ''
  searchForm.status = ''
  searchForm.assignee = ''
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const openCreateTaskDialog = () => {
  createTaskForm.taskName = ''
  createTaskForm.priority = 'normal'
  createTaskForm.assigneeId = ''
  createTaskForm.deadline = ''
  createTaskForm.description = ''
  createTaskDialog.value = true
}

const confirmCreateTask = () => {
  if (!createTaskForm.taskName) {
    ElMessage.error('请输入任务名称')
    return
  }
  if (!createTaskForm.assigneeId) {
    ElMessage.error('请选择指派人员')
    return
  }
  if (!createTaskForm.deadline) {
    ElMessage.error('请选择截止时间')
    return
  }

  const user = users.value.find(u => u.id === createTaskForm.assigneeId)
  const newTask = {
    id: Date.now(),
    taskName: createTaskForm.taskName,
    priority: createTaskForm.priority,
    assigneeId: createTaskForm.assigneeId,
    assigneeName: user ? user.name : '',
    deadline: createTaskForm.deadline,
    progress: 0,
    status: 'pending',
    description: createTaskForm.description,
    createTime: new Date().toLocaleString('zh-CN'),
    interactionRecords: [
      { time: new Date().toLocaleString('zh-CN'), action: '任务创建', reason: '' }
    ]
  }
  tasks.value.push(newTask)
  createTaskDialog.value = false
  ElMessage.success('任务创建成功')
}

const assignTask = (task) => {
  task.status = 'inProgress'
  task.interactionRecords.push({
    time: new Date().toLocaleString('zh-CN'),
    action: `任务指派给${task.assigneeName}`,
    reason: ''
  })
  ElMessage.success('任务已指派')
}

const updateProgress = (task) => {
  editingTask.value = task
  progressForm.progress = task.progress
  progressForm.remark = ''
  updateProgressDialog.value = true
}

const confirmUpdateProgress = () => {
  if (editingTask.value) {
    editingTask.value.progress = progressForm.progress
    editingTask.value.interactionRecords.push({
      time: new Date().toLocaleString('zh-CN'),
      action: `进度更新为${progressForm.progress}%`,
      reason: progressForm.remark || ''
    })
  }
  updateProgressDialog.value = false
  ElMessage.success('进度更新成功')
}

const submitTask = (task) => {
  task.status = 'pendingReview'
  task.interactionRecords.push({
    time: new Date().toLocaleString('zh-CN'),
    action: '提交验收',
    reason: ''
  })
  ElMessage.success('已提交验收')
}

const approveTask = (task) => {
  task.status = 'completed'
  task.progress = 100
  task.interactionRecords.push({
    time: new Date().toLocaleString('zh-CN'),
    action: '验收通过',
    reason: ''
  })
  ElMessage.success('验收通过')
}

const rejectTask = (task) => {
  rejectingTask.value = task
  rejectForm.reason = ''
  rejectDialog.value = true
}

const confirmReject = () => {
  if (!rejectForm.reason) {
    ElMessage.error('请输入驳回理由')
    return
  }
  if (rejectingTask.value) {
    rejectingTask.value.status = 'rejected'
    rejectingTask.value.interactionRecords.push({
      time: new Date().toLocaleString('zh-CN'),
      action: '任务驳回',
      reason: rejectForm.reason
    })
  }
  rejectDialog.value = false
  ElMessage.success('已驳回任务')
}

const viewTask = (task) => {
  Object.assign(viewingTask, task)
  viewTaskDialog.value = true
}

const deleteTask = (task) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index > -1) {
    tasks.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}
</script>

<style scoped>
.task-management {
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
  flex-wrap: wrap;
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

.task-table {
  width: 100%;
}

.priority-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.priority-tag.urgent {
  background-color: #fef0f0;
  color: #dc2626;
}

.priority-tag.high {
  background-color: #fff7ed;
  color: #ea580c;
}

.priority-tag.normal {
  background-color: #f0fdf4;
  color: #16a34a;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.pending {
  background-color: #f0f9ff;
  color: #0284c7;
}

.status-tag.inProgress {
  background-color: #fef3c7;
  color: #d97706;
}

.status-tag.pendingReview {
  background-color: #eef2ff;
  color: #4f46e5;
}

.status-tag.completed {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-tag.rejected {
  background-color: #fee2e2;
  color: #dc2626;
}

.status-tag.timeout {
  background-color: #fef2f2;
  color: #dc2626;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #666;
  width: 40px;
}

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-detail {
  padding: 10px;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  gap: 20px;
}

.detail-label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.detail-value {
  flex: 1;
}

.interaction-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.interaction-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: #f9fafb;
  margin-bottom: 8px;
  border-radius: 4px;
}

.record-time {
  color: #999;
  font-size: 12px;
}

.record-action {
  color: #333;
}

.record-reason {
  color: #666;
  font-style: italic;
}

.timeout {
  color: #dc2626;
  font-weight: bold;
}
</style>