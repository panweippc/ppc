<template>
  <div class="comprehensive-query">
    <div class="query-tabs">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="户信息查询" name="household">
          <div class="query-panel">
            <div class="search-form">
              <div class="search-row">
                <div class="search-item">
                  <label class="search-label">户主姓名</label>
                  <el-input v-model="householdForm.householderName" placeholder="请输入户主姓名" class="form-input" />
                </div>
                <div class="search-item">
                  <label class="search-label">身份证号</label>
                  <el-input v-model="householdForm.idCard" placeholder="请输入身份证号" class="form-input" />
                </div>
                <div class="search-item">
                  <label class="search-label">所属村</label>
                  <el-select v-model="householdForm.village" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="塔拉村" value="塔拉村" />
                    <el-option label="敖包村" value="敖包村" />
                    <el-option label="北山村" value="北山村" />
                  </el-select>
                </div>
                <div class="search-item">
                  <label class="search-label">户类型</label>
                  <el-select v-model="householdForm.householdType" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="贫困户" value="poor" />
                    <el-option label="一般户" value="normal" />
                    <el-option label="低保户" value="lowIncome" />
                  </el-select>
                </div>
                <div class="search-actions">
                  <el-button type="primary" @click="queryHousehold">查询</el-button>
                  <el-button @click="resetHouseholdForm">重置</el-button>
                </div>
              </div>
            </div>
            <div class="result-table">
              <el-table :data="householdResults" border class="query-table">
                <el-table-column prop="householderName" label="户主姓名" />
                <el-table-column prop="idCard" label="身份证号" />
                <el-table-column prop="village" label="所属村" />
                <el-table-column prop="householdType" label="户类型" />
                <el-table-column prop="address" label="家庭住址" />
                <el-table-column prop="phone" label="联系电话" />
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="viewHousehold(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="人员信息查询" name="person">
          <div class="query-panel">
            <div class="search-form">
              <div class="search-row">
                <div class="search-item">
                  <label class="search-label">姓名</label>
                  <el-input v-model="personForm.name" placeholder="请输入姓名" class="form-input" />
                </div>
                <div class="search-item">
                  <label class="search-label">身份证号</label>
                  <el-input v-model="personForm.idCard" placeholder="请输入身份证号" class="form-input" />
                </div>
                <div class="search-item">
                  <label class="search-label">性别</label>
                  <el-select v-model="personForm.gender" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="男" value="male" />
                    <el-option label="女" value="female" />
                  </el-select>
                </div>
                <div class="search-item">
                  <label class="search-label">是否贫困户</label>
                  <el-select v-model="personForm.isPoor" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="是" value="yes" />
                    <el-option label="否" value="no" />
                  </el-select>
                </div>
                <div class="search-actions">
                  <el-button type="primary" @click="queryPerson">查询</el-button>
                  <el-button @click="resetPersonForm">重置</el-button>
                </div>
              </div>
            </div>
            <div class="result-table">
              <el-table :data="personResults" border class="query-table">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="idCard" label="身份证号" />
                <el-table-column prop="gender" label="性别" />
                <el-table-column prop="age" label="年龄" />
                <el-table-column prop="relation" label="与户主关系" />
                <el-table-column prop="isPoor" label="是否贫困户" />
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="viewPerson(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="补贴信息查询" name="subsidy">
          <div class="query-panel">
            <div class="search-form">
              <div class="search-row">
                <div class="search-item">
                  <label class="search-label">补贴项目</label>
                  <el-select v-model="subsidyForm.subsidyType" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="人员补贴" value="person" />
                    <el-option label="农业补贴" value="agriculture" />
                    <el-option label="牧业补贴" value="animal" />
                    <el-option label="医疗补贴" value="medical" />
                  </el-select>
                </div>
                <div class="search-item">
                  <label class="search-label">户主姓名</label>
                  <el-input v-model="subsidyForm.householderName" placeholder="请输入户主姓名" class="form-input" />
                </div>
                <div class="search-item">
                  <label class="search-label">补贴年份</label>
                  <el-select v-model="subsidyForm.year" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="2024年" value="2024" />
                    <el-option label="2025年" value="2025" />
                    <el-option label="2026年" value="2026" />
                  </el-select>
                </div>
                <div class="search-actions">
                  <el-button type="primary" @click="querySubsidy">查询</el-button>
                  <el-button @click="resetSubsidyForm">重置</el-button>
                </div>
              </div>
            </div>
            <div class="result-table">
              <el-table :data="subsidyResults" border class="query-table">
                <el-table-column prop="subsidyType" label="补贴项目" />
                <el-table-column prop="householderName" label="户主姓名" />
                <el-table-column prop="amount" label="补贴金额" />
                <el-table-column prop="confirmDate" label="确认时间" />
                <el-table-column prop="year" label="补贴年份" />
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="viewSubsidy(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="帮扶信息查询" name="help">
          <div class="query-panel">
            <div class="search-form">
              <div class="search-row">
                <div class="search-item">
                  <label class="search-label">帮扶类型</label>
                  <el-select v-model="helpForm.helpType" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="增收类" value="income" />
                    <el-option label="三保障和饮水安全类" value="safety" />
                    <el-option label="兜底保障类" value="support" />
                  </el-select>
                </div>
                <div class="search-item">
                  <label class="search-label">户主姓名</label>
                  <el-input v-model="helpForm.householderName" placeholder="请输入户主姓名" class="form-input" />
                </div>
                <div class="search-item">
                  <label class="search-label">帮扶状态</label>
                  <el-select v-model="helpForm.status" placeholder="请选择" class="form-select">
                    <el-option label="全部" value="" />
                    <el-option label="进行中" value="inProgress" />
                    <el-option label="已完成" value="completed" />
                  </el-select>
                </div>
                <div class="search-actions">
                  <el-button type="primary" @click="queryHelp">查询</el-button>
                  <el-button @click="resetHelpForm">重置</el-button>
                </div>
              </div>
            </div>
            <div class="result-table">
              <el-table :data="helpResults" border class="query-table">
                <el-table-column prop="helpType" label="帮扶类型" />
                <el-table-column prop="householderName" label="户主姓名" />
                <el-table-column prop="measure" label="帮扶措施" />
                <el-table-column prop="project" label="帮扶项目" />
                <el-table-column prop="startDate" label="开始时间" />
                <el-table-column prop="status" label="状态" />
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="viewHelp(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('household')

const householdForm = reactive({
  householderName: '',
  idCard: '',
  village: '',
  householdType: ''
})

const personForm = reactive({
  name: '',
  idCard: '',
  gender: '',
  isPoor: ''
})

const subsidyForm = reactive({
  subsidyType: '',
  householderName: '',
  year: ''
})

const helpForm = reactive({
  helpType: '',
  householderName: '',
  status: ''
})

const householdResults = ref([
  { id: 1, householderName: '张三', idCard: '110101199001011234', village: '塔拉村', householdType: '贫困户', address: '塔拉村一组', phone: '13800138001' },
  { id: 2, householderName: '李四', idCard: '110101198505055678', village: '敖包村', householdType: '一般户', address: '敖包村二组', phone: '13900139002' },
  { id: 3, householderName: '王五', idCard: '110101197810109012', village: '北山村', householdType: '低保户', address: '北山村三组', phone: '13700137003' },
  { id: 4, householderName: '赵六', idCard: '110101199203033456', village: '塔拉村', householdType: '贫困户', address: '塔拉村二组', phone: '13600136004' }
])

const personResults = ref([
  { id: 1, name: '张三', idCard: '110101199001011234', gender: '男', age: 34, relation: '户主', isPoor: '是' },
  { id: 2, name: '张妻', idCard: '110101199205052345', gender: '女', age: 32, relation: '配偶', isPoor: '是' },
  { id: 3, name: '李四', idCard: '110101198505055678', gender: '男', age: 39, relation: '户主', isPoor: '否' },
  { id: 4, name: '王五', idCard: '110101197810109012', gender: '男', age: 46, relation: '户主', isPoor: '是' }
])

const subsidyResults = ref([
  { id: 1, subsidyType: '农业补贴', householderName: '张三', amount: '2000.00', confirmDate: '2026-05-01', year: '2026' },
  { id: 2, subsidyType: '人员补贴', householderName: '李四', amount: '1500.00', confirmDate: '2026-05-10', year: '2026' },
  { id: 3, subsidyType: '医疗补贴', householderName: '王五', amount: '3000.00', confirmDate: '2026-04-15', year: '2026' },
  { id: 4, subsidyType: '牧业补贴', householderName: '赵六', amount: '2500.00', confirmDate: '2026-05-15', year: '2026' }
])

const helpResults = ref([
  { id: 1, helpType: '增收类', householderName: '张三', measure: '产业帮扶', project: '种植业', startDate: '2026-01-01', status: '进行中' },
  { id: 2, helpType: '兜底保障类', householderName: '王五', measure: '低保保障', project: '低保', startDate: '2026-01-01', status: '已完成' },
  { id: 3, helpType: '三保障和饮水安全类', householderName: '赵六', measure: '教育帮扶', project: '教育资助', startDate: '2026-03-01', status: '进行中' }
])

const queryHousehold = () => {
  ElMessage.info('查询户信息')
}

const resetHouseholdForm = () => {
  householdForm.householderName = ''
  householdForm.idCard = ''
  householdForm.village = ''
  householdForm.householdType = ''
}

const queryPerson = () => {
  ElMessage.info('查询人员信息')
}

const resetPersonForm = () => {
  personForm.name = ''
  personForm.idCard = ''
  personForm.gender = ''
  personForm.isPoor = ''
}

const querySubsidy = () => {
  ElMessage.info('查询补贴信息')
}

const resetSubsidyForm = () => {
  subsidyForm.subsidyType = ''
  subsidyForm.householderName = ''
  subsidyForm.year = ''
}

const queryHelp = () => {
  ElMessage.info('查询帮扶信息')
}

const resetHelpForm = () => {
  helpForm.helpType = ''
  helpForm.householderName = ''
  helpForm.status = ''
}

const viewHousehold = (row) => {
  ElMessage.info(`查看户信息: ${row.householderName}`)
}

const viewPerson = (row) => {
  ElMessage.info(`查看人员信息: ${row.name}`)
}

const viewSubsidy = (row) => {
  ElMessage.info(`查看补贴信息: ${row.householderName}`)
}

const viewHelp = (row) => {
  ElMessage.info(`查看帮扶信息: ${row.householderName}`)
}
</script>

<style scoped>
.comprehensive-query {
  padding: 20px;
}

.query-tabs {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.query-panel {
  margin-top: 20px;
}

.search-form {
  background: #f9fafb;
  padding: 15px;
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

.result-table {
  overflow-x: auto;
}

.query-table {
  width: 100%;
}
</style>