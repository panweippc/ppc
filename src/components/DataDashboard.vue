<template>
  <div class="dashboard-container" ref="dashboardRef">
    <div class="dashboard-header">
      <div class="header-left">
        <div class="region-badge">
          <span class="region-icon">📍</span>
          <span class="region-name">灏明县</span>
        </div>
        <span class="date-text">{{ currentDate }}</span>
      </div>
      <div class="header-center">
        <h1 class="dashboard-title">乡村综合事务与数据管理平台</h1>
        <div class="title-sub">Real-time Monitoring Dashboard</div>
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
      <div class="grid-panel population-panel">
        <div class="panel-header">
          <span class="panel-icon">👥</span>
          <span class="panel-title">人口概况</span>
          <span class="panel-badge">{{ populationTrend > 0 ? '+' : '' }}{{ populationTrend }}%</span>
        </div>
        <div class="panel-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon bg-blue">🏠</div>
              <div class="stat-info">
                <span class="stat-value">{{ animatedHouseholds }}</span>
                <span class="stat-label">总户数</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-green">👨‍👩‍👧</div>
              <div class="stat-info">
                <span class="stat-value">{{ animatedPopulation }}</span>
                <span class="stat-label">总人口</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-orange">👨</div>
              <div class="stat-info">
                <span class="stat-value">{{ animatedMale }}</span>
                <span class="stat-label">男性</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon bg-pink">👩</div>
              <div class="stat-info">
                <span class="stat-value">{{ animatedFemale }}</span>
                <span class="stat-label">女性</span>
              </div>
            </div>
          </div>
          <div class="chart-section">
            <div class="chart-title">人口结构分布</div>
            <div class="bar-chart">
              <div v-for="(item, index) in populationStructure" :key="index" class="bar-item">
                <div class="bar-wrapper">
                  <div class="bar-fill" :style="{ height: item.value + '%', backgroundColor: item.color }"></div>
                </div>
                <span class="bar-label">{{ item.label }}</span>
                <span class="bar-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel agriculture-panel">
        <div class="panel-header">
          <span class="panel-icon">🌾</span>
          <span class="panel-title">农业用地</span>
        </div>
        <div class="panel-body">
          <div class="ring-chart-grid">
            <div v-for="(item, index) in agricultureData" :key="index" class="ring-item">
              <div class="ring-container">
                <svg viewBox="0 0 80 80" class="ring-svg">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(0,255,255,0.1)" stroke-width="8"/>
                  <circle cx="40" cy="40" r="32" fill="none" :stroke="item.color" stroke-width="8"
                          :stroke-dasharray="getRingDash(item.percentage)" stroke-linecap="round" 
                          transform="rotate(-90 40 40)" :class="{ 'animate-ring': true }"/>
                </svg>
                <div class="ring-center">
                  <span class="ring-value">{{ item.value }}</span>
                </div>
              </div>
              <span class="ring-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel household-panel">
        <div class="panel-header">
          <span class="panel-icon">🏠</span>
          <span class="panel-title">户类型分布</span>
        </div>
        <div class="panel-body">
          <div class="pie-chart-container">
            <svg viewBox="0 0 180 180" class="pie-svg">
              <g v-for="(item, index) in householdPieData" :key="index">
                <path :d="getPiePath(item.startAngle, item.endAngle)" :fill="item.color" class="pie-slice"/>
              </g>
              <circle cx="90" cy="90" r="45" fill="#0a1628"/>
            </svg>
            <div class="pie-center-text">
              <span class="pie-total">{{ totalHouseholds }}</span>
              <span class="pie-label">总户数</span>
            </div>
          </div>
          <div class="legend-list">
            <div v-for="(item, index) in householdTypes" :key="index" class="legend-item">
              <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
              <span class="legend-text">{{ item.label }}</span>
              <span class="legend-value">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel economy-panel">
        <div class="panel-header">
          <span class="panel-icon">💰</span>
          <span class="panel-title">经济收支</span>
          <span class="panel-badge" :class="{ 'positive': economyTrend > 0, 'negative': economyTrend < 0 }">
            {{ economyTrend > 0 ? '+' : '' }}{{ economyTrend }}%
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
          <div class="economy-content">
            <div class="income-grid">
              <div v-for="(item, index) in currentEconomyData" :key="index" class="income-item">
                <span class="income-label">{{ item.label }}</span>
                <span class="income-value" :class="{ highlight: item.value > 0 }">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
            <div class="mini-chart">
              <div class="chart-line">
                <div v-for="(point, index) in miniChartData" :key="index" 
                     class="chart-point" :style="{ left: (index * 16.67) + '%', bottom: point + '%' }">
                  <div class="point-dot"></div>
                  <div class="point-line"></div>
                </div>
              </div>
              <div class="chart-labels">
                <span>1月</span><span>3月</span><span>6月</span><span>9月</span><span>12月</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel task-panel">
        <div class="panel-header">
          <span class="panel-icon">📋</span>
          <span class="panel-title">工作动态</span>
        </div>
        <div class="panel-body">
          <div class="task-stats">
            <div class="task-stat-item">
              <span class="task-stat-value">{{ taskStats.total }}</span>
              <span class="task-stat-label">总任务</span>
            </div>
            <div class="task-stat-item">
              <span class="task-stat-value pending">{{ taskStats.pending }}</span>
              <span class="task-stat-label">待处理</span>
            </div>
            <div class="task-stat-item">
              <span class="task-stat-value processing">{{ taskStats.processing }}</span>
              <span class="task-stat-label">进行中</span>
            </div>
            <div class="task-stat-item">
              <span class="task-stat-value completed">{{ taskStats.completed }}</span>
              <span class="task-stat-label">已完成</span>
            </div>
          </div>
          <div class="task-list">
            <div v-for="(task, index) in recentTasks" :key="index" class="task-item">
              <div class="task-status" :class="task.status"></div>
              <div class="task-info">
                <span class="task-title">{{ task.title }}</span>
                <span class="task-time">{{ task.time }}</span>
              </div>
              <div class="task-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ task.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel warning-panel">
        <div class="panel-header">
          <span class="panel-icon">⚠️</span>
          <span class="panel-title">监测预警</span>
          <span class="alert-badge" v-if="warningStats.total > 0">{{ warningStats.total }}</span>
        </div>
        <div class="panel-body">
          <div class="warning-cards">
            <div class="warning-card" v-for="(item, index) in warningCards" :key="index" :class="item.type">
              <span class="warning-icon">{{ item.icon }}</span>
              <div class="warning-content">
                <span class="warning-count">{{ item.count }}</span>
                <span class="warning-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
          <div class="warning-list">
            <div v-for="(item, index) in warningList" :key="index" class="warning-item">
              <span class="warning-tag" :class="item.type">{{ item.typeText }}</span>
              <span class="warning-desc">{{ item.desc }}</span>
              <span class="warning-time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel farming-panel">
        <div class="panel-header">
          <span class="panel-icon">🐑</span>
          <span class="panel-title">养殖业/设施</span>
        </div>
        <div class="panel-body">
          <div class="farming-content">
            <div class="facility-section">
              <div class="section-title">养殖设施</div>
              <div class="pyramid-container">
                <svg viewBox="0 0 120 140" class="pyramid-svg">
                  <polygon points="60,10 110,35 60,60 10,35" :fill="pyramidColors[0]" opacity="0.9"/>
                  <polygon points="60,50 100,70 60,90 20,70" :fill="pyramidColors[1]" opacity="0.8"/>
                  <polygon points="60,85 85,100 60,115 35,100" :fill="pyramidColors[2]" opacity="0.7"/>
                  <polygon points="60,110 72,118 60,126 48,118" :fill="pyramidColors[3]" opacity="0.6"/>
                  <text x="60" y="28" text-anchor="middle" fill="#fff" font-size="10">{{ facilityData[0].value }}</text>
                  <text x="60" y="68" text-anchor="middle" fill="#fff" font-size="10">{{ facilityData[1].value }}</text>
                  <text x="60" y="98" text-anchor="middle" fill="#fff" font-size="9">{{ facilityData[2].value }}</text>
                  <text x="60" y="118" text-anchor="middle" fill="#fff" font-size="8">{{ facilityData[3].value }}</text>
                </svg>
                <div class="pyramid-legend">
                  <div v-for="(item, index) in facilityData" :key="index" class="legend-item">
                    <span class="legend-color" :style="{ backgroundColor: pyramidColors[index] }"></span>
                    <span>{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="livestock-section">
              <div class="section-title">牧畜统计</div>
              <div class="livestock-grid">
                <div v-for="(item, index) in livestockData.slice(0, 5)" :key="index" class="livestock-item">
                  <span class="livestock-icon">{{ item.icon }}</span>
                  <span class="livestock-name">{{ item.name }}</span>
                  <span class="livestock-count">{{ item.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel map-panel">
        <div class="panel-header">
          <span class="panel-icon">🗺️</span>
          <span class="panel-title">区域分布</span>
        </div>
        <div class="panel-body">
          <div class="map-container">
            <div class="map-visual">
              <div class="map-grid">
                <div v-for="(area, index) in areaData" :key="index" 
                     class="map-cell" :style="{ backgroundColor: area.color }"
                     @mouseenter="hoverArea = area.name"
                     @mouseleave="hoverArea = null">
                  <span class="cell-label">{{ area.label }}</span>
                  <span class="cell-count">{{ area.count }}</span>
                </div>
              </div>
              <div class="map-legend">
                <div class="legend-item">
                  <span class="legend-color" style="background: #00ffff"></span>
                  <span>高密度</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #0099ff"></span>
                  <span>中密度</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #0066ff"></span>
                  <span>低密度</span>
                </div>
              </div>
            </div>
            <div class="area-detail" v-if="hoverArea">
              <div class="detail-header">{{ hoverArea }}</div>
              <div class="detail-content">
                <span>户数：{{ getAreaData(hoverArea)?.count }}</span>
                <span>人口：{{ getAreaData(hoverArea)?.population }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const dashboardRef = ref(null)
const isFullscreen = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const activeEconomyTab = ref('year')
const hoverArea = ref(null)

const animatedHouseholds = ref(0)
const animatedPopulation = ref(0)
const animatedMale = ref(0)
const animatedFemale = ref(0)

const statistics = ref({
  households: 2456,
  population: 8932,
  male: 4567,
  female: 4365
})

const populationTrend = ref(2.3)
const economyTrend = ref(5.8)

const populationStructure = ref([
  { label: '0-14岁', value: 18, color: '#00ffff' },
  { label: '15-59岁', value: 65, color: '#00ccff' },
  { label: '60岁+', value: 17, color: '#0099ff' }
])

const agricultureData = ref([
  { label: '耕地', value: '502.51万', percentage: 85, color: '#ff6b6b' },
  { label: '林地', value: '258.77万', percentage: 52, color: '#4ecdc4' },
  { label: '草地', value: '277.36万', percentage: 55, color: '#ffe66d' },
  { label: '水面', value: '12.8万', percentage: 3, color: '#95e1d3' }
])

const householdTypes = ref([
  { label: '一般户', count: 1856, percentage: 75.6, color: '#00ffff' },
  { label: '脱贫户', count: 320, percentage: 13.0, color: '#00ff00' },
  { label: '监测户', count: 156, percentage: 6.4, color: '#ffff00' },
  { label: '低保户', count: 86, percentage: 3.5, color: '#ff00ff' },
  { label: '五保户', count: 28, percentage: 1.1, color: '#ff6600' },
  { label: '优抚户', count: 10, percentage: 0.4, color: '#ff0000' }
])

const totalHouseholds = computed(() => {
  return householdTypes.value.reduce((sum, item) => sum + item.count, 0)
})

const householdPieData = computed(() => {
  let startAngle = 0
  return householdTypes.value.map(item => {
    const angle = (item.percentage / 100) * 360
    const endAngle = startAngle + angle
    const data = {
      startAngle,
      endAngle,
      color: item.color
    }
    startAngle = endAngle
    return data
  })
})

const economyTabs = [
  { id: 'year', name: '本年' },
  { id: 'lastYear', name: '上年' }
]

const yearIncome = ref([
  { label: '工资性收入', value: 1258000 },
  { label: '经营性收入', value: 895000 },
  { label: '财产性收入', value: 126000 },
  { label: '转移性收入', value: 658000 },
  { label: '其他收入', value: 89000 },
  { label: '总计', value: 3026000 }
])

const lastYearIncome = ref([
  { label: '工资性收入', value: 1125000 },
  { label: '经营性收入', value: 786000 },
  { label: '财产性收入', value: 112000 },
  { label: '转移性收入', value: 589000 },
  { label: '其他收入', value: 76000 },
  { label: '总计', value: 2688000 }
])

const currentEconomyData = computed(() => {
  return activeEconomyTab.value === 'year' ? yearIncome.value : lastYearIncome.value
})

const miniChartData = ref([25, 38, 45, 62, 55, 78])

const taskStats = ref({
  total: 156,
  pending: 23,
  processing: 68,
  completed: 65
})

const recentTasks = ref([
  { title: '乡村道路改造项目', time: '2024-05-18', progress: 75, status: 'processing' },
  { title: '灌溉设施维护', time: '2024-05-17', progress: 45, status: 'processing' },
  { title: '文化广场建设', time: '2024-05-16', progress: 100, status: 'completed' },
  { title: '农田水利修复', time: '2024-05-15', progress: 20, status: 'pending' }
])

const warningStats = ref({
  total: 5,
  income: 2,
  health: 1,
  other: 2
})

const warningCards = ref([
  { type: 'income', icon: '📉', count: warningStats.value.income, label: '收入异常' },
  { type: 'health', icon: '🏥', count: warningStats.value.health, label: '健康预警' },
  { type: 'other', icon: '⚠️', count: warningStats.value.other, label: '其他预警' }
])

const warningList = ref([
  { type: 'income', typeText: '收入异常', desc: '张三户收入环比下降30%', time: '10分钟前' },
  { type: 'health', typeText: '健康预警', desc: '李四健康状况需关注', time: '30分钟前' },
  { type: 'other', typeText: '其他预警', desc: '王五户需走访', time: '1小时前' }
])

const facilityData = ref([
  { label: '育肥圈', value: '1256m²' },
  { label: '饲料间', value: '890m²' },
  { label: '储草间', value: '650m²' },
  { label: '棚圈', value: '2340m²' }
])

const pyramidColors = ['#00ffff', '#00ccff', '#0099ff', '#0066ff']

const livestockData = ref([
  { name: '羊', count: 8560, icon: '🐑' },
  { name: '牛', count: 1256, icon: '🐄' },
  { name: '猪', count: 3256, icon: '🐖' },
  { name: '鸡', count: 15680, icon: '🐔' },
  { name: '鸭', count: 4580, icon: '🦆' }
])

const areaData = ref([
  { name: '光明镇', label: '光明', count: 856, population: 3256, color: '#00ffff' },
  { name: '敖包村', label: '敖包', count: 423, population: 1568, color: '#00ccff' },
  { name: '北山村', label: '北山', count: 389, population: 1456, color: '#00ccff' },
  { name: '塔拉村', label: '塔拉', count: 298, population: 1086, color: '#0099ff' },
  { name: '红旗村', label: '红旗', count: 256, population: 926, color: '#0099ff' },
  { name: '幸福村', label: '幸福', count: 234, population: 846, color: '#0066ff' }
])

const gridClass = computed(() => {
  const width = window.innerWidth
  if (width >= 1920) return 'large-screen'
  if (width >= 1200) return 'medium-screen'
  return 'small-screen'
})

const getRingDash = (percentage) => {
  const circumference = 2 * Math.PI * 32
  const filled = (percentage / 100) * circumference
  return `${filled} ${circumference - filled}`
}

const getPiePath = (startAngle, endAngle) => {
  const startRad = ((startAngle - 90) * Math.PI) / 180
  const endRad = ((endAngle - 90) * Math.PI) / 180
  const x1 = 90 + 60 * Math.cos(startRad)
  const y1 = 90 + 60 * Math.sin(startRad)
  const x2 = 90 + 60 * Math.cos(endRad)
  const y2 = 90 + 60 * Math.sin(endRad)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M 90 90 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`
}

const formatCurrency = (value) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  }
  return value.toLocaleString()
}

const getAreaData = (name) => {
  return areaData.value.find(item => item.name === name)
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const animateNumbers = () => {
  const duration = 2000
  const steps = 60
  const interval = duration / steps
  
  let step = 0
  const timer = setInterval(() => {
    step++
    const progress = step / steps
    const eased = 1 - Math.pow(1 - progress, 3)
    
    animatedHouseholds.value = Math.round(statistics.value.households * eased)
    animatedPopulation.value = Math.round(statistics.value.population * eased)
    animatedMale.value = Math.round(statistics.value.male * eased)
    animatedFemale.value = Math.round(statistics.value.female * eased)
    
    if (step >= steps) {
      clearInterval(timer)
    }
  }, interval)
}

const updateDynamicData = () => {
  miniChartData.value = miniChartData.value.map(v => {
    const change = (Math.random() - 0.5) * 10
    return Math.max(20, Math.min(80, v + change))
  })
  
  taskStats.value.processing = Math.max(0, taskStats.value.processing + Math.floor((Math.random() - 0.5) * 5))
  taskStats.value.completed = Math.max(0, taskStats.value.completed + Math.floor((Math.random() - 0.3) * 3))
}

let timeTimer = null
let dataTimer = null

onMounted(() => {
  updateTime()
  animateNumbers()
  timeTimer = setInterval(updateTime, 1000)
  dataTimer = setInterval(updateDynamicData, 5000)
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
  if (dataTimer) clearInterval(dataTimer)
})

watch(gridClass, () => {
  animateNumbers()
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #0d1f35 50%, #0a1628 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 30px;
  background: linear-gradient(90deg, rgba(0, 100, 150, 0.4) 0%, rgba(0, 150, 200, 0.3) 50%, rgba(0, 100, 150, 0.4) 100%);
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.region-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 255, 255, 0.15);
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.region-icon {
  font-size: 16px;
}

.region-name {
  font-size: 16px;
  color: #00ffff;
  font-weight: bold;
}

.date-text {
  font-size: 14px;
  color: #999;
}

.header-center {
  text-align: center;
}

.dashboard-title {
  font-size: 32px;
  color: #00ffff;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
  margin: 0 0 5px;
  letter-spacing: 2px;
}

.title-sub {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #00ff00;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 14px;
  color: #00ff00;
}

.current-time {
  font-size: 24px;
  color: #fff;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.screen-btn {
  padding: 10px 20px;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.5);
  color: #00ffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.screen-btn:hover {
  background: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  height: calc(100vh - 180px);
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
  background: rgba(5, 20, 40, 0.85);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.08);
  transition: all 0.3s;
}

.grid-panel:hover {
  border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.15);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(90deg, rgba(0, 100, 150, 0.5) 0%, rgba(0, 150, 200, 0.4) 100%);
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.panel-icon {
  font-size: 20px;
  margin-right: 10px;
}

.panel-title {
  font-size: 16px;
  color: #00ffff;
  font-weight: bold;
  flex: 1;
}

.panel-badge {
  padding: 4px 12px;
  background: rgba(0, 255, 0, 0.2);
  border-radius: 15px;
  font-size: 12px;
  color: #00ff00;
}

.panel-badge.positive {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.panel-badge.negative {
  background: rgba(255, 100, 100, 0.2);
  color: #ff6b6b;
}

.alert-badge {
  padding: 4px 12px;
  background: rgba(255, 100, 100, 0.3);
  border-radius: 15px;
  font-size: 12px;
  color: #ff6b6b;
  font-weight: bold;
}

.panel-body {
  padding: 15px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 50, 100, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.15);
}

.stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.stat-icon.bg-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.bg-green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.bg-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.bg-pink {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.chart-section {
  margin-top: 15px;
}

.chart-title {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 80px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.bar-wrapper {
  width: 40px;
  height: 60px;
  background: rgba(0, 50, 100, 0.4);
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 5px 5px 0 0;
  transition: height 0.8s ease;
}

.bar-label {
  font-size: 11px;
  color: #999;
}

.bar-value {
  font-size: 11px;
  color: #00ffff;
  font-weight: bold;
}

.ring-chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.ring-item {
  text-align: center;
}

.ring-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 8px;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.animate-ring {
  animation: ringProgress 1.5s ease-out forwards;
}

@keyframes ringProgress {
  from { stroke-dasharray: 0 201; }
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-value {
  font-size: 12px;
  color: #fff;
  font-weight: bold;
}

.ring-label {
  font-size: 12px;
  color: #999;
}

.pie-chart-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 15px;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-slice {
  transition: opacity 0.3s;
}

.pie-slice:hover {
  opacity: 0.8;
}

.pie-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-total {
  display: block;
  font-size: 24px;
  color: #00ffff;
  font-weight: bold;
}

.pie-label {
  font-size: 12px;
  color: #999;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-text {
  flex: 1;
  font-size: 12px;
  color: #ccc;
}

.legend-value {
  font-size: 12px;
  color: #00ffff;
}

.economy-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tab-btn {
  padding: 8px 16px;
  background: rgba(0, 100, 150, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #999;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.tab-btn.active {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  border-color: #00ffff;
}

.income-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 15px;
}

.income-item {
  text-align: center;
  padding: 10px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 8px;
}

.income-label {
  display: block;
  font-size: 11px;
  color: #999;
  margin-bottom: 5px;
}

.income-value {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.income-value.highlight {
  color: #00ff00;
}

.mini-chart {
  height: 60px;
  position: relative;
}

.chart-line {
  position: relative;
  height: 100%;
}

.chart-point {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.point-dot {
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ffff;
}

.point-line {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, #00ffff, transparent);
  margin-top: 5px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 10px;
  color: #666;
}

.task-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 10px;
}

.task-stat-item {
  text-align: center;
}

.task-stat-value {
  display: block;
  font-size: 20px;
  color: #00ffff;
  font-weight: bold;
}

.task-stat-value.pending {
  color: #ffaa00;
}

.task-stat-value.processing {
  color: #00ccff;
}

.task-stat-value.completed {
  color: #00ff00;
}

.task-stat-label {
  font-size: 12px;
  color: #999;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(0, 50, 100, 0.2);
  border-radius: 8px;
}

.task-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.task-status.pending {
  background: #ffaa00;
}

.task-status.processing {
  background: #00ccff;
  animation: blink 1s infinite;
}

.task-status.completed {
  background: #00ff00;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.task-info {
  flex: 1;
}

.task-title {
  display: block;
  font-size: 13px;
  color: #fff;
  margin-bottom: 3px;
}

.task-time {
  font-size: 11px;
  color: #666;
}

.task-progress {
  width: 80px;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 50, 100, 0.5);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 3px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #00ff00);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 11px;
  color: #00ffff;
}

.warning-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.warning-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border-radius: 10px;
}

.warning-card.income {
  background: rgba(255, 100, 100, 0.15);
  border: 1px solid rgba(255, 100, 100, 0.3);
}

.warning-card.health {
  background: rgba(255, 200, 100, 0.15);
  border: 1px solid rgba(255, 200, 100, 0.3);
}

.warning-card.other {
  background: rgba(255, 255, 100, 0.15);
  border: 1px solid rgba(255, 255, 100, 0.3);
}

.warning-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.warning-content {
  text-align: center;
}

.warning-count {
  display: block;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

.warning-label {
  font-size: 11px;
  color: #999;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(0, 50, 100, 0.2);
  border-radius: 8px;
}

.warning-tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.warning-tag.income {
  background: rgba(255, 100, 100, 0.2);
  color: #ff6b6b;
}

.warning-tag.health {
  background: rgba(255, 200, 100, 0.2);
  color: #ffaa00;
}

.warning-tag.other {
  background: rgba(255, 255, 100, 0.2);
  color: #ffff00;
}

.warning-desc {
  flex: 1;
  font-size: 12px;
  color: #ccc;
}

.warning-time {
  font-size: 11px;
  color: #666;
}

.farming-content {
  display: flex;
  gap: 20px;
}

.facility-section,
.livestock-section {
  flex: 1;
}

.section-title {
  font-size: 13px;
  color: #00ffff;
  margin-bottom: 15px;
  font-weight: bold;
}

.pyramid-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pyramid-svg {
  width: 120px;
  height: 140px;
}

.pyramid-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.livestock-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.livestock-item {
  text-align: center;
  padding: 10px 5px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 8px;
}

.livestock-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.livestock-name {
  display: block;
  font-size: 11px;
  color: #999;
  margin-bottom: 3px;
}

.livestock-count {
  font-size: 14px;
  color: #00ffff;
  font-weight: bold;
}

.map-container {
  position: relative;
  height: 100%;
}

.map-visual {
  height: 100%;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  height: 150px;
}

.map-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.map-cell:hover {
  transform: scale(1.05);
  border-color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.cell-label {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.cell-count {
  font-size: 20px;
  color: #00ffff;
  font-weight: bold;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.area-detail {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 15px;
  background: rgba(0, 50, 100, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  min-width: 150px;
}

.detail-header {
  font-size: 14px;
  color: #00ffff;
  font-weight: bold;
  margin-bottom: 10px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  color: #ccc;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .population-panel {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-title {
    font-size: 20px;
  }
  
  .current-time {
    font-size: 18px;
  }
}
</style>