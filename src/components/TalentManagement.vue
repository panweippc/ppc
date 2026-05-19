<template>
  <div class="talent-management">
    <div class="search-section">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">归属村组</label>
          <el-select v-model="searchForm.village" placeholder="请选择" class="form-select">
            <el-option label="请选择" value="" />
            <el-option label="井沟村" value="井沟村" />
            <el-option label="光明新村" value="光明新村" />
            <el-option label="天野村" value="天野村" />
            <el-option label="北山村" value="北山村" />
            <el-option label="塔拉村" value="塔拉村" />
            <el-option label="敖包村" value="敖包村" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">姓名</label>
          <el-input v-model="searchForm.name" placeholder="请输入姓名" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">性别</label>
          <el-select v-model="searchForm.gender" placeholder="请选择" class="form-select">
            <el-option label="请选择" value="" />
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
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
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">职业技能</label>
          <el-input v-model="searchForm.skill" placeholder="请输入职业技能" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">技能证书</label>
          <el-input v-model="searchForm.certificate" placeholder="请输入技能证书" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">工作地点</label>
          <el-input v-model="searchForm.workPlace" placeholder="请输入工作地点" class="form-input" />
        </div>
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="filteredTalents" border class="talent-table">
        <el-table-column prop="village" label="归属村组" sortable />
        <el-table-column prop="name" label="姓名" sortable />
        <el-table-column prop="nation" label="民族" sortable />
        <el-table-column prop="gender" label="性别" sortable />
        <el-table-column prop="politicalStatus" label="政治面貌" sortable />
        <el-table-column prop="idCard" label="身份证号" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="openViewDialog(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editTalent(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteTalent(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredTalents.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="数据信息" v-model="addDialog" width="700px" class="data-dialog">
      <div class="form-content">
        <div class="form-row">
          <el-form-item label="*归属村组" class="form-item">
            <el-select v-model="addForm.village" placeholder="请选择" class="form-control">
              <el-option label="井沟村" value="井沟村" />
              <el-option label="光明新村" value="光明新村" />
              <el-option label="天野村" value="天野村" />
              <el-option label="北山村" value="北山村" />
              <el-option label="塔拉村" value="塔拉村" />
              <el-option label="敖包村" value="敖包村" />
            </el-select>
          </el-form-item>
          <el-form-item label="*姓名" class="form-item">
            <el-input v-model="addForm.name" placeholder="请输入姓名" class="form-control" />
          </el-form-item>
          <el-form-item label="*民族" class="form-item">
            <el-select v-model="addForm.nation" placeholder="请选择" class="form-control">
              <el-option label="汉族" value="汉族" />
              <el-option label="蒙古族" value="蒙古族" />
              <el-option label="回族" value="回族" />
              <el-option label="藏族" value="藏族" />
              <el-option label="维吾尔族" value="维吾尔族" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*性别" class="form-item">
            <el-select v-model="addForm.gender" placeholder="请选择" class="form-control">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="*政治面貌" class="form-item">
            <el-select v-model="addForm.politicalStatus" placeholder="请选择" class="form-control">
              <el-option label="群众" value="群众" />
              <el-option label="中共党员" value="中共党员" />
              <el-option label="中共预备党员" value="中共预备党员" />
              <el-option label="共青团员" value="共青团员" />
            </el-select>
          </el-form-item>
          <el-form-item label="*身份证号" class="form-item">
            <el-input v-model="addForm.idCard" placeholder="请输入身份证号" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="联系方式" class="form-item">
            <el-input v-model="addForm.contact" placeholder="请输入联系方式" class="form-control" />
          </el-form-item>
          <el-form-item label="健康状况" class="form-item">
            <el-select v-model="addForm.health" placeholder="请选择" class="form-control">
              <el-option label="健康" value="健康" />
              <el-option label="良好" value="良好" />
              <el-option label="一般" value="一般" />
              <el-option label="较差" value="较差" />
            </el-select>
          </el-form-item>
          <el-form-item label="职业技能" class="form-item">
            <el-input v-model="addForm.skill" placeholder="请输入职业技能" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="技能证书" class="form-item">
            <el-input v-model="addForm.certificate" placeholder="请输入技能证书" class="form-control" />
          </el-form-item>
          <el-form-item label="文化程度" class="form-item">
            <el-select v-model="addForm.education" placeholder="请选择" class="form-control">
              <el-option label="小学" value="小学" />
              <el-option label="初中" value="初中" />
              <el-option label="高中" value="高中" />
              <el-option label="大专" value="大专" />
              <el-option label="本科及以上" value="本科及以上" />
            </el-select>
          </el-form-item>
          <el-form-item label="工作地点" class="form-item">
            <el-input v-model="addForm.workPlace" placeholder="请输入工作地点" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="加入时间" class="form-item">
            <el-date-picker
              v-model="addForm.joinDate"
              type="date"
              placeholder="请选择日期"
              class="form-control"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="照片" class="form-item">
            <div class="photo-upload">
              <el-button type="primary" size="small">上传</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <template #footer>
        <el-button @click="addDialog = false">关闭</el-button>
        <el-button type="primary" @click="confirmAdd">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="数据信息" v-model="viewDialog" width="700px" class="data-dialog">
      <div class="view-content">
        <table class="view-table">
          <tr>
            <td class="label-cell">归属村组</td>
            <td class="value-cell">{{ viewTalentData.village }}</td>
            <td class="label-cell">姓名</td>
            <td class="value-cell">{{ viewTalentData.name }}</td>
            <td class="label-cell">民族</td>
            <td class="value-cell">{{ viewTalentData.nation }}</td>
          </tr>
          <tr>
            <td class="label-cell">性别</td>
            <td class="value-cell">{{ viewTalentData.gender }}</td>
            <td class="label-cell">政治面貌</td>
            <td class="value-cell">{{ viewTalentData.politicalStatus }}</td>
            <td class="label-cell">身份证号</td>
            <td class="value-cell">{{ viewTalentData.idCard }}</td>
          </tr>
          <tr>
            <td class="label-cell">联系方式</td>
            <td class="value-cell">{{ viewTalentData.contact }}</td>
            <td class="label-cell">健康状况</td>
            <td class="value-cell">{{ viewTalentData.health }}</td>
            <td class="label-cell">职业技能</td>
            <td class="value-cell">{{ viewTalentData.skill }}</td>
          </tr>
          <tr>
            <td class="label-cell">技能证书</td>
            <td class="value-cell">{{ viewTalentData.certificate }}</td>
            <td class="label-cell">文化程度</td>
            <td class="value-cell">{{ viewTalentData.education }}</td>
            <td class="label-cell">工作地点</td>
            <td class="value-cell">{{ viewTalentData.workPlace }}</td>
          </tr>
          <tr>
            <td class="label-cell">加入时间</td>
            <td class="value-cell" colspan="2">{{ viewTalentData.joinDate }}</td>
            <td class="label-cell">照片</td>
            <td class="value-cell" colspan="2">
              <div class="photo-preview">
                <img v-if="viewTalentData.photo" :src="viewTalentData.photo" alt="照片" />
                <div v-else class="no-photo">暂无照片</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <template #footer>
        <el-button @click="viewDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  village: '',
  name: '',
  gender: '',
  skill: '',
  certificate: '',
  workPlace: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const talents = ref([
  { id: 1, village: '井沟村', name: '李振学', nation: '蒙古族', gender: '男', politicalStatus: '群众', idCard: '150401199005135716', contact: '19934786521', health: '健康', skill: '电子商务师', certificate: '五级/初级工职业资格资格证书', education: '本科及以上', workPlace: '', joinDate: '2023-11-28' },
  { id: 2, village: '井沟村', name: '赵晴楠', nation: '汉族', gender: '女', politicalStatus: '群众', idCard: '150401199606150002', contact: '', health: '', skill: '', certificate: '', education: '', workPlace: '', joinDate: '' },
  { id: 3, village: '北山村', name: '李成业', nation: '汉族', gender: '男', politicalStatus: '群众', idCard: '150401199606150003', contact: '', health: '', skill: '', certificate: '', education: '', workPlace: '', joinDate: '' },
  { id: 4, village: '光明新村', name: '张建国', nation: '汉族', gender: '女', politicalStatus: '中共预备党员', idCard: '1', contact: '', health: '', skill: '', certificate: '', education: '', workPlace: '', joinDate: '' },
  { id: 5, village: '光明新村', name: '王芳', nation: '汉族', gender: '女', politicalStatus: '中共预备党员', idCard: '1', contact: '', health: '', skill: '', certificate: '', education: '', workPlace: '', joinDate: '' },
  { id: 6, village: '光明新村', name: '李明', nation: '汉族', gender: '男', politicalStatus: '中共党员', idCard: '1', contact: '', health: '', skill: '', certificate: '', education: '', workPlace: '', joinDate: '' },
  { id: 7, village: '天野村', name: '江琴', nation: '汉族', gender: '女', politicalStatus: '群众', idCard: '143215197808200004', contact: '', health: '', skill: '', certificate: '', education: '', workPlace: '', joinDate: '' }
])

const addDialog = ref(false)
const addForm = reactive({
  village: '',
  name: '',
  nation: '',
  gender: '',
  politicalStatus: '',
  idCard: '',
  contact: '',
  health: '',
  skill: '',
  certificate: '',
  education: '',
  workPlace: '',
  joinDate: ''
})

const viewDialog = ref(false)
const viewTalentData = reactive({
  village: '',
  name: '',
  nation: '',
  gender: '',
  politicalStatus: '',
  idCard: '',
  contact: '',
  health: '',
  skill: '',
  certificate: '',
  education: '',
  workPlace: '',
  joinDate: '',
  photo: ''
})

const filteredTalents = computed(() => {
  return talents.value.filter(talent => {
    if (searchForm.village && talent.village !== searchForm.village) return false
    if (searchForm.name && !talent.name.includes(searchForm.name)) return false
    if (searchForm.gender && talent.gender !== searchForm.gender) return false
    if (searchForm.skill && !talent.skill.includes(searchForm.skill)) return false
    if (searchForm.certificate && !talent.certificate.includes(searchForm.certificate)) return false
    if (searchForm.workPlace && !talent.workPlace.includes(searchForm.workPlace)) return false
    return true
  })
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const openAddDialog = () => {
  Object.keys(addForm).forEach(key => {
    addForm[key] = ''
  })
  addDialog.value = true
}

const confirmAdd = () => {
  if (!addForm.village) {
    ElMessage.error('请选择归属村组')
    return
  }
  if (!addForm.name) {
    ElMessage.error('请输入姓名')
    return
  }
  if (!addForm.nation) {
    ElMessage.error('请选择民族')
    return
  }
  if (!addForm.gender) {
    ElMessage.error('请选择性别')
    return
  }
  if (!addForm.politicalStatus) {
    ElMessage.error('请选择政治面貌')
    return
  }
  if (!addForm.idCard) {
    ElMessage.error('请输入身份证号')
    return
  }

  talents.value.push({
    id: Date.now(),
    ...addForm
  })
  addDialog.value = false
  ElMessage.success('添加成功')
}

const openViewDialog = (talent) => {
  Object.keys(viewTalentData).forEach(key => {
    viewTalentData[key] = talent[key] || ''
  })
  viewDialog.value = true
}

const editTalent = (talent) => {
  ElMessage.info(`编辑人才: ${talent.name}`)
}

const deleteTalent = (talent) => {
  const index = talents.value.findIndex(t => t.id === talent.id)
  if (index > -1) {
    talents.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}
</script>

<style scoped>
.talent-management {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.search-section {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 15px;
}

.search-row:last-child {
  margin-bottom: 0;
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

.form-input {
  width: 200px;
}

.form-select {
  width: 200px;
}

.search-actions {
  display: flex;
  gap: 10px;
}

.search-actions .el-button {
  width: 40px;
  padding: 0;
}

.table-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.talent-table {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.data-dialog {
  border-radius: 4px;
}

.form-content {
  padding: 10px 0;
}

.form-row {
  display: flex;
  gap: 25px;
  margin-bottom: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-size: 14px;
  color: #666;
}

.form-item label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.form-item label:not([class*="required"])::before {
  content: '';
  margin-right: 0;
}

.form-control {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #409eff;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-content {
  padding: 10px 0;
}

.view-table {
  width: 100%;
  border-collapse: collapse;
}

.view-table td {
  border: 1px solid #dcdfe6;
  padding: 12px 15px;
}

.label-cell {
  background: #f5f7fa;
  font-weight: 500;
  color: #606266;
  width: 15%;
}

.value-cell {
  width: 18.33%;
  color: #303133;
}

.photo-preview {
  width: 120px;
  height: 150px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  color: #909399;
  font-size: 14px;
}
</style>