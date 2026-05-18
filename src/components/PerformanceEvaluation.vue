<template>
  <div class="performance-evaluation">
    <div class="search-panel">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">选择年度</label>
          <el-select v-model="searchForm.year" placeholder="请选择" class="form-select">
            <el-option v-for="year in availableYears" :key="year" :label="year + '年'" :value="year" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">选择人员</label>
          <el-select v-model="searchForm.personId" placeholder="请选择" class="form-select" filterable>
            <el-option label="全部" value="" />
            <el-option v-for="person in persons" :key="person.id" :label="person.name" :value="person.id" />
          </el-select>
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3>绩效排名</h3>
        <div class="ranking-list">
          <div v-for="(item, index) in performanceList" :key="item.id" class="ranking-item">
            <div class="rank-badge" :class="{ top: index < 3 }">{{ index + 1 }}</div>
            <div class="rank-info">
              <div class="rank-name">{{ item.name }}</div>
              <div class="rank-department">{{ item.department }}</div>
            </div>
            <div class="rank-score">{{ item.score }}</div>
            <div class="rank-progress">
              <el-progress :percentage="(item.score / 100 * 100)" :show-text="false" />
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>绩效分布</h3>
        <div class="distribution-chart">
          <div v-for="range in scoreRanges" :key="range.label" class="dist-item">
            <span class="dist-label">{{ range.label }}</span>
            <div class="dist-bar-wrapper">
              <div class="dist-bar" :style="{ width: (range.count / maxDistCount * 100) + '%' }"></div>
            </div>
            <span class="dist-count">{{ range.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card full-width">
      <h3>绩效详情</h3>
      <el-table :data="performanceList" border class="performance-table">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="completedTasks" label="完成任务数" />
        <el-table-column prop="totalTasks" label="总任务数" />
        <el-table-column prop="completionRate" label="完成率">
          <template #default="scope">
            <span>{{ scope.row.completionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="qualityScore" label="质量评分" />
        <el-table-column prop="timelinessScore" label="时效评分" />
        <el-table-column prop="score" label="综合得分" />
        <el-table-column prop="rank" label="排名" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="绩效详情" v-model="detailDialog" width="600px">
      <div class="detail-content" v-if="selectedPerson">
        <div class="detail-header">
          <div class="detail-name">{{ selectedPerson.name }}</div>
          <div class="detail-department">{{ selectedPerson.department }}</div>
        </div>
        <div class="detail-stats">
          <div class="stat-item">
            <span class="stat-label">综合得分</span>
            <span class="stat-value score">{{ selectedPerson.score }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">排名</span>
            <span class="stat-value">第 {{ selectedPerson.rank }} 名</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">完成率</span>
            <span class="stat-value">{{ selectedPerson.completionRate }}%</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>评分明细</h4>
          <div class="score-detail">
            <div class="score-item">
              <span class="score-label">任务完成质量</span>
              <el-progress :percentage="selectedPerson.qualityScore" :show-text="false" />
              <span class="score-value">{{ selectedPerson.qualityScore }}</span>
            </div>
            <div class="score-item">
              <span class="score-label">任务完成时效</span>
              <el-progress :percentage="selectedPerson.timelinessScore" :show-text="false" />
              <span class="score-value">{{ selectedPerson.timelinessScore }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>任务完成情况</h4>
          <div class="task-summary">
            <div class="summary-item">
              <span class="summary-label">总任务数</span>
              <span class="summary-value">{{ selectedPerson.totalTasks }} 项</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">已完成</span>
              <span class="summary-value">{{ selectedPerson.completedTasks }} 项</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">超时任务</span>
              <span class="summary-value">{{ selectedPerson.timeoutTasks }} 项</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  year: 2026,
  personId: ''
})

const availableYears = [2024, 2025, 2026]

const persons = ref([
  { id: 1, name: '张三', department: '第一组' },
  { id: 2, name: '李四', department: '第一组' },
  { id: 3, name: '王五', department: '第二组' },
  { id: 4, name: '赵六', department: '第二组' },
  { id: 5, name: '钱七', department: '第三组' }
])

const performanceList = ref([
  { id: 1, name: '张三', department: '第一组', completedTasks: 8, totalTasks: 10, completionRate: 80, qualityScore: 92, timelinessScore: 88, score: 88, rank: 1, timeoutTasks: 0 },
  { id: 2, name: '王五', department: '第二组', completedTasks: 7, totalTasks: 8, completionRate: 88, qualityScore: 88, timelinessScore: 85, score: 86, rank: 2, timeoutTasks: 0 },
  { id: 3, name: '李四', department: '第一组', completedTasks: 8, totalTasks: 12, completionRate: 67, qualityScore: 90, timelinessScore: 82, score: 84, rank: 3, timeoutTasks: 1 },
  { id: 4, name: '赵六', department: '第二组', completedTasks: 5, totalTasks: 10, completionRate: 50, qualityScore: 85, timelinessScore: 78, score: 76, rank: 4, timeoutTasks: 1 },
  { id: 5, name: '钱七', department: '第三组', completedTasks: 4, totalTasks: 10, completionRate: 40, qualityScore: 80, timelinessScore: 75, score: 72, rank: 5, timeoutTasks: 2 }
])

const scoreRanges = ref([
  { label: '90分以上', count: 1 },
  { label: '80-89分', count: 3 },
  { label: '70-79分', count: 1 },
  { label: '70分以下', count: 0 }
])

const maxDistCount = computed(() => {
  return Math.max(...scoreRanges.value.map(r => r.count))
})

const selectedPerson = reactive({})
const detailDialog = ref(false)

const handleSearch = () => {
  ElMessage.info('查询完成')
}

const viewDetail = (person) => {
  Object.assign(selectedPerson, person)
  detailDialog.value = true
}
</script>

<style scoped>
.performance-evaluation {
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

.form-select {
  width: 150px;
}

.search-actions {
  margin-left: auto;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-card h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: #666;
}

.rank-badge.top {
  background: #fbbf24;
  color: #fff;
}

.rank-badge.top:nth-child(1) {
  background: #f59e0b;
}

.rank-info {
  flex: 1;
}

.rank-name {
  font-weight: bold;
  color: #333;
}

.rank-department {
  font-size: 12px;
  color: #999;
}

.rank-score {
  font-size: 20px;
  font-weight: bold;
  color: #3b82f6;
  width: 50px;
  text-align: right;
}

.rank-progress {
  flex: 2;
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dist-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.dist-label {
  width: 80px;
  font-size: 14px;
}

.dist-bar-wrapper {
  flex: 1;
  height: 20px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
}

.dist-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 10px;
}

.dist-count {
  width: 30px;
  text-align: right;
  font-size: 14px;
}

.performance-table {
  margin-top: 10px;
}

.detail-content {
  padding: 10px;
}

.detail-header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.detail-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.detail-department {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.detail-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.score {
  color: #3b82f6;
}

.detail-section {
  margin-top: 20px;
}

.detail-section h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 15px;
}

.score-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-label {
  width: 120px;
  font-size: 14px;
}

.score-value {
  width: 40px;
  text-align: right;
  font-weight: bold;
  color: #333;
}

.task-summary {
  display: flex;
  justify-content: space-around;
}

.summary-item {
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>