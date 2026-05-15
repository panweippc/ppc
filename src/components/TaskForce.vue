<template>
  <div class="task-force-container">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">帮扶村组</label>
          <el-input v-model="searchForm.villageGroup" placeholder="请输入帮扶村组" class="search-input" />
        </div>
        <div class="search-item">
          <label class="search-label">帮扶干部姓名</label>
          <el-input v-model="searchForm.name" placeholder="请输入帮扶干部姓名" class="search-input" />
        </div>
        <div class="search-item">
          <label class="search-label">身份证号</label>
          <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" class="search-input" />
        </div>
        <div class="search-item">
          <label class="search-label">分工情况</label>
          <el-select v-model="searchForm.workDivision" placeholder="请选择" class="search-select">
            <el-option label="请选择" value="" />
            <el-option label="工作队" value="taskForce" />
            <el-option label="工作组" value="workGroup" />
            <el-option label="驻村" value="village" />
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
          <label class="search-label">被帮扶户</label>
          <el-input v-model="searchForm.helpedFamily" placeholder="请输入被帮扶户" class="search-input" />
        </div>
        <div class="search-item">
          <label class="search-label">职务/岗位</label>
          <el-select v-model="searchForm.position" placeholder="请选择" class="search-select">
            <el-option label="请选择" value="" />
            <el-option label="队长" value="captain" />
            <el-option label="队员" value="member" />
            <el-option label="联络员" value="liaison" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">任职时间</label>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
      <div class="table-scroll-wrapper">
        <el-table :data="paginatedData" border>
          <el-table-column prop="villageGroup" label="帮扶村组" sortable />
          <el-table-column prop="name" label="姓名" sortable />
          <el-table-column prop="gender" label="性别" sortable />
          <el-table-column prop="ethnicity" label="民族" sortable />
          <el-table-column prop="idCard" label="身份证号" />
          <el-table-column prop="position" label="职务" />
          <el-table-column label="操作">
            <template #default="scope">
              <div class="action-buttons">
                <el-button type="primary" size="small" plain @click="handleView(scope.row)">查看</el-button>
                <el-button type="primary" size="small" plain @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="horizontal-scroll-bar">
          <div class="scroll-track">
            <div class="scroll-thumb"></div>
          </div>
        </div>
      </div>
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
        <div class="form-section">
          <div class="form-row-two">
            <div class="form-item">
              <label class="form-label">驻村工作队类型</label>
              <el-select v-model="formData.taskForceType" placeholder="请选择" class="form-select">
                <el-option label="驻村工作队" value="taskForce" />
                <el-option label="驻村工作组" value="workGroup" />
              </el-select>
            </div>
            <div class="form-item required">
              <label class="form-label">姓名</label>
              <el-input v-model="formData.name" placeholder="请输入姓名" class="form-input" />
            </div>
          </div>
          <div class="form-row-two">
            <div class="form-item">
              <label class="form-label">性别</label>
              <el-select v-model="formData.gender" placeholder="请选择" class="form-select">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </div>
            <div class="form-item">
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
          </div>
          <div class="form-row-two">
            <div class="form-item">
              <label class="form-label">身份证号</label>
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" class="form-input" />
            </div>
            <div class="form-item">
              <label class="form-label">联系方式</label>
              <el-input v-model="formData.phone" placeholder="请输入联系方式" class="form-input" />
            </div>
          </div>
          <div class="form-row-two">
            <div class="form-item">
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
          <div class="form-row-two">
            <div class="form-item">
              <label class="form-label">单位</label>
              <el-input v-model="formData.unit" placeholder="请输入单位名称" class="form-input" />
            </div>
            <div class="form-item">
              <label class="form-label">照片</label>
              <div class="photo-upload-area-small">
                <el-upload
                  action="#"
                  :show-file-list="false"
                  :before-upload="handlePhotoUpload"
                  accept="image/*"
                >
                  <div class="upload-placeholder-small" v-if="!formData.photo">
                    <el-icon class="upload-icon-small"><Plus /></el-icon>
                    <span>上传照片</span>
                  </div>
                </el-upload>
                <div v-if="formData.photo" class="photo-preview-small">
                  <img :src="formData.photo" alt="照片预览" />
                  <div class="photo-delete" @click="handlePhotoDelete">
                    <el-icon class="delete-icon"><Delete /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row-two">
            <div class="form-item full-item">
              <label class="form-label">备注</label>
              <el-input v-model="formData.remark" placeholder="备注" class="form-input" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <span class="section-title">职务</span>
          </div>
          <div v-for="(position, index) in positions" :key="index" class="dynamic-row">
            <div class="form-row-two">
              <div class="form-item required">
                <label class="form-label">职务/岗位</label>
                <el-select v-model="position.position" placeholder="请选择" class="form-select">
                  <el-option label="工作队领导" value="leader" />
                  <el-option label="队员" value="member" />
                  <el-option label="联络员" value="liaison" />
                </el-select>
              </div>
              <div class="form-item required">
                <label class="form-label">分工情况</label>
                <el-select v-model="position.workDivision" placeholder="请选择" class="form-select">
                  <el-option label="分管农业" value="agriculture" />
                  <el-option label="分管工业" value="industry" />
                  <el-option label="分管服务业" value="service" />
                  <el-option label="分管综合" value="general" />
                </el-select>
              </div>
            </div>
            <div class="form-row-two">
              <div class="form-item required">
                <label class="form-label">任职时间</label>
                <el-date-picker
                  v-model="position.dateRange"
                  type="daterange"
                  range-separator="→"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="form-picker"
                />
              </div>
              <div class="form-item action-item-right">
                <el-button v-if="positions.length > 1" type="danger" size="small" @click="removePosition(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          <div class="add-row">
            <el-button type="primary" @click="addPosition">
              <el-icon><Plus /></el-icon>
              添加
            </el-button>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <span class="section-title">帮扶村</span>
          </div>
          <div v-for="(village, index) in villages" :key="index" class="dynamic-row">
            <div class="form-row-two">
              <div class="form-item required">
                <label class="form-label">负责村</label>
                <el-select v-model="village.village" placeholder="请选择" class="form-select">
                  <el-option label="大平方村" value="village1" />
                  <el-option label="光明新村" value="village2" />
                  <el-option label="幸福村" value="village3" />
                </el-select>
              </div>
              <div class="form-item required">
                <label class="form-label">负责状态</label>
                <el-select v-model="village.status" placeholder="请选择" class="form-select">
                  <el-option label="进行中" value="ongoing" />
                  <el-option label="已完成" value="completed" />
                </el-select>
              </div>
            </div>
            <div class="form-row-two">
              <div class="form-item required">
                <label class="form-label">负责时间</label>
                <el-date-picker
                  v-model="village.dateRange"
                  type="daterange"
                  range-separator="→"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="form-picker"
                />
              </div>
              <div class="form-item action-item-right">
                <el-button v-if="villages.length > 1" type="danger" size="small" @click="removeVillage(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          <div class="add-row">
            <el-button type="primary" @click="addVillage">
              <el-icon><Plus /></el-icon>
              添加
            </el-button>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <span class="section-title">帮扶户</span>
          </div>
          <div v-for="(family, index) in families" :key="index" class="dynamic-row">
            <div class="form-row-two">
              <div class="form-item required">
                <label class="form-label">户号</label>
                <div class="search-input-group">
                  <el-select v-model="family.familyNo" placeholder="请选择户号" class="form-select">
                    <el-option label="请选择户号" value="" />
                    <el-option label="H001" value="H001" />
                    <el-option label="H002" value="H002" />
                    <el-option label="H003" value="H003" />
                  </el-select>
                  <el-button type="primary" size="small">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="form-item">
                <label class="form-label">户主姓名</label>
                <el-input v-model="family.headName" placeholder="户主姓名" class="form-input" disabled />
              </div>
            </div>
            <div class="form-row-two">
              <div class="form-item">
                <label class="form-label">户主身份证号</label>
                <el-input v-model="family.headIdCard" placeholder="户主身份证号" class="form-input" disabled />
              </div>
              <div class="form-item required">
                <label class="form-label">负责状态</label>
                <el-select v-model="family.status" placeholder="请选择" class="form-select">
                  <el-option label="进行中" value="ongoing" />
                  <el-option label="已完成" value="completed" />
                </el-select>
              </div>
            </div>
            <div class="form-row-two">
              <div class="form-item required">
                <label class="form-label">负责时间</label>
                <el-date-picker
                  v-model="family.dateRange"
                  type="daterange"
                  range-separator="→"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="form-picker"
                />
              </div>
              <div class="form-item action-item-right">
                <el-button v-if="families.length > 1" type="danger" size="small" @click="removeFamily(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          <div class="add-row">
            <el-button type="primary" @click="addFamily">
              <el-icon><Plus /></el-icon>
              添加
            </el-button>
          </div>
        </div>

        <div class="back-to-top" @click="scrollToTop">
          <el-button type="primary" size="small" round>
            <el-icon><ArrowUp /></el-icon>
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="数据信息" v-model="viewDialogVisible" width="90%" class="dialog-container">
      <div class="view-container">
        <div class="view-section">
          <table class="view-table">
            <tr>
              <td class="view-label">驻村工作队类型</td>
              <td class="view-value">{{ viewData.taskForceType }}</td>
              <td class="view-label">姓名</td>
              <td class="view-value">{{ viewData.name }}</td>
              <td rowspan="6" class="photo-cell">
                <div class="photo-preview">
                  <img v-if="viewData.photo" :src="viewData.photo" alt="照片" />
                  <div v-else class="no-photo">暂无照片</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="view-label">性别</td>
              <td class="view-value">{{ viewData.gender }}</td>
              <td class="view-label">民族</td>
              <td class="view-value">{{ viewData.ethnicity }}</td>
            </tr>
            <tr>
              <td class="view-label">身份证号</td>
              <td class="view-value">{{ viewData.idCard }}</td>
              <td class="view-label">联系方式</td>
              <td class="view-value">{{ viewData.phone }}</td>
            </tr>
            <tr>
              <td class="view-label">政治面貌</td>
              <td class="view-value">{{ viewData.politicalStatus }}</td>
              <td class="view-label">工作状态</td>
              <td class="view-value">{{ viewData.workStatus }}</td>
            </tr>
            <tr>
              <td class="view-label">单位</td>
              <td class="view-value">{{ viewData.unit }}</td>
              <td class="view-label">备注</td>
              <td class="view-value">{{ viewData.remark }}</td>
            </tr>
          </table>
        </div>

        <div class="view-section">
          <div class="section-header">
            <span class="section-title">职务</span>
          </div>
          <div v-for="(position, index) in viewData.positions" :key="index" class="view-row">
            <span class="view-item">职务/岗位: {{ position.position }}</span>
            <span class="view-item">任职时间: {{ position.dateRange[0] }} - {{ position.dateRange[1] }}</span>
            <span class="view-item">分工情况: {{ position.workDivision }}</span>
          </div>
        </div>

        <div class="view-section">
          <div class="section-header">
            <span class="section-title">帮扶村</span>
          </div>
          <div v-for="(village, index) in viewData.villages" :key="index" class="view-row">
            <span class="view-item">负责村: {{ village.village }}</span>
            <span class="view-item">负责时间: {{ village.dateRange[0] }} - {{ village.dateRange[1] }}</span>
            <span class="view-item">负责状态: {{ village.status }}</span>
          </div>
        </div>

        <div class="view-section">
          <div class="section-header">
            <span class="section-title">帮扶户</span>
          </div>
          <div v-for="(family, index) in viewData.families" :key="index" class="view-row">
            <span class="view-item">户号: {{ family.familyNo }}</span>
            <span class="view-item">村: {{ family.village }}</span>
            <span class="view-item">户主姓名: {{ family.headName }}</span>
          </div>
          <div v-for="(family, index) in viewData.families" :key="'detail-' + index" class="view-row">
            <span class="view-item">户主身份证号: {{ family.headIdCard }}</span>
            <span class="view-item">负责时间: {{ family.dateRange[0] }} - {{ family.dateRange[1] }}</span>
            <span class="view-item">负责状态: {{ family.status }}</span>
          </div>
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
import { Search, Refresh, Plus, Delete, ArrowUp } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const searchForm = reactive({
  villageGroup: '',
  name: '',
  idCard: '',
  workDivision: '',
  helpedFamily: '',
  position: '',
  dateRange: []
})

const tableData = ref([
  { id: 1, villageGroup: '大平方村', name: '云鸣', gender: '男', ethnicity: '汉族', idCard: '150423199501251538', contact: '15678947895', position: '工作队' }
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
  taskForceType: '',
  name: '',
  gender: '',
  nation: '',
  idCard: '',
  phone: '',
  politicalStatus: '',
  status: '',
  unit: '',
  remark: '',
  photo: ''
})

const positions = ref([
  { position: '', dateRange: [], workDivision: '' }
])

const villages = ref([
  { village: '', dateRange: [], status: '' }
])

const families = ref([
  { familyNo: '', village: '', headName: '', headIdCard: '', status: '', dateRange: [] }
])

const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const handleReset = () => {
  searchForm.villageGroup = ''
  searchForm.name = ''
  searchForm.idCard = ''
  searchForm.workDivision = ''
  searchForm.helpedFamily = ''
  searchForm.position = ''
  searchForm.dateRange = []
}

const handleAdd = () => {
  isEdit.value = false
  editId.value = null
  resetFormData()
  dialogVisible.value = true
}

const viewData = reactive({
  taskForceType: '',
  name: '',
  gender: '',
  ethnicity: '',
  idCard: '',
  phone: '',
  politicalStatus: '',
  workStatus: '',
  unit: '',
  remark: '',
  photo: '',
  positions: [],
  villages: [],
  families: []
})

const viewDialogVisible = ref(false)

const handleView = (row) => {
  Object.assign(viewData, {
    taskForceType: row.taskForceType || '县级委派',
    name: row.name || '',
    gender: row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : row.gender || '',
    ethnicity: row.ethnicity || '',
    idCard: row.idCard || '',
    phone: row.contact || row.phone || '',
    politicalStatus: '中共党员',
    workStatus: '在职',
    unit: '',
    remark: '',
    photo: '',
    positions: [
      { position: '工作队成员', dateRange: ['2023-10-01', '2024-05-31'], workDivision: '分管农业' },
      { position: '工作队领导', dateRange: ['2026-04-23', '2026-05-19'], workDivision: '分管农业' }
    ],
    villages: [
      { village: '大平方村', dateRange: ['2023-10-15', '2024-05-01'], status: '负责' }
    ],
    families: [
      { familyNo: '232427', village: '光明新村一组', headName: '钱三', headIdCard: '150102202012170988', status: '负责', dateRange: ['2026-05-07', '2026-06-11'] }
    ]
  })
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

const handlePhotoDelete = () => {
  formData.photo = ''
}

const resetFormData = () => {
  formData.taskForceType = ''
  formData.name = ''
  formData.gender = ''
  formData.nation = ''
  formData.idCard = ''
  formData.phone = ''
  formData.politicalStatus = ''
  formData.status = ''
  formData.unit = ''
  formData.remark = ''
  formData.photo = ''
  positions.value = [{ position: '', dateRange: [], workDivision: '' }]
  villages.value = [{ village: '', dateRange: [], status: '' }]
  families.value = [{ familyNo: '', village: '', headName: '', headIdCard: '', status: '', dateRange: [] }]
}

const addPosition = () => {
  positions.value.push({ position: '', dateRange: [], workDivision: '' })
}

const removePosition = (index) => {
  positions.value.splice(index, 1)
}

const addVillage = () => {
  villages.value.push({ village: '', dateRange: [], status: '' })
}

const removeVillage = (index) => {
  villages.value.splice(index, 1)
}

const addFamily = () => {
  families.value.push({ familyNo: '', village: '', headName: '', headIdCard: '', status: '', dateRange: [] })
}

const removeFamily = (index) => {
  families.value.splice(index, 1)
}

const scrollToTop = () => {
  const dialogBody = document.querySelector('.dialog-container .el-dialog__body')
  if (dialogBody) {
    dialogBody.scrollTop = 0
  }
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
.task-force-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.dialog-container :deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
  padding-bottom: 10px;
}

.dialog-container :deep(.el-dialog__footer) {
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 10px 20px;
  margin: 0 -20px -10px;
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
  table-layout: fixed;
}

.table-panel :deep(.el-table__header-wrapper) {
  padding: 0;
}

.table-panel :deep(.el-table__header-row) {
  background-color: #fafafa;
}

.table-panel :deep(.el-table__header-cell) {
  padding: 4px 4px !important;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-panel :deep(.el-table__body-cell) {
  padding: 4px 4px !important;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-panel :deep(.el-table td) {
  padding: 4px 4px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-panel :deep(.el-table th) {
  padding: 4px 4px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-panel :deep(.el-table__column) {
  padding: 0;
}

.table-panel :deep(.el-table__column:nth-child(1)) {
  width: 60px !important;
}

.table-panel :deep(.el-table__column:nth-child(2)) {
  width: 50px !important;
}

.table-panel :deep(.el-table__column:nth-child(3)) {
  width: 35px !important;
}

.table-panel :deep(.el-table__column:nth-child(4)) {
  width: 40px !important;
}

.table-panel :deep(.el-table__column:nth-child(5)) {
  width: 120px !important;
}

.table-panel :deep(.el-table__column:nth-child(6)) {
  width: 50px !important;
}

.table-panel :deep(.el-table__column:nth-child(7)) {
  width: 160px !important;
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
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
}

.table-header :deep(.el-button) {
  padding: 8px 16px;
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

.form-row-two {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row-two .form-item {
  flex: 1;
}

.form-item {
  flex: 1;
}

.form-item.full-item {
  flex: 1 1 100%;
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

.photo-item {
  flex: 0 0 150px;
}

.photo-upload-area {
  width: 150px;
  height: 150px;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
}

.upload-placeholder:hover {
  border-color: #007bff;
  color: #007bff;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.photo-preview-large {
  width: 150px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.photo-preview-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.full-width {
  flex: 1 1 100%;
}

.form-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
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

.dynamic-row {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
}

.action-item {
  flex: 0 0 40px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.action-item-right {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.add-row {
  margin-top: 10px;
  text-align: center;
}

.search-input-group {
  display: flex;
  align-items: center;
}

.search-input-group :deep(.el-select) {
  flex: 1;
  border-radius: 4px 0 0 4px;
}

.search-input-group :deep(.el-button) {
  border-radius: 0 4px 4px 0;
  border-left: none;
}

.delete-icon {
  color: #fff;
  font-size: 14px;
}

.photo-upload-area-small {
  width: 100%;
}

.upload-placeholder-small {
  width: 100%;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  font-size: 12px;
}

.upload-placeholder-small:hover {
  border-color: #007bff;
  color: #007bff;
}

.upload-icon-small {
  font-size: 16px;
  margin-bottom: 4px;
}

.photo-preview-small {
  width: 100%;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.photo-preview-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-to-top {
  position: sticky;
  bottom: 0;
  text-align: center;
  padding: 10px 0;
  margin-top: 10px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.back-to-top :deep(.el-button) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.photo-cell {
  width: 120px;
}

.photo-preview {
  width: 100%;
  height: 150px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-photo {
  color: #999;
  font-size: 12px;
}

.view-row {
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.view-row:last-child {
  margin-bottom: 0;
}

.view-item {
  margin-right: 30px;
  font-size: 14px;
}

.table-scroll-wrapper {
  position: relative;
  overflow-x: auto;
}

.table-scroll-wrapper :deep(.el-table) {
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
</style>