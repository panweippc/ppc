<template>
  <div class="change-management">
    <div class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="党员">
          <div class="filter-member-selector" @click="showFilterMemberSelector = true">
            <input 
              type="text" 
              :value="filterForm.member || '全部'" 
              readonly
              class="filter-selector-input"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="变动原因">
          <el-input v-model="filterForm.reason" placeholder="请输入变动原因" style="width: 250px;" />
        </el-form-item>
        
        <el-form-item label="变动日期">
          <el-date-picker
            v-model="filterForm.startDate"
            type="date"
            placeholder="开始日期"
            value-format="YYYY-MM-DD"
            style="width: 120px;"
          />
          <el-date-picker
            v-model="filterForm.endDate"
            type="date"
            placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 120px;"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span>🔍</span>
          </el-button>
          <el-button @click="handleReset">
            <span>C</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="table-header">
      <span class="header-title">党员变动登记列表</span>
      <button class="add-btn" @click="handleAdd">
        <span class="add-icon">+</span> 新增
      </button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <span class="sortable">党员</span>
              <span class="sort-icon">↕</span>
            </th>
            <th>
              <span class="sortable">变动原因</span>
              <span class="sort-icon">↕</span>
            </th>
            <th>
              <span class="sortable">变动日期</span>
              <span class="sort-icon">↕</span>
            </th>
            <th>
              <span class="sortable">变动类型</span>
              <span class="sort-icon">↕</span>
            </th>
            <th>
              <span class="sortable">原党支部</span>
              <span class="sort-icon">↕</span>
            </th>
            <th>
              <span class="sortable">调入党支部</span>
              <span class="sort-icon">↕</span>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.member }}</td>
            <td>{{ item.reason }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.originalBranch }}</td>
            <td>{{ item.targetBranch }}</td>
            <td class="action-buttons">
              <button class="btn btn-view" @click="handleView(item)">查看</button>
              <button class="btn btn-edit" @click="handleEdit(item)">编辑</button>
              <button class="btn btn-delete" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <span class="page-info">共 {{ tableData.length }} 条</span>
        <button class="page-btn" :disabled="currentPage === 1">
          <span>&lt;</span>
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages">
          <span>&gt;</span>
        </button>
      </div>
    </div>
    
    <el-dialog 
      title="新增变动登记" 
      v-model="dialogVisible" 
      width="700px"
      class="form-dialog"
    >
      <div class="form-content">
        <el-form :model="formData" label-width="100px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="*党员">
                <div class="member-selector" @click="showMemberSelector = true">
                  <input 
                    type="text" 
                    v-model="formData.member" 
                    placeholder="请选择" 
                    readonly
                    class="selector-input"
                  />
                  <span class="selector-icon">🔍</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*变动原因">
                <el-input v-model="formData.reason" placeholder="请输入变动原因" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="*变动日期">
                <el-date-picker
                  v-model="formData.date"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*变动类型">
                <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
                  <el-option label="调出" value="调出" />
                  <el-option label="调入" value="调入" />
                  <el-option label="新增" value="新增" />
                  <el-option label="退休" value="退休" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="原党支部">
                <el-input v-model="formData.originalBranch" placeholder="请输入原党支部" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调入党支部">
                <el-input v-model="formData.targetBranch" placeholder="请输入调入党支部" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <el-dialog 
      title="查看详情" 
      v-model="viewDialogVisible" 
      width="600px"
      class="view-dialog"
    >
      <div class="view-content">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">党员</span>
            <span class="value">{{ viewData.member }}</span>
          </div>
          <div class="info-item">
            <span class="label">变动原因</span>
            <span class="value">{{ viewData.reason }}</span>
          </div>
          <div class="info-item">
            <span class="label">变动日期</span>
            <span class="value">{{ viewData.date }}</span>
          </div>
          <div class="info-item">
            <span class="label">变动类型</span>
            <span class="value">{{ viewData.type }}</span>
          </div>
          <div class="info-item">
            <span class="label">原党支部</span>
            <span class="value">{{ viewData.originalBranch }}</span>
          </div>
          <div class="info-item">
            <span class="label">调入党支部</span>
            <span class="value">{{ viewData.targetBranch }}</span>
          </div>
          <div class="info-item" style="grid-column: span 2;">
            <span class="label">备注</span>
            <span class="value">{{ viewData.remark }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleCloseView">关闭</el-button>
      </template>
    </el-dialog>
    
    <el-dialog 
      title="请选择" 
      v-model="showFilterMemberSelector" 
      width="900px"
      class="member-selector-dialog"
      :close-on-click-modal="false"
    >
      <div class="selector-content">
        <div class="selector-filter">
          <el-form :model="selectorFilter" inline>
            <el-form-item label="姓名">
              <el-input v-model="selectorFilter.name" placeholder="请输入姓名" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="入党时间">
              <el-date-picker
                v-model="selectorFilter.joinStartDate"
                type="date"
                placeholder="开始日期"
                value-format="YYYY-MM-DD"
                style="width: 120px;"
              />
              <span class="date-arrow">→</span>
              <el-date-picker
                v-model="selectorFilter.joinEndDate"
                type="date"
                placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 120px;"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSelectorSearch">
                <span>🔍</span>
              </el-button>
              <el-button @click="handleSelectorReset">
                <span>C</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="selector-table-container">
          <table class="selector-table">
            <thead>
              <tr>
                <th>
                  <span class="sortable">所属党组</span>
                  <span class="sort-icon">↕</span>
                </th>
                <th>
                  <span class="sortable">村</span>
                  <span class="sort-icon">↕</span>
                </th>
                <th>
                  <span class="sortable">姓名</span>
                  <span class="sort-icon">↕</span>
                </th>
                <th>
                  <span class="sortable">性别</span>
                  <span class="sort-icon">↕</span>
                </th>
                <th>
                  <span class="sortable">民族</span>
                  <span class="sort-icon">↕</span>
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in memberList" :key="item.id">
                <td>{{ item.branch }}</td>
                <td>{{ item.village }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.gender }}</td>
                <td>{{ item.nation }}</td>
                <td>
                  <button class="select-btn" @click="handleSelectFilterMember(item)">选择</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="selector-pagination">
            <button class="page-btn" :disabled="currentSelectorPage === 1">
              <span>&lt;</span>
            </button>
            <span class="current-page">{{ currentSelectorPage }}</span>
            <button class="page-btn" :disabled="currentSelectorPage === totalSelectorPages">
              <span>&gt;</span>
            </button>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showFilterMemberSelector = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addChangeRecord } from '../store/changeRecords'

const filterForm = ref({
  member: '',
  reason: '',
  startDate: '',
  endDate: ''
})

const currentPage = ref(1)
const totalPages = ref(1)

const tableData = ref([
  { id: 1, member: '王赞', reason: '工作变动', date: '2023-07-09', type: '调出', originalBranch: '塔拉村党支部', targetBranch: '敖包村党支部' },
  { id: 2, member: '张强', reason: '调入', date: '2023-07-05', type: '调入', originalBranch: '敖包村党支部', targetBranch: '塔拉村党支部' }
])

const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('新增变动登记')

const formData = ref({
  member: '',
  reason: '',
  date: '',
  type: '',
  originalBranch: '',
  targetBranch: '',
  remark: ''
})

const viewData = ref({
  member: '',
  reason: '',
  date: '',
  type: '',
  originalBranch: '',
  targetBranch: '',
  remark: ''
})

const showMemberSelector = ref(false)
const showFilterMemberSelector = ref(false)
const selectorType = ref('add')
const selectorFilter = ref({
  name: '',
  joinStartDate: '',
  joinEndDate: ''
})

const currentSelectorPage = ref(1)
const totalSelectorPages = ref(1)

const memberList = ref([
  { id: 1, branch: '塔拉村党支部', village: '塔拉北', name: '王赞', gender: '男', nation: '汉族' },
  { id: 2, branch: '塔拉村党支部', village: '塔拉村', name: '张思思', gender: '男', nation: '汉族' },
  { id: 3, branch: '塔拉村党支部', village: '塔拉村', name: '张强', gender: '男', nation: '汉族' },
  { id: 4, branch: '塔拉村党支部', village: '塔拉村', name: '张强', gender: '男', nation: '汉族' },
  { id: 5, branch: '塔拉村党支部', village: '塔拉村', name: '何花', gender: '女', nation: '汉族' },
  { id: 6, branch: '塔拉村党支部', village: '塔拉北', name: '赵倩', gender: '男', nation: '汉族' },
  { id: 7, branch: '塔拉村党支部', village: '塔拉北', name: '赵倩', gender: '男', nation: '汉族' },
  { id: 8, branch: '塔拉村党支部', village: '塔拉中', name: '王五', gender: '男', nation: '汉族' },
  { id: 9, branch: '塔拉村党支部', village: '塔拉北', name: '李华', gender: '女', nation: '蒙古族' },
  { id: 10, branch: '塔拉村党支部', village: '塔拉北', name: '李华', gender: '女', nation: '蒙古族' },
  { id: 11, branch: '塔拉村党支部', village: '塔拉南', name: '张百万', gender: '男', nation: '汉族' }
])

const handleSearch = () => {
  console.log('搜索:', filterForm.value)
}

const handleSelectorSearch = () => {
  console.log('选择器搜索:', selectorFilter.value)
}

const handleSelectorReset = () => {
  selectorFilter.value = {
    name: '',
    joinStartDate: '',
    joinEndDate: ''
  }
}

const handleSelectMember = (item) => {
  formData.value.member = item.name
  showMemberSelector.value = false
}

const handleSelectFilterMember = (item) => {
  filterForm.value.member = item.name
  showFilterMemberSelector.value = false
}

const handleReset = () => {
  filterForm.value = {
    member: '',
    reason: '',
    startDate: '',
    endDate: ''
  }
}

const resetFormData = () => {
  formData.value = {
    member: '',
    reason: '',
    date: '',
    type: '',
    originalBranch: '',
    targetBranch: '',
    remark: ''
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增变动登记'
  resetFormData()
  dialogVisible.value = true
}

const handleView = (item) => {
  viewData.value = { ...item }
  viewDialogVisible.value = true
}

const handleCloseView = () => {
  viewDialogVisible.value = false
}

const handleEdit = (item) => {
  dialogTitle.value = '编辑变动登记'
  formData.value = { ...item }
  dialogVisible.value = true
}

const handleDelete = (item) => {
  ElMessageBox.confirm(
    '您确定要删除吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    tableData.value = tableData.value.filter(row => row.id !== item.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleCancel = () => {
  dialogVisible.value = false
}

const handleSubmit = () => {
  if (!formData.value.member) {
    ElMessage.warning('请选择党员')
    return
  }
  
  addChangeRecord({
    memberName: formData.value.member,
    reason: formData.value.reason,
    date: formData.value.date ? formData.value.date + ' 16:00:00' : new Date().toISOString().slice(0, 19).replace('T', ' '),
    type: formData.value.type,
    originalBranch: formData.value.originalBranch,
    targetBranch: formData.value.targetBranch,
    remark: formData.value.remark
  })
  
  dialogVisible.value = false
  resetFormData()
  
  tableData.value.unshift({
    id: Date.now(),
    member: formData.value.member,
    reason: formData.value.reason,
    date: formData.value.date,
    type: formData.value.type,
    originalBranch: formData.value.originalBranch,
    targetBranch: formData.value.targetBranch
  })
  
  ElMessage.success('新增成功，变动记录已同步到党员基础信息')
}
</script>

<style scoped>
.change-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
}

.filter-section {
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.date-arrow {
  margin: 0 8px;
  color: #999;
}

.search-btn {
  padding: 8px;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

.table-container {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
}

.sortable {
  margin-right: 5px;
}

.sort-icon {
  font-size: 12px;
  color: #999;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-view,
.btn-edit {
  background-color: #007bff;
  color: #fff;
}

.btn-view:hover,
.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c82333;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  font-weight: bold;
}

.form-content {
  padding: 10px 0;
}

.view-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.info-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.filter-member-selector {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  width: 120px;
  height: 32px;
}

.filter-selector-input {
  flex: 1;
  padding: 0 12px;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}

.member-selector {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.selector-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
}

.selector-icon {
  padding: 8px 12px;
  color: #999;
}

.selector-content {
  padding: 10px;
}

.selector-filter {
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 15px;
}

.selector-table-container {
  max-height: 400px;
  overflow-y: auto;
}

.selector-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.selector-table th,
.selector-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.selector-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
}

.select-btn {
  padding: 4px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.select-btn:hover {
  background-color: #0056b3;
}

.selector-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}
</style>