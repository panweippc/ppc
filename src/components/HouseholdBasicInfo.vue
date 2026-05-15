<template>
  <div class="household-container">
    <div class="main-layout">
      <div class="left-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-content">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索" 
              class="search-input"
            />
            <button class="search-btn">
              <span class="search-icon">🔍</span>
            </button>
          </div>
          <div class="tree-container">
            <div class="tree-item parent" @click="toggleTree('county')">
              <span class="tree-icon">{{ countyExpanded ? '▼' : '▶' }}</span>
              <span>灏明县</span>
            </div>
            <div v-show="countyExpanded" class="tree-children">
              <div 
                v-for="village in villages" 
                :key="village.id" 
                class="tree-item child"
                :class="{ active: selectedVillage === village.id }"
                @click="selectVillage(village.id)"
              >
                {{ village.name }}
              </div>
            </div>
          </div>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <el-icon>{{ sidebarCollapsed ? <ArrowRight /> : <ArrowLeft /> }}</el-icon>
        </button>
      </div>

      <div class="right-content">
        <div class="stats-cards">
          <div class="stat-card">
            <span class="stat-label">户数</span>
            <span class="stat-value">{{ statistics.households }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">人口数</span>
            <span class="stat-value">{{ statistics.population }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">残疾人数</span>
            <span class="stat-value">{{ statistics.disabled }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">劳动力数</span>
            <span class="stat-value">{{ statistics.workforce }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">家庭年收入</span>
            <span class="stat-value">{{ statistics.annualIncome }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">家庭年支出</span>
            <span class="stat-value">{{ statistics.annualExpense }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">人均纯收入</span>
            <span class="stat-value">{{ statistics.perCapitaIncome }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">耕地面积</span>
            <span class="stat-value">{{ statistics.cultivatedArea }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">林地面积</span>
            <span class="stat-value">{{ statistics.forestArea }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">草牧场面积</span>
            <span class="stat-value">{{ statistics.pastureArea }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">车辆数量</span>
            <span class="stat-value">{{ statistics.vehicles }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">现有帮扶干部</span>
            <span class="stat-value">{{ statistics.helpers }}</span>
          </div>
        </div>

        <div class="search-panel">
          <div class="search-header">
            <button class="collapse-btn" @click="toggleSearchPanel">
              <el-icon>{{ searchPanelExpanded ? <ArrowUp /> : <ArrowDown /> }}</el-icon>
            </button>
          </div>
          <div v-show="searchPanelExpanded" class="search-content">
            <div class="search-row">
              <div class="search-item">
                <label class="search-label">户号</label>
                <el-input v-model="searchForm.householdNo" placeholder="请输入户号" class="form-input" />
              </div>
              <div class="search-item">
                <label class="search-label">姓名</label>
                <el-input v-model="searchForm.name" placeholder="请输入姓名" class="form-input" />
              </div>
              <div class="search-item">
                <label class="search-label">身份证号</label>
                <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" class="form-input" />
              </div>
              <div class="search-item">
                <label class="search-label">联系方式</label>
                <el-input v-model="searchForm.phone" placeholder="请输入联系方式" class="form-input" />
              </div>
            </div>
            <div class="search-row">
              <div class="search-item">
                <label class="search-label">是否为重点人群</label>
                <el-select v-model="searchForm.isKeyPerson" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="search-item">
                <label class="search-label">是否低于监测参考人均收入</label>
                <el-select v-model="searchForm.isBelowIncome" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="search-item">
                <label class="search-label">是否低于上年度监测参考人均收入</label>
                <el-select v-model="searchForm.isBelowLastYearIncome" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="search-item">
                <label class="search-label">是否发生突发事件</label>
                <el-select v-model="searchForm.hasEmergency" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
            </div>
          </div>
          <div class="search-row last-row">
            <div class="search-item">
              <label class="search-label">帮扶干部姓名</label>
              <el-input v-model="searchForm.helperName" placeholder="请输入帮扶干部姓名" class="form-input" />
            </div>
            <div class="search-item">
              <label class="search-label">户类型</label>
              <el-select v-model="searchForm.householdType" placeholder="请选择" class="form-select">
                <el-option label="请选择" value="" />
                <el-option label="一般农户" value="general" />
                <el-option label="脱贫户" value="poverty" />
                <el-option label="监测户" value="monitor" />
              </el-select>
            </div>
            <div class="search-actions">
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
              <el-button @click="handleReset">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <div class="table-panel">
          <div class="table-header">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              增加
            </el-button>
          </div>
          <el-table :data="paginatedData" border>
            <el-table-column prop="village" label="行政村" />
            <el-table-column prop="naturalGroup" label="自然组" />
            <el-table-column prop="householdNo" label="户号" />
            <el-table-column label="操作">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="primary" size="small" icon="eye" @click="handleView(scope.row)"></el-button>
                  <el-button type="primary" size="small" icon="edit" @click="handleEdit(scope.row)"></el-button>
                  <el-button type="primary" size="small" @click="handleSubsidy(scope.row)">补贴</el-button>
                  <el-button type="primary" size="small" @click="handleHelp(scope.row)">帮扶</el-button>
                  <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>

        <div class="back-to-top" @click="scrollToTop">
          <el-button type="primary" size="small" round>
            <el-icon><ArrowUp /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="户基本信息" width="80%" class="dialog-container">
      <div class="form-container">
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">行政村</label>
            <el-select v-model="formData.village" placeholder="请选择" class="form-select">
              <el-option v-for="village in villages" :key="village.id" :label="village.name" :value="village.name" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">自然组</label>
            <el-input v-model="formData.naturalGroup" placeholder="请输入自然组" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">户号</label>
            <el-input v-model="formData.householdNo" placeholder="请输入户号" class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">姓名</label>
            <el-input v-model="formData.name" placeholder="请输入姓名" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">身份证号</label>
            <el-input v-model="formData.idCard" placeholder="请输入身份证号" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">联系方式</label>
            <el-input v-model="formData.phone" placeholder="请输入联系方式" class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">是否为重点人群</label>
            <el-select v-model="formData.isKeyPerson" placeholder="请选择" class="form-select">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">是否低于监测参考人均收入</label>
            <el-select v-model="formData.isBelowIncome" placeholder="请选择" class="form-select">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">是否低于上年度监测参考人均收入</label>
            <el-select v-model="formData.isBelowLastYearIncome" placeholder="请选择" class="form-select">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">是否发生突发事件</label>
            <el-select v-model="formData.hasEmergency" placeholder="请选择" class="form-select">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">帮扶干部姓名</label>
            <el-input v-model="formData.helperName" placeholder="请输入帮扶干部姓名" class="form-input" />
          </div>
          <div class="form-item">
            <label class="form-label">户类型</label>
            <el-select v-model="formData.householdType" placeholder="请选择" class="form-select">
              <el-option label="一般农户" value="general" />
              <el-option label="脱贫户" value="poverty" />
              <el-option label="监测户" value="monitor" />
            </el-select>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="户基本信息详情" v-model="viewDialogVisible" width="80%" class="dialog-container">
      <div class="view-container">
        <div class="view-row">
          <span class="view-label">行政村：</span>
          <span class="view-value">{{ viewData.village }}</span>
          <span class="view-label">自然组：</span>
          <span class="view-value">{{ viewData.naturalGroup }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">户号：</span>
          <span class="view-value">{{ viewData.householdNo }}</span>
          <span class="view-label">姓名：</span>
          <span class="view-value">{{ viewData.name }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">身份证号：</span>
          <span class="view-value">{{ viewData.idCard }}</span>
          <span class="view-label">联系方式：</span>
          <span class="view-value">{{ viewData.phone }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">是否为重点人群：</span>
          <span class="view-value">{{ viewData.isKeyPerson === 'yes' ? '是' : '否' }}</span>
          <span class="view-label">是否低于监测参考人均收入：</span>
          <span class="view-value">{{ viewData.isBelowIncome === 'yes' ? '是' : '否' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">是否低于上年度监测参考人均收入：</span>
          <span class="view-value">{{ viewData.isBelowLastYearIncome === 'yes' ? '是' : '否' }}</span>
          <span class="view-label">是否发生突发事件：</span>
          <span class="view-value">{{ viewData.hasEmergency === 'yes' ? '是' : '否' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">帮扶干部姓名：</span>
          <span class="view-value">{{ viewData.helperName }}</span>
          <span class="view-label">户类型：</span>
          <span class="view-value">{{ getHouseholdTypeName(viewData.householdType) }}</span>
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
import { Search, Refresh, Plus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const searchKeyword = ref('')
const countyExpanded = ref(true)
const selectedVillage = ref(null)
const searchPanelExpanded = ref(true)
const sidebarCollapsed = ref(false)

const villages = ref([
  { id: 1, name: '塔拉村' },
  { id: 2, name: '城东村' },
  { id: 3, name: '光明新村' }
])

const statistics = ref({
  households: 156,
  population: 589,
  disabled: 23,
  workforce: 321,
  annualIncome: '285.6万',
  annualExpense: '168.3万',
  perCapitaIncome: '4849元',
  cultivatedArea: '2345亩',
  forestArea: '1890亩',
  pastureArea: '3560亩',
  vehicles: 89,
  helpers: 45
})

const searchForm = reactive({
  householdNo: '',
  name: '',
  idCard: '',
  phone: '',
  isKeyPerson: '',
  isBelowIncome: '',
  isBelowLastYearIncome: '',
  hasEmergency: '',
  helperName: '',
  householdType: ''
})

const tableData = ref([
  { id: 1, village: '塔拉村', naturalGroup: '塔拉村', householdNo: '68678' },
  { id: 2, village: '城东村', naturalGroup: '城东村二组', householdNo: '345536' },
  { id: 3, village: '城东村', naturalGroup: '城东村二组', householdNo: '345536' },
  { id: 4, village: '城东村', naturalGroup: '城东村一组', householdNo: '01' },
  { id: 5, village: '塔拉村', naturalGroup: '塔拉南', householdNo: 'S3371131' },
  { id: 6, village: '光明新村', naturalGroup: '光明新村三组', householdNo: '23420010' },
  { id: 7, village: '光明新村', naturalGroup: '光明新村一组', householdNo: '231312009' },
  { id: 8, village: '光明新村', naturalGroup: '光明新村三组', householdNo: '2342001' }
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
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const formData = reactive({
  village: '',
  naturalGroup: '',
  householdNo: '',
  name: '',
  idCard: '',
  phone: '',
  isKeyPerson: '',
  isBelowIncome: '',
  isBelowLastYearIncome: '',
  hasEmergency: '',
  helperName: '',
  householdType: ''
})

const viewData = reactive({
  village: '',
  naturalGroup: '',
  householdNo: '',
  name: '',
  idCard: '',
  phone: '',
  isKeyPerson: '',
  isBelowIncome: '',
  isBelowLastYearIncome: '',
  hasEmergency: '',
  helperName: '',
  householdType: ''
})

const toggleTree = (node) => {
  if (node === 'county') {
    countyExpanded.value = !countyExpanded.value
  }
}

const toggleSearchPanel = () => {
  searchPanelExpanded.value = !searchPanelExpanded.value
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const selectVillage = (villageId) => {
  selectedVillage.value = villageId
}

const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const handleReset = () => {
  searchForm.householdNo = ''
  searchForm.name = ''
  searchForm.idCard = ''
  searchForm.phone = ''
  searchForm.isKeyPerson = ''
  searchForm.isBelowIncome = ''
  searchForm.isBelowLastYearIncome = ''
  searchForm.hasEmergency = ''
  searchForm.helperName = ''
  searchForm.householdType = ''
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

const handleSubsidy = (row) => {
  ElMessage.info(`为 ${row.householdNo} 申请补贴`)
}

const handleHelp = (row) => {
  ElMessage.info(`为 ${row.householdNo} 安排帮扶`)
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

const resetFormData = () => {
  formData.village = ''
  formData.naturalGroup = ''
  formData.householdNo = ''
  formData.name = ''
  formData.idCard = ''
  formData.phone = ''
  formData.isKeyPerson = ''
  formData.isBelowIncome = ''
  formData.isBelowLastYearIncome = ''
  formData.hasEmergency = ''
  formData.helperName = ''
  formData.householdType = ''
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getHouseholdTypeName = (type) => {
  const types = {
    'general': '一般农户',
    'poverty': '脱贫户',
    'monitor': '监测户'
  }
  return types[type] || type
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
.household-container {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.main-layout {
  display: flex;
  width: 100%;
}

.left-sidebar {
  width: 220px;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: relative;
  transition: width 0.3s ease;
}

.left-sidebar.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
  border-right: none;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 10;
}

.sidebar-toggle:hover {
  background-color: #f5f7fa;
}

.search-box {
  display: flex;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  font-size: 13px;
}

.search-btn {
  padding: 0 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
}

.tree-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
}

.tree-item:hover {
  background-color: #f5f7fa;
}

.tree-item.active {
  background-color: #e8f4fd;
  color: #1989fa;
}

.tree-item.parent {
  font-weight: 500;
  color: #333;
}

.tree-icon {
  margin-right: 6px;
  font-size: 10px;
}

.tree-children {
  padding-left: 16px;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.search-panel {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.search-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.collapse-btn {
  background: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.collapse-btn:hover {
  background-color: #f5f7fa;
}

.search-content {
  padding: 16px;
}

.last-row {
  padding: 0 16px 16px;
  margin-bottom: 0;
}

.search-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label {
  width: 140px;
  text-align: right;
  font-size: 13px;
  color: #666;
}

.form-input,
.form-select {
  width: 180px;
}

.search-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.table-panel {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.table-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
}

.table-panel :deep(.el-table) {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-buttons :deep(.el-button) {
  padding: 4px 8px;
  font-size: 12px;
}

.pagination-wrapper {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: center;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}

.dialog-container :deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
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

.form-label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.view-container {
  padding: 10px;
}

.view-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.view-label {
  width: 180px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.view-value {
  flex: 1;
  margin-right: 20px;
}
</style>