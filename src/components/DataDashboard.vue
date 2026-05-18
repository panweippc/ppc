<template>
  <div class="dashboard-container" ref="dashboardRef">
    <div class="dashboard-header">
      <div class="header-left">
        <div class="region-badge">
          <component :is="User" class="region-icon" />
          <span class="region-name">灏明县</span>
        </div>
        <span class="date-text">{{ currentDate }}</span>
      </div>
      <div class="header-center">
        <h1 class="dashboard-title">乡村振兴数据监测平台</h1>
        <div class="title-sub">实时数据分析中心</div>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">系统运行正常</span>
        </div>
        <span class="current-time">{{ currentTime }}</span>
        <button class="screen-btn" @click="toggleFullscreen">
          <span>{{ isFullscreen ? '退出' : '全屏' }}</span>
        </button>
      </div>
    </div>

    <div class="dashboard-grid" :class="gridClass">
      <div class="grid-panel overview-panel" :class="{ 'span-2': isMediumScreen }">
        <div class="panel-header">
          <component :is="User" class="panel-icon" />
          <span class="panel-title">人口概况</span>
          <span class="panel-badge positive">+2.3%</span>
        </div>
        <div class="panel-body">
          <div class="stats-row">
            <div class="stat-card" v-for="(stat, index) in populationStats" :key="index">
              <div class="stat-icon" :class="stat.bgClass">{{ stat.value }}</div>
              <div class="stat-info">
                <span class="stat-label">{{ stat.label }}</span>
                <span class="stat-value">{{ formatNumber(stat.number) }}</span>
              </div>
            </div>
          </div>
          <div class="chart-block">
            <div class="chart-header">
              <span class="chart-title">人口结构分布</span>
            </div>
            <div class="bar-chart">
              <div v-for="(item, index) in populationStructure" :key="index" class="bar-item">
                <div class="bar-wrapper">
                  <div class="bar-fill" :style="{ height: item.value + '%', backgroundColor: item.color }"></div>
                </div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel land-panel">
        <div class="panel-header">
          <component :is="List" class="panel-icon" />
          <span class="panel-title">农业用地</span>
        </div>
        <div class="panel-body">
          <div class="land-cards">
            <div v-for="(item, index) in landData" :key="index" class="land-card">
              <div class="land-ring">
                <svg viewBox="0 0 60 60" class="ring-svg">
                  <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="6"/>
                  <circle cx="30" cy="30" r="22" fill="none" :stroke="item.color" stroke-width="6"
                          :stroke-dasharray="getRingDash(item.percentage)" stroke-linecap="round" 
                          transform="rotate(-90 30 30)" class="animate-ring"/>
                </svg>
                <div class="ring-text">{{ item.percentage }}%</div>
              </div>
              <div class="land-info">
                <span class="land-value">{{ item.value }}</span>
                <span class="land-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel household-panel">
        <div class="panel-header">
          <component :is="House" class="panel-icon" />
          <span class="panel-title">户类型分布</span>
        </div>
        <div class="panel-body">
          <div class="pie-wrapper">
            <svg viewBox="0 0 100 100" class="pie-svg">
              <g v-for="(item, index) in householdPieData" :key="index">
                <path :d="getPiePath(item.startAngle, item.endAngle)" :fill="item.color"/>
              </g>
              <circle cx="50" cy="50" r="25" fill="#1a2332"/>
            </svg>
            <div class="pie-center">
              <span class="pie-total">{{ totalHouseholds }}</span>
              <span class="pie-label">总户数</span>
            </div>
          </div>
          <div class="household-legend">
            <div v-for="(item, index) in householdTypes" :key="index" class="legend-row">
              <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-text">{{ item.label }}</span>
              <span class="legend-value">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel economy-panel">
        <div class="panel-header">
          <component :is="ArrowUp" class="panel-icon" />
          <span class="panel-title">经济收支</span>
          <span class="panel-badge" :class="economyTrend >= 0 ? 'positive' : 'negative'">
            {{ economyTrend >= 0 ? '+' : '' }}{{ economyTrend }}%
          </span>
        </div>
        <div class="panel-body">
          <div class="economy-tabs">
            <button v-for="tab in economyTabs" :key="tab.id" 
                    :class="['tab-btn', { active: activeEconomyTab === tab.id }]"
                    @click="activeEconomyTab = tab.id">
              {{ tab.name }}
            </button>
          </div>
          <div class="income-list">
            <div v-for="(item, index) in currentEconomyData" :key="index" class="income-row">
              <span class="income-label">{{ item.label }}</span>
              <span class="income-value">{{ formatCurrency(item.value) }}</span>
            </div>
          </div>
          <div class="mini-line-chart">
            <svg viewBox="0 0 200 60" class="line-svg">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#00c8ff;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#00c8ff;stop-opacity:0" />
                </linearGradient>
              </defs>
              <path :d="areaPath" fill="url(#lineGradient)"/>
              <path :d="linePath" fill="none" stroke="#00c8ff" stroke-width="2"/>
              <circle v-for="(point, index) in chartPoints" :key="index" 
                      :cx="point.x" :cy="point.y" r="3" fill="#00c8ff"/>
            </svg>
            <div class="chart-x-labels">
              <span>1月</span><span>6月</span><span>12月</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel task-panel">
        <div class="panel-header">
          <component :is="List" class="panel-icon" />
          <span class="panel-title">工作动态</span>
        </div>
        <div class="panel-body">
          <div class="task-summary">
            <div class="summary-item">
              <span class="summary-num">{{ taskStats.total }}</span>
              <span class="summary-label">总任务</span>
            </div>
            <div class="summary-item">
              <span class="summary-num pending">{{ taskStats.pending }}</span>
              <span class="summary-label">待处理</span>
            </div>
            <div class="summary-item">
              <span class="summary-num processing">{{ taskStats.processing }}</span>
              <span class="summary-label">进行中</span>
            </div>
            <div class="summary-item">
              <span class="summary-num completed">{{ taskStats.completed }}</span>
              <span class="summary-label">已完成</span>
            </div>
          </div>
          <div class="task-list">
            <div v-for="(task, index) in recentTasks" :key="index" class="task-item">
              <div class="task-status-dot" :class="task.status"></div>
              <div class="task-content">
                <span class="task-title">{{ task.title }}</span>
                <div class="task-progress-bar">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
                <span class="task-meta">{{ task.time }} · {{ task.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel warning-panel">
        <div class="panel-header">
          <component :is="Bell" class="panel-icon" />
          <span class="panel-title">监测预警</span>
          <span class="alert-badge" v-if="warningStats.total > 0">{{ warningStats.total }}</span>
        </div>
        <div class="panel-body">
          <div class="warning-summary">
            <div class="warning-item" v-for="(item, index) in warningSummary" :key="index" :class="item.type">
              <component :is="item.icon" class="warning-icon" />
              <div class="warning-info">
                <span class="warning-count">{{ item.count }}</span>
                <span class="warning-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
          <div class="warning-detail">
            <div v-for="(item, index) in warningList" :key="index" class="warning-row">
              <span class="warning-tag" :class="item.type">{{ item.typeText }}</span>
              <span class="warning-desc">{{ item.desc }}</span>
              <span class="warning-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel livestock-panel">
        <div class="panel-header">
          <component :is="House" class="panel-icon" />
          <span class="panel-title">养殖业统计</span>
        </div>
        <div class="panel-body">
          <div class="livestock-grid">
            <div v-for="(item, index) in livestockData" :key="index" class="livestock-card">
              <span class="livestock-emoji">{{ item.icon }}</span>
              <div class="livestock-info">
                <span class="livestock-name">{{ item.name }}</span>
                <span class="livestock-count">{{ formatNumber(item.count) }}</span>
              </div>
            </div>
          </div>
          <div class="facility-section">
            <span class="section-title">养殖设施面积</span>
            <div class="facility-bars">
              <div v-for="(item, index) in facilityData" :key="index" class="facility-bar-item">
                <span class="facility-label">{{ item.label }}</span>
                <div class="facility-bar">
                  <div class="facility-fill" :style="{ width: item.percentage + '%' }"></div>
                </div>
                <span class="facility-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel region-panel">
        <div class="panel-header">
          <component :is="List" class="panel-icon" />
          <span class="panel-title">区域分布</span>
        </div>
        <div class="panel-body">
          <div class="region-grid">
            <div v-for="(area, index) in regionData" :key="index" 
                 class="region-cell" :style="{ backgroundColor: area.color }"
                 @mouseenter="hoverRegion = area"
                 @mouseleave="hoverRegion = null">
              <span class="region-name">{{ area.label }}</span>
              <span class="region-count">{{ area.count }}</span>
            </div>
          </div>
          <div class="region-legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #00c8ff"></span>
              <span>高密度</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #0088cc"></span>
              <span>中密度</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #005599"></span>
              <span>低密度</span>
            </div>
          </div>
          <div class="region-tooltip" v-if="hoverRegion">
            <div class="tooltip-header">{{ hoverRegion.name }}</div>
            <div class="tooltip-content">
              <span>户数：{{ hoverRegion.count }}</span>
              <span>人口：{{ hoverRegion.population }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  User, House, List, ArrowDown, Bell, Clock, 
  ArrowUp, Search, Plus, Refresh 
} from '@element-plus/icons-vue'

const dashboardRef = ref(null)
const isFullscreen = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const activeEconomyTab = ref('year')
const hoverRegion = ref(null)

const populationStats = ref([
  { label: '总户数', number: 2456, value: '🏠', bgClass: 'bg-blue' },
  { label: '总人口', number: 8932, value: '👥', bgClass: 'bg-green' },
  { label: '男性', number: 4567, value: '👨', bgClass: 'bg-orange' },
  { label: '女性', number: 4365, value: '👩', bgClass: 'bg-pink' }
])

const populationStructure = ref([
  { label: '0-14岁', value: 18, color: '#00c8ff' },
  { label: '15-59岁', value: 65, color: '#00ff99' },
  { label: '60岁+', value: 17, color: '#ff9966' }
])

const landData = ref([
  { label: '耕地', value: '502.51万亩', percentage: 85, color: '#ff6b6b' },
  { label: '林地', value: '258.77万亩', percentage: 52, color: '#4ecdc4' },
  { label: '草地', value: '277.36万亩', percentage: 55, color: '#ffe66d' },
  { label: '水面', value: '12.8万亩', percentage: 3, color: '#95e1d3' }
])

const householdTypes = ref([
  { label: '一般户', count: 1856, percentage: 75.6, color: '#00c8ff' },
  { label: '脱贫户', count: 320, percentage: 13.0, color: '#00ff99' },
  { label: '监测户', count: 156, percentage: 6.4, color: '#ffdd00' },
  { label: '低保户', count: 86, percentage: 3.5, color: '#ff6b9d' },
  { label: '五保户', count: 28, percentage: 1.1, color: '#ff9966' },
  { label: '优抚户', count: 10, percentage: 0.4, color: '#ff6b6b' }
])

const totalHouseholds = computed(() => {
  return householdTypes.value.reduce((sum, item) => sum + item.count, 0)
})

const householdPieData = computed(() => {
  let startAngle = 0
  return householdTypes.value.map(item => {
    const angle = (item.percentage / 100) * 360
    const endAngle = startAngle + angle
    const data = { startAngle, endAngle, color: item.color }
    startAngle = endAngle
    return data
  })
})

const economyTrend = ref(5.8)
const economyTabs = [{ id: 'year', name: '本年' }, { id: 'lastYear', name: '上年' }]

const yearIncome = ref([
  { label: '工资性收入', value: 1258000 },
  { label: '经营性收入', value: 895000 },
  { label: '财产性收入', value: 126000 },
  { label: '转移性收入', value: 658000 },
  { label: '其他收入', value: 89000 },
  { label: '合计', value: 3026000 }
])

const lastYearIncome = ref([
  { label: '工资性收入', value: 1125000 },
  { label: '经营性收入', value: 786000 },
  { label: '财产性收入', value: 112000 },
  { label: '转移性收入', value: 589000 },
  { label: '其他收入', value: 76000 },
  { label: '合计', value: 2688000 }
])

const currentEconomyData = computed(() => {
  return activeEconomyTab.value === 'year' ? yearIncome.value : lastYearIncome.value
})

const chartData = ref([35, 42, 38, 55, 48, 62])
const chartPoints = computed(() => {
  const width = 200
  const height = 60
  const padding = 10
  const maxVal = 70
  return chartData.value.map((val, i) => ({
    x: padding + (i * (width - 2 * padding)) / (chartData.value.length - 1),
    y: height - padding - (val / maxVal) * (height - 2 * padding)
  }))
})

const linePath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const areaPath = computed(() => {
  if (chartPoints.value.length === 0) return ''
  const points = chartPoints.value
  const firstX = points[0].x
  const lastX = points[points.length - 1].x
  return `${linePath.value} L ${lastX} 60 L ${firstX} 60 Z`
})

const taskStats = ref({ total: 156, pending: 23, processing: 68, completed: 65 })
const recentTasks = ref([
  { title: '乡村道路改造项目', time: '2024-05-18', progress: 75, status: 'processing' },
  { title: '灌溉设施维护', time: '2024-05-17', progress: 45, status: 'processing' },
  { title: '文化广场建设', time: '2024-05-16', progress: 100, status: 'completed' },
  { title: '农田水利修复', time: '2024-05-15', progress: 20, status: 'pending' }
])

const warningStats = ref({ total: 5, income: 2, health: 1, other: 2 })
const warningSummary = ref([
  { type: 'income', icon: ArrowDown, count: 2, label: '收入异常' },
  { type: 'health', icon: Bell, count: 1, label: '健康预警' },
  { type: 'other', icon: Clock, count: 2, label: '其他预警' }
])
const warningList = ref([
  { type: 'income', typeText: '收入异常', desc: '张三户收入环比下降30%', time: '10分钟前' },
  { type: 'health', typeText: '健康预警', desc: '李四健康状况需关注', time: '30分钟前' },
  { type: 'other', typeText: '其他预警', desc: '王五户需走访', time: '1小时前' }
])

const livestockData = ref([
  { name: '羊', count: 8560, icon: '🐑' },
  { name: '牛', count: 1256, icon: '🐄' },
  { name: '猪', count: 3256, icon: '🐖' },
  { name: '鸡', count: 15680, icon: '🐔' },
  { name: '鸭', count: 4580, icon: '🦆' },
  { name: '鹅', count: 1256, icon: '🦢' }
])

const facilityData = ref([
  { label: '育肥圈', value: '1,256m²', percentage: 85 },
  { label: '饲料间', value: '890m²', percentage: 65 },
  { label: '储草间', value: '650m²', percentage: 45 },
  { label: '棚圈', value: '2,340m²', percentage: 95 }
])

const regionData = ref([
  { name: '光明镇', label: '光明', count: 856, population: 3256, color: '#00c8ff' },
  { name: '敖包村', label: '敖包', count: 423, population: 1568, color: '#00aacc' },
  { name: '北山村', label: '北山', count: 389, population: 1456, color: '#00aacc' },
  { name: '塔拉村', label: '塔拉', count: 298, population: 1086, color: '#0088cc' },
  { name: '红旗村', label: '红旗', count: 256, population: 926, color: '#0088cc' },
  { name: '幸福村', label: '幸福', count: 234, population: 846, color: '#005599' }
])

const isMediumScreen = computed(() => {
  return window.innerWidth >= 1200 && window.innerWidth < 1920
})

const gridClass = computed(() => {
  const width = window.innerWidth
  if (width >= 1920) return 'large-screen'
  if (width >= 1200) return 'medium-screen'
  return 'small-screen'
})

const getRingDash = (percentage) => {
  const circumference = 2 * Math.PI * 22
  const filled = (percentage / 100) * circumference
  return `${filled} ${circumference - filled}`
}

const getPiePath = (startAngle, endAngle) => {
  const startRad = ((startAngle - 90) * Math.PI) / 180
  const endRad = ((endAngle - 90) * Math.PI) / 180
  const x1 = 50 + 35 * Math.cos(startRad)
  const y1 = 50 + 35 * Math.sin(startRad)
  const x2 = 50 + 35 * Math.cos(endRad)
  const y2 = 50 + 35 * Math.sin(endRad)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`
}

const formatNumber = (num) => {
  return num.toLocaleString()
}

const formatCurrency = (value) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  }
  return value.toLocaleString()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })
}

let timeTimer = null

onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
  padding: 16px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 24px;
  background: rgba(16, 23, 33, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(0, 200, 255, 0.2);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.region-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(0, 200, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(0, 200, 255, 0.3);
}

.region-icon {
  color: #00c8ff;
  font-size: 14px;
}

.region-name {
  font-size: 14px;
  color: #00c8ff;
  font-weight: 600;
}

.date-text {
  font-size: 13px;
  color: #6e7681;
}

.header-center {
  text-align: center;
}

.dashboard-title {
  font-size: 24px;
  color: #00c8ff;
  margin: 0 0 4px;
  font-weight: 600;
  letter-spacing: 1px;
}

.title-sub {
  font-size: 11px;
  color: #6e7681;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #3fb950;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 13px;
  color: #3fb950;
}

.current-time {
  font-size: 20px;
  color: #f0f6fc;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  letter-spacing: 1px;
}

.screen-btn {
  padding: 8px 14px;
  background: rgba(0, 200, 255, 0.1);
  border: 1px solid rgba(0, 200, 255, 0.3);
  color: #00c8ff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.screen-btn:hover {
  background: rgba(0, 200, 255, 0.2);
}

.screen-icon {
  font-size: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  height: calc(100vh - 140px);
}

.dashboard-grid.large-screen {
  grid-template-columns: repeat(4, 1fr);
}

.dashboard-grid.medium-screen {
  grid-template-columns: repeat(3, 1fr);
}

.dashboard-grid.small-screen {
  grid-template-columns: repeat(2, 1fr);
}

.grid-panel {
  background: rgba(16, 23, 33, 0.95);
  border: 1px solid rgba(0, 200, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.grid-panel:hover {
  border-color: rgba(0, 200, 255, 0.3);
}

.grid-panel.span-2 {
  grid-column: span 2;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 200, 255, 0.05);
  border-bottom: 1px solid rgba(0, 200, 255, 0.15);
}

.panel-icon {
  color: #00c8ff;
  font-size: 16px;
  margin-right: 10px;
}

.panel-title {
  font-size: 14px;
  color: #f0f6fc;
  font-weight: 600;
  flex: 1;
}

.panel-badge {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.panel-badge.positive {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
}

.panel-badge.negative {
  background: rgba(248, 81, 73, 0.15);
  color: #f85149;
}

.alert-badge {
  padding: 3px 10px;
  background: rgba(248, 81, 73, 0.2);
  border-radius: 10px;
  font-size: 11px;
  color: #f85149;
  font-weight: 600;
}

.panel-body {
  padding: 14px;
  height: calc(100% - 52px);
  overflow-y: auto;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 8px;
}

.stat-icon.bg-blue { background: linear-gradient(135deg, #238636 0%, #2ea043 100%); }
.stat-icon.bg-green { background: linear-gradient(135deg, #58a6ff 0%, #79c0ff 100%); }
.stat-icon.bg-orange { background: linear-gradient(135deg, #d29922 0%, #e3b341 100%); }
.stat-icon.bg-pink { background: linear-gradient(135deg, #db61a2 0%, #e075b0 100%); }

.stat-info {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #6e7681;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  color: #f0f6fc;
  font-weight: 600;
}

.chart-block {
  margin-top: 8px;
}

.chart-header {
  margin-bottom: 10px;
}

.chart-title {
  font-size: 12px;
  color: #6e7681;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 60px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 60px;
}

.bar-wrapper {
  width: 30px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.8s ease;
}

.bar-label {
  font-size: 10px;
  color: #6e7681;
}

.land-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.land-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.land-ring {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.animate-ring {
  animation: ringProgress 1.5s ease-out forwards;
}

@keyframes ringProgress {
  from { stroke-dasharray: 0 138; }
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  color: #f0f6fc;
  font-weight: 500;
}

.land-info {
  text-align: center;
}

.land-value {
  display: block;
  font-size: 13px;
  color: #f0f6fc;
  font-weight: 600;
}

.land-label {
  font-size: 11px;
  color: #6e7681;
}

.pie-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 12px;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-total {
  display: block;
  font-size: 18px;
  color: #00c8ff;
  font-weight: 700;
}

.pie-label {
  font-size: 10px;
  color: #6e7681;
}

.household-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-text {
  flex: 1;
  font-size: 11px;
  color: #c9d1d9;
}

.legend-value {
  font-size: 11px;
  color: #00c8ff;
  font-weight: 500;
}

.economy-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tab-btn {
  padding: 6px 14px;
  background: rgba(0, 200, 255, 0.05);
  border: 1px solid rgba(0, 200, 255, 0.2);
  color: #6e7681;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(0, 200, 255, 0.15);
  color: #00c8ff;
  border-color: #00c8ff;
}

.income-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.income-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.income-label {
  font-size: 11px;
  color: #6e7681;
}

.income-value {
  font-size: 12px;
  color: #f0f6fc;
  font-weight: 600;
}

.mini-line-chart {
  margin-top: 8px;
}

.line-svg {
  width: 100%;
  height: 60px;
}

.chart-x-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 10px;
  color: #6e7681;
}

.task-summary {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 12px;
}

.summary-item {
  text-align: center;
}

.summary-num {
  display: block;
  font-size: 18px;
  color: #00c8ff;
  font-weight: 700;
}

.summary-num.pending { color: #d29922; }
.summary-num.processing { color: #58a6ff; }
.summary-num.completed { color: #3fb950; }

.summary-label {
  font-size: 11px;
  color: #6e7681;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
}

.task-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-status-dot.pending { background: #d29922; }
.task-status-dot.processing { 
  background: #58a6ff; 
  animation: blink 1s infinite;
}
.task-status-dot.completed { background: #3fb950; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  display: block;
  font-size: 12px;
  color: #f0f6fc;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-progress-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00c8ff, #3fb950);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.task-meta {
  font-size: 10px;
  color: #6e7681;
}

.warning-summary {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.warning-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
}

.warning-item.income {
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid rgba(248, 81, 73, 0.2);
}

.warning-item.health {
  background: rgba(250, 173, 20, 0.1);
  border: 1px solid rgba(250, 173, 20, 0.2);
}

.warning-item.other {
  background: rgba(250, 204, 21, 0.1);
  border: 1px solid rgba(250, 204, 21, 0.2);
}

.warning-icon {
  font-size: 18px;
  margin-bottom: 6px;
}

.warning-info {
  text-align: center;
}

.warning-count {
  display: block;
  font-size: 16px;
  color: #f0f6fc;
  font-weight: 700;
}

.warning-label {
  font-size: 10px;
  color: #6e7681;
}

.warning-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.warning-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
}

.warning-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  flex-shrink: 0;
}

.warning-tag.income {
  background: rgba(248, 81, 73, 0.2);
  color: #f85149;
}

.warning-tag.health {
  background: rgba(250, 173, 20, 0.2);
  color: #fabd05;
}

.warning-tag.other {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.warning-desc {
  flex: 1;
  font-size: 11px;
  color: #c9d1d9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.warning-time {
  font-size: 10px;
  color: #6e7681;
  flex-shrink: 0;
}

.livestock-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.livestock-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.livestock-emoji {
  font-size: 22px;
  margin-bottom: 6px;
}

.livestock-info {
  text-align: center;
}

.livestock-name {
  display: block;
  font-size: 11px;
  color: #6e7681;
  margin-bottom: 3px;
}

.livestock-count {
  font-size: 14px;
  color: #00c8ff;
  font-weight: 600;
}

.facility-section {
  margin-top: 8px;
}

.section-title {
  display: block;
  font-size: 12px;
  color: #6e7681;
  margin-bottom: 10px;
}

.facility-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.facility-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.facility-label {
  width: 50px;
  font-size: 11px;
  color: #6e7681;
  flex-shrink: 0;
}

.facility-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.facility-fill {
  height: 100%;
  background: linear-gradient(90deg, #00c8ff, #00ff99);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.facility-value {
  width: 60px;
  font-size: 11px;
  color: #f0f6fc;
  text-align: right;
  flex-shrink: 0;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  height: 120px;
  margin-bottom: 12px;
}

.region-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.region-cell:hover {
  transform: scale(1.03);
  border-color: #00c8ff;
}

.region-name {
  font-size: 12px;
  color: #f0f6fc;
  font-weight: 500;
}

.region-count {
  font-size: 16px;
  color: #ffffff;
  font-weight: 700;
}

.region-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.region-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #6e7681;
}

.region-legend .legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.region-tooltip {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 12px;
  background: rgba(16, 23, 33, 0.95);
  border-radius: 8px;
  border: 1px solid rgba(0, 200, 255, 0.3);
  min-width: 140px;
}

.tooltip-header {
  font-size: 13px;
  color: #00c8ff;
  font-weight: 600;
  margin-bottom: 8px;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #c9d1d9;
}

@media (max-width: 1919px) {
  .dashboard-grid.medium-screen .overview-panel {
    grid-column: span 2;
  }
}

@media (max-width: 1199px) {
  .dashboard-grid.small-screen {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-title {
    font-size: 18px;
  }
  
  .current-time {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .dashboard-grid.small-screen {
    grid-template-columns: 1fr;
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .livestock-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>