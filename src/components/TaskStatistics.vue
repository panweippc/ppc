<template>
  <div class="task-statistics">
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <span class="stat-value">{{ statistics.total }}</span>
          <span class="stat-label">总任务数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <span class="stat-value">{{ statistics.inProgress }}</span>
          <span class="stat-label">进行中</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ statistics.completed }}</span>
          <span class="stat-label">已完成</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-info">
          <span class="stat-value">{{ statistics.timeout }}</span>
          <span class="stat-label">已超时</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-info">
          <span class="stat-value">{{ statistics.pendingReview }}</span>
          <span class="stat-label">待验收</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <span class="stat-value">{{ completionRate }}%</span>
          <span class="stat-label">完成率</span>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3>任务状态分布</h3>
        <div class="pie-chart-container">
          <div class="pie-chart">
            <div class="pie-slice completed" :style="{ '--percent': (statistics.completed / statistics.total * 100) + '%' }"></div>
            <div class="pie-slice inProgress" :style="{ '--percent': (statistics.inProgress / statistics.total * 100) + '%' }"></div>
            <div class="pie-slice pendingReview" :style="{ '--percent': (statistics.pendingReview / statistics.total * 100) + '%' }"></div>
            <div class="pie-slice timeout" :style="{ '--percent': (statistics.timeout / statistics.total * 100) + '%' }"></div>
          </div>
          <div class="pie-legend">
            <div class="legend-item"><span class="legend-color completed"></span> 已完成</div>
            <div class="legend-item"><span class="legend-color inProgress"></span> 进行中</div>
            <div class="legend-item"><span class="legend-color pendingReview"></span> 待验收</div>
            <div class="legend-item"><span class="legend-color timeout"></span> 已超时</div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>优先级分布</h3>
        <div class="bar-chart">
          <div class="bar-item">
            <span class="bar-label">紧急</span>
            <div class="bar-wrapper">
              <div class="bar urgent" :style="{ width: (priorityStats.urgent / statistics.total * 100) + '%' }"></div>
            </div>
            <span class="bar-value">{{ priorityStats.urgent }}</span>
          </div>
          <div class="bar-item">
            <span class="bar-label">高</span>
            <div class="bar-wrapper">
              <div class="bar high" :style="{ width: (priorityStats.high / statistics.total * 100) + '%' }"></div>
            </div>
            <span class="bar-value">{{ priorityStats.high }}</span>
          </div>
          <div class="bar-item">
            <span class="bar-label">普通</span>
            <div class="bar-wrapper">
              <div class="bar normal" :style="{ width: (priorityStats.normal / statistics.total * 100) + '%' }"></div>
            </div>
            <span class="bar-value">{{ priorityStats.normal }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3>各人员任务完成情况</h3>
        <div class="horizontal-bar-chart">
          <div v-for="person in personStats" :key="person.name" class="h-bar-item">
            <div class="h-bar-label">{{ person.name }}</div>
            <div class="h-bar-wrapper">
              <div class="h-bar" :style="{ width: (person.completed / person.total * 100) + '%' }"></div>
            </div>
            <div class="h-bar-value">{{ person.completed }}/{{ person.total }}</div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>月度任务趋势</h3>
        <div class="line-chart">
          <div class="line-chart-grid">
            <div v-for="(month, index) in monthlyStats" :key="month.name" class="line-item">
              <div class="line-bar-wrapper">
                <div class="line-bar" :style="{ height: (month.count / maxMonthlyCount * 100) + '%' }"></div>
              </div>
              <div class="line-label">{{ month.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card full-width">
      <h3>任务详情列表</h3>
      <el-table :data="recentTasks" border class="task-table">
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="assigneeName" label="负责人" />
        <el-table-column prop="deadline" label="截止时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <span :class="['status-tag', scope.row.status]">{{ getStatusText(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template #default="scope">
            <span :class="['priority-tag', scope.row.priority]">{{ getPriorityText(scope.row.priority) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const statistics = ref({
  total: 50,
  inProgress: 15,
  completed: 30,
  timeout: 3,
  pendingReview: 2
})

const priorityStats = ref({
  urgent: 12,
  high: 20,
  normal: 18
})

const personStats = ref([
  { name: '张三', total: 10, completed: 8 },
  { name: '李四', total: 12, completed: 7 },
  { name: '王五', total: 8, completed: 6 },
  { name: '赵六', total: 10, completed: 5 },
  { name: '钱七', total: 10, completed: 4 }
])

const monthlyStats = ref([
  { name: '1月', count: 8 },
  { name: '2月', count: 12 },
  { name: '3月', count: 6 },
  { name: '4月', count: 15 },
  { name: '5月', count: 9 }
])

const recentTasks = ref([
  { taskName: '完成贫困户信息录入', assigneeName: '张三', deadline: '2026-05-20', status: 'inProgress', priority: 'urgent' },
  { taskName: '整理帮扶资料', assigneeName: '李四', deadline: '2026-05-25', status: 'inProgress', priority: 'high' },
  { taskName: '检查危房改造情况', assigneeName: '王五', deadline: '2026-05-18', status: 'pendingReview', priority: 'urgent' },
  { taskName: '组织党员学习', assigneeName: '赵六', deadline: '2026-05-30', status: 'inProgress', priority: 'normal' },
  { taskName: '统计村民收入情况', assigneeName: '钱七', deadline: '2026-05-15', status: 'timeout', priority: 'high' }
])

const completionRate = computed(() => {
  return Math.round((statistics.value.completed / statistics.value.total) * 100)
})

const maxMonthlyCount = computed(() => {
  return Math.max(...monthlyStats.value.map(m => m.count))
})

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

const getPriorityText = (priority) => {
  const map = { urgent: '紧急', high: '高', normal: '普通' }
  return map[priority] || priority
}
</script>

<style scoped>
.task-statistics {
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
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

.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: center;
}

.pie-chart {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #10b981 0% 60%,
    #f59e0b 60% 90%,
    #8b5cf6 90% 94%,
    #ef4444 94% 100%
  );
  position: relative;
}

.pie-chart::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  background: #fff;
  border-radius: 50%;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.completed { background: #10b981; }
.legend-color.inProgress { background: #f59e0b; }
.legend-color.pendingReview { background: #8b5cf6; }
.legend-color.timeout { background: #ef4444; }

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-label {
  width: 40px;
  font-size: 14px;
}

.bar-wrapper {
  flex: 1;
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.bar {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
}

.bar.urgent { background: #ef4444; }
.bar.high { background: #f59e0b; }
.bar.normal { background: #10b981; }

.bar-value {
  width: 40px;
  text-align: right;
  font-size: 14px;
}

.horizontal-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.h-bar-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.h-bar-label {
  width: 60px;
  font-size: 14px;
}

.h-bar-wrapper {
  flex: 1;
  height: 20px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
}

.h-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.h-bar-value {
  width: 60px;
  text-align: right;
  font-size: 14px;
}

.line-chart {
  padding: 20px 0;
}

.line-chart-grid {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 150px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.line-chart-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 29px,
    #f3f4f6 30px
  );
}

.line-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.line-bar-wrapper {
  width: 40px;
  height: 120px;
  display: flex;
  align-items: flex-end;
}

.line-bar {
  width: 100%;
  background: linear-gradient(180deg, #10b981, #34d399);
  border-radius: 8px 8px 0 0;
  transition: height 0.3s ease;
}

.line-label {
  font-size: 12px;
  color: #666;
}

.task-table {
  margin-top: 10px;
}

.status-tag, .priority-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.pending { background: #f0f9ff; color: #0284c7; }
.status-tag.inProgress { background: #fef3c7; color: #d97706; }
.status-tag.pendingReview { background: #eef2ff; color: #4f46e5; }
.status-tag.completed { background: #dcfce7; color: #16a34a; }
.status-tag.rejected { background: #fee2e2; color: #dc2626; }
.status-tag.timeout { background: #fef2f2; color: #dc2626; }

.priority-tag.urgent { background: #fef0f0; color: #dc2626; }
.priority-tag.high { background: #fff7ed; color: #ea580c; }
.priority-tag.normal { background: #f0fdf4; color: #16a34a; }
</style>