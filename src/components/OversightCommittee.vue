<template>
  <div class="oversight-committee-container">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">村组</label>
          <el-select v-model="searchForm.group" placeholder="请选择">
            <el-option label="请选择" value="" />
            <el-option label="村组1" value="group1" />
            <el-option label="村组2" value="group2" />
            <el-option label="村组3" value="group3" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">姓名</label>
          <el-input v-model="searchForm.name" placeholder="请输入姓名" />
        </div>
        <div class="search-item">
          <label class="search-label">工作状态</label>
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="请选择" value="" />
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
            <el-option label="休假" value="leave" />
          </el-select>
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
          <label class="search-label">身份证号</label>
          <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" />
        </div>
        <div class="search-item">
          <label class="search-label">职务/岗位</label>
          <el-select v-model="searchForm.position" placeholder="请选择">
            <el-option label="请选择" value="" />
            <el-option label="主任" value="director" />
            <el-option label="副主任" value="deputy" />
            <el-option label="委员" value="member" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">任职开始时间</label>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="→"
            start-placeholder="开始"
            end-placeholder="结束"
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
        <el-table-column prop="group" label="村组" sortable />
        <el-table-column prop="name" label="姓名" sortable />
        <el-table-column prop="gender" label="性别" sortable />
        <el-table-column prop="education" label="学历" sortable />
        <el-table-column prop="politicalStatus" label="政治面貌" sortable />
        <el-table-column prop="status" label="工作状态" sortable />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" title="数据信息" width="900px">
      <div class="form-container">
        <div class="form-row">
          <div class="form-item required">
            <label class="form-label">村组</label>
            <el-select v-model="formData.group" placeholder="请选择" class="form-select">
              <el-option label="村组1" value="group1" />
              <el-option label="村组2" value="group2" />
              <el-option label="村组3" value="group3" />
            </el-select>
          </div>
          <div class="form-item required">
            <label class="form-label">姓名</label>
            <el-input v-model="formData.name" placeholder="请输入姓名" class="form-input" />
          </div>
          <div class="form-item required">
            <label class="form-label">性别</label>
            <el-select v-model="formData.gender" placeholder="请选择" class="form-select">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item required">
            <label class="form-label">学历</label>
            <el-select v-model="formData.education" placeholder="请选择" class="form-select">
              <el-option label="小学" value="primary" />
              <el-option label="初中" value="junior" />
              <el-option label="高中" value="senior" />
              <el-option label="大专" value="college" />
              <el-option label="本科" value="bachelor" />
              <el-option label="研究生" value="graduate" />
            </el-select>
          </div>
          <div class="form-item required">
            <label class="form-label">政治面貌</label>
            <el-select v-model="formData.politicalStatus" placeholder="请选择" class="form-select">
              <el-option label="中共党员" value="partyMember" />
              <el-option label="群众" value="mass" />
              <el-option label="共青团员" value="leagueMember" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">工作状态</label>
            <el-select v-model="formData.status" placeholder="请选择" class="form-select">
              <el-option label="在职" value="active" />
              <el-option label="离职" value="inactive" />
              <el-option label="休假" value="leave" />
            </el-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item required">
            <label class="form-label">民族</label>
            <el-select v-model="formData.nation" placeholder="请选择" class="form-select">
              <el-option label="汉族" value="han" />
              <el-option label="蒙古族" value="mongolian" />
              <el-option label="回族" value="hui" />
              <el-option label="藏族" value="tibetan" />
              <el-option label="维吾尔族" value="uyghur" />
              <el-option label="其他" value="other" />
            </el-select>
          </div>
          <div class="form-item required">
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
            <label class="form-label">职务/岗位</label>
            <el-select v-model="formData.position" placeholder="请选择" class="form-select">
              <el-option label="主任" value="director" />
              <el-option label="副主任" value="deputy" />
              <el-option label="委员" value="member" />
            </el-select>
          </div>
          <div class="form-item">
            <label class="form-label">任职开始时间</label>
            <el-date-picker v-model="formData.startDate" type="date" placeholder="请选择日期" class="form-picker" />
          </div>
          <div class="form-item">
            <label class="form-label">任职结束时间</label>
            <el-date-picker v-model="formData.endDate" type="date" placeholder="请选择日期" class="form-picker" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item photo-item">
            <label class="form-label">照片</label>
            <div class="photo-upload">
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="handlePhotoUpload"
                accept="image/*"
              >
                <el-button size="small">上传</el-button>
              </el-upload>
              <div v-if="formData.photo" class="photo-preview">
                <img :src="formData.photo" alt="照片预览" />
                <div class="photo-delete" @click="handlePhotoDelete">
                  <el-icon class="delete-icon"><Delete /></el-icon>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'

const searchForm = reactive({
  group: '',
  name: '',
  status: '',
  idCard: '',
  position: '',
  dateRange: []
})

const tableData = ref([])

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => tableData.value.length)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增监督委成员')
const isEdit = ref(false)
const editId = ref(null)

const formData = reactive({
  group: '',
  name: '',
  gender: '',
  education: '',
  politicalStatus: '',
  idCard: '',
  position: '',
  status: '',
  startDate: '',
  nation: '',
  phone: '',
  endDate: '',
  photo: ''
})

const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const handlePhotoUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.photo = e.target.result
  }
  reader.readAsDataURL(file)
  return false
}

const handlePhotoDelete = () => {
  formData.photo = ''
}

const handleReset = () => {
  searchForm.group = ''
  searchForm.name = ''
  searchForm.status = ''
  searchForm.idCard = ''
  searchForm.position = ''
  searchForm.dateRange = []
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleAdd = () => {
  dialogTitle.value = '新增监督委成员'
  isEdit.value = false
  editId.value = null
  resetFormData()
  dialogVisible.value = true
}

const handleView = (row) => {
  dialogTitle.value = '查看监督委成员'
  isEdit.value = false
  editId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑监督委成员'
  isEdit.value = true
  editId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该监督委成员吗？',
    '提示',
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
  formData.group = ''
  formData.name = ''
  formData.gender = ''
  formData.education = ''
  formData.politicalStatus = ''
  formData.idCard = ''
  formData.position = ''
  formData.status = ''
  formData.startDate = ''
  formData.nation = ''
  formData.phone = ''
  formData.endDate = ''
  formData.photo = ''
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
.oversight-committee-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
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

.photo-item {
  flex: 0 0 auto;
}

.photo-upload {
  display: flex;
  align-items: center;
  gap: 15px;
}

.photo-preview {
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-delete {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.photo-delete:hover {
  background-color: rgba(245, 108, 108, 0.8);
}

.delete-icon {
  color: #fff;
  font-size: 14px;
}

.search-panel {
  background-color: #fafafa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  align-items: center;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-label {
  width: 80px;
  text-align: right;
  font-weight: 500;
  color: #666;
}

.search-item :deep(.el-select),
.search-item :deep(.el-input),
.search-item :deep(.el-date-picker) {
  width: 200px;
}

.table-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
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
</style>