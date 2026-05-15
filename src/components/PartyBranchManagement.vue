<template>
  <div class="branch-management">
    <div class="left-panel" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-content">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <span class="search-icon">C</span>
          </button>
        </div>
        <div class="branch-tree">
          <div 
            v-for="branch in branchList" 
            :key="branch.id" 
            class="tree-item"
            :class="{ active: selectedBranch?.id === branch.id }"
            @click="selectBranch(branch)"
          >
            {{ branch.name }}
          </div>
        </div>
      </div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <el-icon v-if="sidebarCollapsed"><ArrowRight /></el-icon>
        <el-icon v-else><ArrowLeft /></el-icon>
      </button>
    </div>
    
    <div class="right-panel">
      <div class="panel-header">
        <span class="panel-title">{{ selectedBranch?.name || '党支部信息管理' }}</span>
        <button class="add-btn" @click="handleAdd">
          <span class="add-icon">+</span> 新增
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>归属区划</th>
              <th>党支部名称</th>
              <th>书记</th>
              <th>副书记</th>
              <th>委员</th>
              <th>成立时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td>{{ item.district }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.secretary }}</td>
              <td>{{ item.viceSecretary }}</td>
              <td>{{ item.committeeMembers }}</td>
              <td>{{ item.establishmentDate }}</td>
              <td class="action-buttons">
                <button class="btn btn-view" @click="handleView(item)">查看</button>
                <button class="btn btn-edit" @click="handleEdit(item)">编辑</button>
                <button class="btn btn-add-child" @click="handleAddChild(item)">添加子级</button>
                <button class="btn btn-delete" @click="handleDelete(item)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="horizontal-scroll-bar">
          <div class="scroll-track">
            <div class="scroll-thumb"></div>
          </div>
        </div>
        
        <div class="pagination" v-if="total > 0">
          <button 
            class="page-btn" 
            :disabled="currentPage <= 1" 
            @click="prevPage"
          >
            <
          </button>
          <span class="page-number">{{ currentPage }}</span>
          <button 
            class="page-btn" 
            :disabled="currentPage >= totalPages" 
            @click="nextPage"
          >
            >
          </button>
        </div>
        
        <div class="empty-state" v-else>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="900px"
      class="form-dialog"
    >
      <div class="form-content">
        <div class="form-section">
          <div class="section-title">数据信息</div>
          <el-form :model="formData" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="*归属区划">
                  <el-select v-model="formData.district" placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="district in districtOptions"
                      :key="district"
                      :label="district"
                      :value="district"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="*党支部名称">
                  <el-input v-model="formData.name" placeholder="请输入党支部名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="*书记">
                  <el-input v-model="formData.secretary" placeholder="请输入书记" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="*副书记">
                  <el-input v-model="formData.viceSecretary" placeholder="请输入副书记" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="*委员">
                  <el-input v-model="formData.committeeMembers" placeholder="请输入委员" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="*成立时间">
                  <el-date-picker
                    v-model="formData.establishmentDate"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%;"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    
    <el-dialog 
      title="数据信息" 
      v-model="viewDialogVisible" 
      width="900px"
      class="view-dialog"
    >
      <div class="view-content">
        <div class="info-table">
          <table>
            <tbody>
              <tr>
                <td class="label">归属区划</td>
                <td class="value">{{ viewData.district }}</td>
                <td class="label">党支部名称</td>
                <td class="value">{{ viewData.name }}</td>
                <td class="label">书记</td>
                <td class="value">{{ viewData.secretary }}</td>
              </tr>
              <tr>
                <td class="label">副书记</td>
                <td class="value">{{ viewData.viceSecretary }}</td>
                <td class="label">委员</td>
                <td class="value">{{ viewData.committeeMembers }}</td>
                <td class="label">成立时间</td>
                <td class="value">{{ viewData.establishmentDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="history-section">
          <div class="section-divider">历任届成员</div>
          <table class="history-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>职位/岗位</th>
                <th>任职时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in historyMembers" :key="index">
                <td>{{ member.name }}</td>
                <td>{{ member.position }}</td>
                <td>{{ member.term }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleCloseView">关闭</el-button>
      </template>
    </el-dialog>

    <div class="back-to-top" @click="scrollToTop">
      <el-button type="primary" size="small" round>
        <el-icon><ArrowUp /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { villageOptions } from '../store/organization'
import { ArrowUp, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const selectedBranch = ref(null)
const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('新增党支部')
const currentPage = ref(1)
const pageSize = ref(10)

const branchList = ref([
  { id: 1, name: '塔拉村党支部' },
  { id: 2, name: '红旗村党支部' },
  { id: 3, name: '红星村党支部' },
  { id: 4, name: '前进村党支部' }
])

const districtOptions = [
  '城东村',
  '大平方村',
  '光明新村',
  '光明新村二组',
  '井沟村',
  '塔拉村',
  '红旗村',
  '红星村',
  '前进村'
]

const tableData = ref([
  { 
    id: 1, 
    district: '塔拉村', 
    name: '塔拉村党支部', 
    secretary: '张塔拉',
    viceSecretary: '李强',
    committeeMembers: '向佐',
    establishmentDate: '2023-07-09'
  },
  { 
    id: 2, 
    district: '红旗村', 
    name: '红旗村党支部', 
    secretary: '王红旗',
    viceSecretary: '赵刚',
    committeeMembers: '孙丽',
    establishmentDate: '2022-03-15'
  }
])

const formData = ref({
  district: '',
  name: '',
  secretary: '',
  viceSecretary: '',
  committeeMembers: '',
  establishmentDate: ''
})

const viewData = ref({
  district: '',
  name: '',
  secretary: '',
  viceSecretary: '',
  committeeMembers: '',
  establishmentDate: ''
})

const historyMembers = ref([
  { name: '李华', position: '委员', term: '2023-10-10 - 2024-11-24' },
  { name: '李华', position: '委员', term: '2023-10-10 - 2024-11-24' },
  { name: '赵倩', position: '委员', term: '2023-07-11 - 2024-08-30' },
  { name: '何花', position: '委员', term: '2022-10-20 - 2024-11-22' }
])

const total = computed(() => tableData.value.length)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
}

const selectBranch = (branch) => {
  selectedBranch.value = branch
}

const resetFormData = () => {
  formData.value = {
    district: '',
    name: '',
    secretary: '',
    viceSecretary: '',
    committeeMembers: '',
    establishmentDate: ''
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增党支部'
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
  dialogTitle.value = '编辑党支部'
  formData.value = { ...item }
  dialogVisible.value = true
}

const handleAddChild = (item) => {
  dialogTitle.value = '添加子级党支部'
  resetFormData()
  formData.value.district = item.district
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
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleCancel = () => {
  dialogVisible.value = false
}

const handleSubmit = () => {
  dialogVisible.value = false
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.branch-management {
  display: flex;
  height: 100%;
}

.left-panel {
  width: 240px;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
}

.left-panel.collapsed {
  width: 24px;
}

.left-panel.collapsed .sidebar-content {
  display: none;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.sidebar-toggle:hover {
  background-color: #f5f5f5;
}

.search-box {
  padding: 15px;
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.search-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-btn:hover {
  background-color: #0056b3;
}

.search-icon {
  font-size: 16px;
}

.branch-tree {
  flex: 1;
  padding: 0 10px;
  overflow-y: auto;
}

.tree-item {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 14px;
}

.tree-item:hover {
  background-color: #e9ecef;
}

.tree-item.active {
  background-color: #007bff;
  color: #fff;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-title {
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
.btn-edit,
.btn-add-child {
  background-color: #007bff;
  color: #fff;
}

.btn-view:hover,
.btn-edit:hover,
.btn-add-child:hover {
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
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.page-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  font-size: 16px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.form-dialog :deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.form-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: bold;
}

.form-content {
  padding: 10px 0;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 3px solid #007bff;
}

.view-dialog :deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.view-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: bold;
}

.view-content {
  padding: 10px 0;
}

.info-table {
  margin-bottom: 20px;
}

.info-table table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 12px;
}

.info-table .label {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
  width: 15%;
}

.info-table .value {
  width: 18.33%;
}

.history-section {
  margin-top: 20px;
}

.section-divider {
  font-size: 14px;
  color: #666;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e0e0e0;
  margin-bottom: 15px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.history-table th {
  background-color: #f8f9fa;
  padding: 10px 12px;
  text-align: left;
  font-weight: bold;
  color: #666;
  border-bottom: 1px solid #e0e0e0;
}

.history-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.history-table tbody tr:hover {
  background-color: #fafafa;
}

.table-container {
  position: relative;
  overflow-x: auto;
}

.data-table {
  min-width: 100%;
}

.horizontal-scroll-bar {
  height: 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #e8e8e8;
  position: relative;
}

.scroll-track {
  height: 6px;
  background-color: #e8e8e8;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  transform: translateY(-50%);
}

.scroll-thumb {
  height: 100%;
  background-color: #c0c4cc;
  border-radius: 3px;
  cursor: pointer;
}

.scroll-thumb:hover {
  background-color: #909399;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}
</style>