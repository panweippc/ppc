<template>
  <div class="page-container">
    <div class="search-section">
      <div class="search-row">
        <div class="search-item">
          <label>村组</label>
          <select v-model="searchForm.village" class="search-select">
            <option value="">请选择</option>
            <option value="光明新村一组">光明新村一组</option>
            <option value="井沟村">井沟村</option>
            <option value="北山村">北山村</option>
            <option value="塔拉村">塔拉村</option>
            <option value="敖包村">敖包村</option>
          </select>
        </div>
        <div class="search-item">
          <label>姓名</label>
          <input v-model="searchForm.name" type="text" class="search-input" placeholder="请输入姓名" />
        </div>
        <div class="search-item">
          <label>联系方式</label>
          <input v-model="searchForm.phone" type="text" class="search-input" placeholder="请输入联系方式" />
        </div>
        <button class="search-btn" @click="handleSearch"><span>🔍</span></button>
        <button class="reset-btn" @click="handleReset">C</button>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label>职务/岗位</label>
          <select v-model="searchForm.position" class="search-select">
            <option value="">请选择</option>
            <option value="书记">书记</option>
            <option value="副书记">副书记</option>
            <option value="主任">主任</option>
            <option value="副主任">副主任</option>
            <option value="委员">委员</option>
          </select>
        </div>
        <div class="search-item">
          <label>任职时间</label>
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 150px;"
          />
          <span class="date-separator">→</span>
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="结束日期"
            style="width: 150px;"
          />
        </div>
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <button class="add-btn" @click="handleAdd">+ 新增</button>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>村组</th>
            <th>姓名</th>
            <th>性别</th>
            <th>民族</th>
            <th>身份证号</th>
            <th>联系方式</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedMemberList" :key="item.id">
            <td>{{ item.village }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.gender }}</td>
            <td>{{ item.nation }}</td>
            <td>{{ item.idCard }}</td>
            <td>{{ item.phone }}</td>
            <td>
              <button class="view-btn" @click="handleView(item)">查看</button>
              <button class="edit-btn" @click="handleEdit(item)">编辑</button>
              <button class="delete-btn" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
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

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
      <div class="form-container">
        <h3 class="form-section-title">数据信息</h3>
        
        <div class="form-row">
          <div class="form-item">
            <label>*村组</label>
            <el-select v-model="formData.village" placeholder="请选择" class="form-select">
              <el-option
                v-for="group in groupOptions"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </div>
          <div class="form-item">
            <label>*姓名</label>
            <input v-model="formData.name" type="text" class="form-input" placeholder="请输入姓名" />
          </div>
          <div class="form-item photo-item">
            <label>照片</label>
            <div class="photo-upload">
              <label class="upload-box" :class="{ 'has-photo': formData.photo }">
                <input type="file" accept="image/*" class="upload-input" @change="handlePhotoUpload" />
                <div v-if="!formData.photo" class="upload-placeholder">
                  <span class="upload-icon">+</span>
                  <span class="upload-text">上传照片</span>
                </div>
                <img v-else :src="formData.photo" class="upload-preview" />
              </label>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>性别</label>
            <select v-model="formData.gender" class="form-select">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-item">
            <label>民族</label>
            <select v-model="formData.nation" class="form-select">
              <option value="汉族">汉族</option>
              <option value="蒙古族">蒙古族</option>
              <option value="回族">回族</option>
              <option value="藏族">藏族</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>*身份证号</label>
            <input v-model="formData.idCard" type="text" class="form-input" placeholder="请输入身份证号" />
          </div>
          <div class="form-item">
            <label>*联系方式</label>
            <input v-model="formData.phone" type="text" class="form-input" placeholder="请输入联系方式" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>学历</label>
            <select v-model="formData.education" class="form-select">
              <option value="小学">小学</option>
              <option value="初中">初中</option>
              <option value="高中">高中</option>
              <option value="大专">大专</option>
              <option value="本科">本科</option>
            </select>
          </div>
          <div class="form-item">
            <label>政治面貌</label>
            <select v-model="formData.politicalStatus" class="form-select">
              <option value="中共党员">中共党员</option>
              <option value="预备党员">预备党员</option>
              <option value="共青团员">共青团员</option>
              <option value="群众">群众</option>
            </select>
          </div>
          <div class="form-item">
            <label>工作状态</label>
            <select v-model="formData.workStatus" class="form-select">
              <option value="在职">在职</option>
              <option value="离职">离职</option>
              <option value="退休">退休</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>单位</label>
            <input v-model="formData.unit" type="text" class="form-input" placeholder="请输入单位" />
          </div>
          <div class="form-item">
            <label>备注</label>
            <input v-model="formData.remark" type="text" class="form-input" placeholder="请输入备注" />
          </div>
        </div>

        <div class="form-divider"></div>
        <h3 class="form-section-title">职务</h3>
        
        <div class="position-list">
          <div v-for="(position, index) in formData.positions" :key="index" class="position-row">
            <div class="form-item">
              <label>*职务/岗位</label>
              <select v-model="position.job" class="form-select">
                <option value="">请选择</option>
                <option value="书记">书记</option>
                <option value="副书记">副书记</option>
                <option value="主任">主任</option>
                <option value="副主任">副主任</option>
                <option value="委员">委员</option>
              </select>
            </div>
            <div class="form-item">
              <label>*任职时间</label>
              <el-date-picker
                v-model="position.startDate"
                type="date"
                placeholder="开始日期"
                style="width: 120px;"
              />
              <span class="date-separator">→</span>
              <el-date-picker
                v-model="position.endDate"
                type="date"
                placeholder="结束日期"
                style="width: 120px;"
              />
            </div>
            <div class="form-item">
              <label>*分工情况</label>
              <select v-model="position.division" class="form-select">
                <option value="">请选择</option>
                <option value="党建工作">党建工作</option>
                <option value="经济发展">经济发展</option>
                <option value="民生保障">民生保障</option>
                <option value="综合治理">综合治理</option>
                <option value="乡村建设">乡村建设</option>
              </select>
            </div>
            <button v-if="formData.positions.length > 1" class="delete-btn-small" @click="deletePosition(index)">
              <span>🗑️</span>
            </button>
          </div>
        </div>
        <div class="add-position-btn">
          <button class="add-btn" @click="addPosition">+ 添加</button>
        </div>

        <div class="form-divider"></div>
        <h3 class="form-section-title">负责户</h3>
        
        <div class="responsible-list">
          <div v-for="(responsible, index) in formData.responsibleHouseholds" :key="index" class="responsible-row">
            <div class="form-item">
              <label>*户号</label>
              <div class="household-selector">
                <input :value="responsible.householdNo" type="text" class="form-input household-input" placeholder="请选择户号" readonly />
                <button class="search-btn-small" @click="openHouseholdSelector(index)">
                  <span>🔍</span>
                </button>
              </div>
            </div>
            <div class="form-item">
              <label>村</label>
              <input v-model="responsible.village" type="text" class="form-input" readonly />
            </div>
            <div class="form-item">
              <label>户主姓名</label>
              <input v-model="responsible.headName" type="text" class="form-input" readonly />
            </div>
            <div class="form-item">
              <label>户主身份证号</label>
              <input v-model="responsible.headIdCard" type="text" class="form-input" readonly />
            </div>
            <div class="form-item">
              <label>*负责状态</label>
              <select v-model="responsible.status" class="form-select">
                <option value="负责">负责</option>
                <option value="不负责">不负责</option>
              </select>
            </div>
            <div class="form-item">
              <label>*负责时间</label>
              <el-date-picker
                v-model="responsible.startDate"
                type="date"
                placeholder="开始日期"
                style="width: 120px;"
              />
              <span class="date-separator">→</span>
              <el-date-picker
                v-model="responsible.endDate"
                type="date"
                placeholder="结束日期"
                style="width: 120px;"
              />
            </div>
            <button v-if="formData.responsibleHouseholds.length > 1" class="delete-btn-small" @click="deleteResponsible(index)">
              <span>🗑️</span>
            </button>
          </div>
        </div>
        <div class="add-responsible-btn">
          <button class="add-btn" @click="addResponsible">+ 添加</button>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="数据信息" v-model="viewDialogVisible" width="800px">
      <div class="view-container">
        <table class="view-table">
          <tr>
            <td class="view-label-cell">村组</td>
            <td>{{ viewData.village }}</td>
            <td class="view-label-cell">姓名</td>
            <td>{{ viewData.name }}</td>
            <td rowspan="5" class="photo-cell">
              <img v-if="viewData.photo" :src="viewData.photo" class="view-photo" />
              <div v-else class="no-photo">暂无照片</div>
            </td>
          </tr>
          <tr>
            <td class="view-label-cell">性别</td>
            <td>{{ viewData.gender }}</td>
            <td class="view-label-cell">民族</td>
            <td>{{ viewData.nation }}</td>
          </tr>
          <tr>
            <td class="view-label-cell">状态</td>
            <td>{{ viewData.status || '正常' }}</td>
            <td class="view-label-cell">身份证号</td>
            <td>{{ viewData.idCard }}</td>
          </tr>
          <tr>
            <td class="view-label-cell">联系方式</td>
            <td>{{ viewData.phone }}</td>
            <td class="view-label-cell">学历</td>
            <td>{{ viewData.education }}</td>
          </tr>
          <tr>
            <td class="view-label-cell">政治面貌</td>
            <td>{{ viewData.politicalStatus }}</td>
            <td class="view-label-cell">工作状态</td>
            <td>{{ viewData.workStatus }}</td>
          </tr>
          <tr>
            <td class="view-label-cell">单位</td>
            <td>{{ viewData.unit || '-' }}</td>
            <td class="view-label-cell">备注</td>
            <td>{{ viewData.remark || '-' }}</td>
          </tr>
        </table>

        <div class="view-section">
          <h3 class="view-section-title">职务</h3>
          <div v-if="viewData.positions && viewData.positions.length > 0">
            <div v-for="(position, index) in viewData.positions" :key="index" class="position-card">
              <span class="position-item"><strong>职务/岗位：</strong>{{ position.job }}</span>
              <span class="position-item"><strong>任职时间：</strong>{{ position.startDate ? formatDate(position.startDate) : '-' }} - {{ position.endDate ? formatDate(position.endDate) : '-' }}</span>
              <span class="position-item"><strong>分工情况：</strong>{{ position.division || '-' }}</span>
            </div>
          </div>
          <div v-else class="no-data">暂无职务信息</div>
        </div>

        <div class="view-section">
          <h3 class="view-section-title">负责户</h3>
          <div v-if="viewData.responsibleHouseholds && viewData.responsibleHouseholds.length > 0">
            <div v-for="(responsible, index) in viewData.responsibleHouseholds" :key="index" class="responsible-card">
              <div class="responsible-row">
                <span><strong>户号：</strong>{{ responsible.householdNo }}</span>
                <span><strong>村：</strong>{{ responsible.village }}</span>
                <span><strong>户主身份证号：</strong>{{ responsible.headIdCard }}</span>
              </div>
              <div class="responsible-row">
                <span><strong>户主姓名：</strong>{{ responsible.headName }}</span>
                <span><strong>负责状态：</strong>{{ responsible.status }}</span>
                <span><strong>负责时间：</strong>{{ responsible.startDate ? formatDate(responsible.startDate) : '-' }} - {{ responsible.endDate ? formatDate(responsible.endDate) : '-' }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-data">暂无负责户信息</div>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="户选择器" v-model="householdSelectorVisible" width="900px">
      <div class="household-selector-container">
        <div class="household-search-bar">
          <div class="search-item">
            <label>户号:</label>
            <input v-model="householdSearchForm.householdNo" type="text" class="form-input" placeholder="请输入" />
          </div>
          <div class="search-item">
            <label>姓名:</label>
            <input v-model="householdSearchForm.name" type="text" class="form-input" placeholder="请输入" />
          </div>
          <button class="search-btn" @click="searchHouseholds">🔍</button>
          <button class="reset-btn" @click="resetHouseholdSearch">C</button>
        </div>
        
        <table class="household-table">
          <thead>
            <tr>
              <th>村</th>
              <th>村组</th>
              <th>户号</th>
              <th>姓名</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="household in householdList" :key="household.id">
              <td>{{ household.village }}</td>
              <td>{{ household.group }}</td>
              <td>{{ household.householdNo }}</td>
              <td>{{ household.name }}</td>
              <td><button class="select-btn" @click="selectHousehold(household)">选择</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="householdSelectorVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { groupOptions } from '../store/organization'

const searchForm = reactive({
  village: '',
  name: '',
  phone: '',
  position: '',
  startDate: '',
  endDate: ''
})

const memberList = ref([
  { id: 1, village: '光明新村一组', name: '杨迪', gender: '男', nation: '汉族', idCard: '150102201012313453', phone: '18647883456', position: '书记', startDate: '', endDate: '' },
  { id: 2, village: '光明新村一组', name: '杨迪梅', gender: '男', nation: '汉族', idCard: '15010225199012310864', phone: '18647807528', position: '副书记', startDate: '', endDate: '' },
  { id: 3, village: '井沟村', name: '李艳梅', gender: '女', nation: '蒙古族', idCard: '150425199001070864', phone: '17747075298', position: '主任', startDate: '', endDate: '' },
  { id: 4, village: '北山村', name: '陈爱国', gender: '男', nation: '汉族', idCard: '15042519651002087X', phone: '15847057785', position: '副主任', startDate: '', endDate: '' },
  { id: 5, village: '北山村', name: '陈爱国', gender: '男', nation: '汉族', idCard: '15042519651002087X', phone: '13547678945', position: '委员', startDate: '', endDate: '' },
  { id: 6, village: '井沟村', name: '刘文革', gender: '男', nation: '汉族', idCard: '150425198806030857', phone: '13265678946', position: '委员', startDate: '', endDate: '' },
  { id: 7, village: '井沟村', name: '张荣光', gender: '男', nation: '蒙古族', idCard: '250425196909240000', phone: '13456789006', position: '委员', startDate: '', endDate: '' },
  { id: 8, village: '井沟村', name: '胡自强', gender: '男', nation: '蒙古族', idCard: '15042519690208007X', phone: '13456789002', position: '委员', startDate: '', endDate: '' },
  { id: 9, village: '井沟村', name: '胡自强', gender: '男', nation: '汉族', idCard: '15042519820208087X', phone: '17845639002', position: '委员', startDate: '', endDate: '' },
  { id: 10, village: '井沟村', name: '郑艳霞', gender: '男', nation: '汉族', idCard: '150425196206140869', phone: '17896450034', position: '委员', startDate: '', endDate: '' },
  { id: 11, village: '井沟村', name: '陈天风', gender: '男', nation: '汉族', idCard: '150425196012020877', phone: '15609863456', position: '委员', startDate: '', endDate: '' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => memberList.value.length)
const paginatedMemberList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return memberList.value.slice(start, end)
})

const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('新增')

const formData = reactive({
  village: '',
  name: '',
  gender: '男',
  nation: '汉族',
  idCard: '',
  phone: '',
  education: '小学',
  politicalStatus: '中共党员',
  workStatus: '在职',
  unit: '',
  remark: '',
  photo: '',
  positions: [{
    job: '',
    startDate: '',
    endDate: '',
    division: ''
  }],
  responsibleHouseholds: [{
    householdNo: '',
    village: '',
    headName: '',
    headIdCard: '',
    status: '负责',
    startDate: '',
    endDate: ''
  }]
})

const householdSelectorVisible = ref(false)
const selectedResponsibleIndex = ref(0)
const householdSearchForm = reactive({
  householdNo: '',
  name: ''
})

const householdList = ref([
  { id: 1, village: '塔拉村', group: '塔拉村', householdNo: '68678', name: '尽快' },
  { id: 2, village: '塔拉村', group: '塔拉村', householdNo: '68678', name: '尽快' },
  { id: 3, village: '城东村', group: '城东村二组', householdNo: '345536', name: '随便' },
  { id: 4, village: '城东村', group: '城东村一组', householdNo: '01', name: '侯耀' },
  { id: 5, village: '塔拉村', group: '塔拉南', householdNo: 'S3371131', name: '李磊' },
  { id: 6, village: '光明新村', group: '光明新村三组', householdNo: '23420010', name: '人员测试' },
  { id: 7, village: '大平方村', group: '大平方村二组', householdNo: '00020', name: '武艺' },
  { id: 8, village: '大平方村', group: '大平方村一组', householdNo: '00090', name: '南枝' }
])

const viewData = reactive({
  village: '',
  name: '',
  gender: '',
  nation: '',
  idCard: '',
  phone: '',
  education: '',
  politicalStatus: '',
  workStatus: '',
  status: '',
  unit: '',
  remark: '',
  photo: '',
  positions: [],
  responsibleHouseholds: []
})

const editId = ref(null)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增'
  editId.value = null
  formData.village = ''
  formData.name = ''
  formData.gender = '男'
  formData.nation = '汉族'
  formData.idCard = ''
  formData.phone = ''
  formData.education = '小学'
  formData.politicalStatus = '中共党员'
  formData.workStatus = '在职'
  formData.unit = ''
  formData.remark = ''
  formData.positions = [{
    job: '',
    startDate: '',
    endDate: '',
    division: ''
  }]
  dialogVisible.value = true
}

const addPosition = () => {
  formData.positions.push({
    job: '',
    startDate: '',
    endDate: '',
    division: ''
  })
}

const deletePosition = (index) => {
  if (formData.positions.length > 1) {
    formData.positions.splice(index, 1)
  }
}

const addResponsible = () => {
  formData.responsibleHouseholds.push({
    householdNo: '',
    village: '',
    headName: '',
    headIdCard: '',
    status: '负责',
    startDate: '',
    endDate: ''
  })
}

const deleteResponsible = (index) => {
  if (formData.responsibleHouseholds.length > 1) {
    formData.responsibleHouseholds.splice(index, 1)
  }
}

const openHouseholdSelector = (index) => {
  selectedResponsibleIndex.value = index
  householdSelectorVisible.value = true
}

const selectHousehold = (household) => {
  const responsible = formData.responsibleHouseholds[selectedResponsibleIndex.value]
  responsible.householdNo = household.householdNo
  responsible.village = household.village
  responsible.headName = household.name
  responsible.headIdCard = '***'
  householdSelectorVisible.value = false
}

const searchHouseholds = () => {
  ElMessage.info('搜索户功能')
}

const resetHouseholdSearch = () => {
  householdSearchForm.householdNo = ''
  householdSearchForm.name = ''
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.photo = e.target.result
      ElMessage.success('照片上传成功')
    }
    reader.readAsDataURL(file)
  }
}

const handleEdit = (item) => {
  isEdit.value = true
  dialogTitle.value = '编辑'
  editId.value = item.id
  Object.assign(formData, item)
  dialogVisible.value = true
}

const handleView = (item) => {
  viewData.village = item.village || ''
  viewData.name = item.name || ''
  viewData.gender = item.gender || ''
  viewData.nation = item.nation || ''
  viewData.idCard = item.idCard || ''
  viewData.phone = item.phone || ''
  viewData.education = item.education || ''
  viewData.politicalStatus = item.politicalStatus || ''
  viewData.workStatus = item.workStatus || ''
  viewData.status = item.status || '正常'
  viewData.unit = item.unit || ''
  viewData.remark = item.remark || ''
  viewData.photo = item.photo || ''
  viewData.positions = item.positions ? [...item.positions] : [{
    job: item.position || '',
    startDate: item.startDate || '',
    endDate: item.endDate || '',
    division: ''
  }]
  viewData.responsibleHouseholds = item.responsibleHouseholds ? [...item.responsibleHouseholds] : []
  viewDialogVisible.value = true
}

const handleDelete = (item) => {
  ElMessageBox.confirm('您确定要删除吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    memberList.value = memberList.value.filter(m => m.id !== item.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleSubmit = () => {
  if (!formData.village || !formData.name || !formData.gender || !formData.nation || !formData.idCard || !formData.phone) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (isEdit.value) {
    const index = memberList.value.findIndex(m => m.id === editId.value)
    if (index !== -1) {
      memberList.value[index] = { ...formData, id: editId.value }
    }
    ElMessage.success('保存成功')
  } else {
    const newId = Date.now()
    memberList.value.push({ ...formData, id: newId })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.search-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.search-input {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  width: 180px;
}

.search-select {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.search-btn, .reset-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn {
  background-color: #007bff;
  color: #fff;
}

.reset-btn {
  background-color: #fff;
  color: #666;
  border: 1px solid #dcdfe6;
}

.date-separator {
  margin: 0 5px;
  color: #999;
}

.table-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.add-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.view-btn, .edit-btn, .delete-btn {
  padding: 5px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-right: 5px;
}

.view-btn {
  background-color: #007bff;
  color: #fff;
}

.edit-btn {
  background-color: #007bff;
  color: #fff;
}

.delete-btn {
  background-color: #dc3545;
  color: #fff;
}

.form-container {
  padding: 20px 0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-item {
  flex: 1;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}

.view-container {
  padding: 20px 0;
}

.view-row {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
}

.view-item {
  font-size: 14px;
}

.view-label {
  color: #666;
}

.form-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 20px 0 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.form-divider {
  border-top: 1px dashed #ddd;
  margin: 20px 0;
}

.photo-item {
  flex: none;
  width: 150px;
}

.photo-upload {
  margin-top: 22px;
}

.upload-box {
  width: 120px;
  height: 150px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fafafa;
}

.upload-icon {
  font-size: 24px;
  color: #999;
}

.upload-text {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.position-list {
  margin-bottom: 10px;
}

.position-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 10px;
}

.position-row .form-item {
  flex: 1;
}

.delete-btn-small {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #dc3545;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.add-position-btn, .add-responsible-btn {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.add-position-btn .add-btn, .add-responsible-btn .add-btn {
  margin-bottom: 10px;
}

.upload-input {
  display: none;
}

.upload-box {
  width: 120px;
  height: 150px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fafafa;
  position: relative;
  overflow: hidden;
}

.upload-box:hover {
  border-color: #007bff;
  background-color: #f0f7ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 24px;
  color: #999;
}

.upload-text {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.household-selector {
  display: flex;
  align-items: center;
}

.household-input {
  flex: 1;
  border-radius: 4px 0 0 4px;
}

.search-btn-small {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0 4px 4px 0;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.responsible-list {
  margin-bottom: 10px;
}

.responsible-row {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  margin-bottom: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.responsible-row .form-item {
  flex: 1;
}

.household-selector-container {
  padding: 10px;
}

.household-search-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.household-search-bar .search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.household-search-bar .search-item label {
  font-weight: bold;
}

.household-table {
  width: 100%;
  border-collapse: collapse;
}

.household-table th, .household-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.household-table th {
  background-color: #f5f7fa;
  font-weight: bold;
}

.household-table tbody tr:hover {
  background-color: #f5f7fa;
}

.select-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.select-btn:hover {
  background-color: #0069d9;
}

.view-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.view-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.view-label-cell {
  width: 120px;
  background-color: #f5f7fa;
  font-weight: bold;
  text-align: right;
  padding-right: 15px;
}

.photo-cell {
  width: 150px;
  vertical-align: middle;
  text-align: center;
}

.view-photo {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.no-photo {
  width: 120px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #999;
  font-size: 12px;
}

.view-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.view-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.position-card {
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 10px;
}

.position-item {
  margin-right: 30px;
}

.responsible-card {
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.responsible-card .responsible-row {
  display: flex;
  gap: 30px;
  margin-bottom: 8px;
}

.responsible-card .responsible-row:last-child {
  margin-bottom: 0;
}

.no-data {
  color: #999;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
  text-align: center;
}
</style>