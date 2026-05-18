<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-left">
        <span class="region-name">灏明县</span>
      </div>
      <div class="header-center">
        <h1 class="dashboard-title">乡村综合事务与数据管理平台</h1>
      </div>
      <div class="header-right">
        <span class="current-time">{{ currentTime }}</span>
        <button class="screen-btn">投屏</button>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="grid-item large-row">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">👥</span>
            <span class="panel-title">人口分布</span>
          </div>
          <div class="panel-body">
            <div class="stats-row">
              <div class="stat-card">
                <span class="stat-label">户数</span>
                <span class="stat-value">{{ statistics.households }}</span>
                <span class="stat-unit">户</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">人口数</span>
                <span class="stat-value">{{ statistics.population }}</span>
                <span class="stat-unit">人</span>
              </div>
              <div class="stat-card male">
                <span class="stat-label">男</span>
                <span class="stat-value">{{ statistics.male }}</span>
                <span class="stat-unit">人</span>
              </div>
              <div class="stat-card female">
                <span class="stat-label">女</span>
                <span class="stat-value">{{ statistics.female }}</span>
                <span class="stat-unit">人</span>
              </div>
            </div>
            <div class="table-section">
              <div class="table-row header-row">
                <span>政治面貌</span>
                <span>数量</span>
                <span>年龄分布</span>
                <span>数量</span>
                <span>健康状况</span>
                <span>数量</span>
              </div>
              <div class="table-row" v-for="(item, index) in populationData" :key="index">
                <span>{{ item.politicalStatus }}</span>
                <span>{{ item.politicalCount }}</span>
                <span>{{ item.ageRange }}</span>
                <span>{{ item.ageCount }}</span>
                <span>{{ item.healthStatus }}</span>
                <span>{{ item.healthCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">🌾</span>
            <span class="panel-title">农业用地</span>
          </div>
          <div class="panel-body">
            <div class="agriculture-grid">
              <div class="agriculture-item" v-for="(item, index) in agricultureData" :key="index">
                <div class="agri-ring">
                  <svg viewBox="0 0 100 100" class="ring-svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,255,255,0.1)" stroke-width="6"/>
                    <circle cx="50" cy="50" r="40" fill="none" :stroke="item.color" stroke-width="6" 
                            :stroke-dasharray="getRingDashArray(item.percentage)" stroke-linecap="round" transform="rotate(-90 50 50)"/>
                  </svg>
                  <div class="ring-value">{{ item.value }}</div>
                  <div class="ring-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">🏠</span>
            <span class="panel-title">户类型</span>
          </div>
          <div class="panel-body">
            <div class="chart-container">
              <div class="bar-chart">
                <div v-for="(item, index) in householdTypes" :key="index" class="bar-item">
                  <div class="bar-wrapper">
                    <div class="bar" :style="{ height: item.percentage + '%', backgroundColor: item.color }"></div>
                  </div>
                  <span class="bar-value">{{ item.count }}</span>
                  <span class="bar-label">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item large-col">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">💰</span>
            <span class="panel-title">家庭经济</span>
          </div>
          <div class="panel-body">
            <div class="economy-section">
              <div class="section-title">往年收支情况</div>
              <div class="economy-grid">
                <div v-for="(item, index) in previousYearIncome" :key="index" class="economy-item">
                  <span class="economy-label">{{ item.label }}</span>
                  <span class="economy-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
            <div class="economy-section">
              <div class="section-title">本年收支情况</div>
              <div class="economy-grid">
                <div v-for="(item, index) in currentYearIncome" :key="index" class="economy-item">
                  <span class="economy-label">{{ item.label }}</span>
                  <span class="economy-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">🌱</span>
            <span class="panel-title">种植业</span>
          </div>
          <div class="panel-body">
            <div class="crop-chart">
              <div v-for="(item, index) in cropData" :key="index" class="crop-row">
                <div class="crop-bar-container">
                  <div class="crop-bar" :style="{ width: item.value + '%', backgroundColor: item.color }"></div>
                </div>
                <span class="crop-name">{{ item.name }}</span>
              </div>
            </div>
            <div class="crop-labels">
              <span v-for="(item, index) in cropLabels" :key="index">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">📋</span>
            <span class="panel-title">工作动态</span>
          </div>
          <div class="panel-body">
            <div class="table-section small-table">
              <div class="table-row header-row">
                <span>事件摘要</span>
                <span>时间</span>
                <span>下达数</span>
                <span>待办数</span>
                <span>已办数</span>
                <span>超时数</span>
              </div>
              <div class="table-row" v-for="(item, index) in workDynamic" :key="index">
                <span>{{ item.summary }}</span>
                <span>{{ item.time }}</span>
                <span>{{ item.issued }}</span>
                <span>{{ item.pending }}</span>
                <span>{{ item.completed }}</span>
                <span>{{ item.overdue }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">⚠️</span>
            <span class="panel-title">监测预警</span>
          </div>
          <div class="panel-body">
            <div class="warning-stats">
              <div class="warning-item" v-for="(item, index) in warningStats" :key="index">
                <span class="warning-value">{{ item.value }}</span>
                <span class="warning-label">{{ item.label }}</span>
              </div>
            </div>
            <div class="table-section small-table">
              <div class="table-row header-row">
                <span>户号</span>
                <span>户主姓名</span>
                <span>预警类型</span>
                <span>预警信息</span>
              </div>
              <div class="table-row" v-for="(item, index) in warningList" :key="index">
                <span>{{ item.householdNo }}</span>
                <span>{{ item.name }}</span>
                <span>{{ item.type }}</span>
                <span>{{ item.info }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-item large-col">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-icon">🐑</span>
            <span class="panel-title">养殖业/设施</span>
          </div>
          <div class="panel-body">
            <div class="farming-container">
              <div class="farming-left">
                <div class="facility-tabs">
                  <button class="tab-btn active">养殖设施</button>
                  <button class="tab-btn">养殖业</button>
                </div>
                <div class="pyramid-chart">
                  <svg viewBox="0 0 200 200" class="pyramid-svg">
                    <polygon points="100,10 180,60 100,110 20,60" fill="#00ffff"/>
                    <polygon points="100,60 160,95 100,130 40,95" fill="#00ccff"/>
                    <polygon points="100,110 140,130 100,150 60,130" fill="#0099ff"/>
                    <polygon points="100,150 120,160 100,170 80,160" fill="#0066ff"/>
                    <text x="100" y="35" text-anchor="middle" fill="#fff" font-size="12">{{ facilityData[0].value }}</text>
                    <text x="100" y="85" text-anchor="middle" fill="#fff" font-size="12">{{ facilityData[1].value }}</text>
                    <text x="100" y="125" text-anchor="middle" fill="#fff" font-size="12">{{ facilityData[2].value }}</text>
                    <text x="100" y="160" text-anchor="middle" fill="#fff" font-size="12">{{ facilityData[3].value }}</text>
                  </svg>
                  <div class="pyramid-labels">
                    <div v-for="(item, index) in facilityData" :key="index" class="label-item">
                      <span class="label-color" :style="{ backgroundColor: item.color }"></span>
                      <span>{{ item.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="farming-right">
                <div class="livestock-grid">
                  <div class="livestock-card">
                    <div class="card-title">牧畜</div>
                    <div class="livestock-row" v-for="(item, index) in livestockData" :key="index">
                      <span class="livestock-name">{{ item.name }}</span>
                      <span class="livestock-count">{{ item.count }}</span>
                    </div>
                  </div>
                  <div class="livestock-card">
                    <div class="card-title">小五金</div>
                    <div class="livestock-row" v-for="(item, index) in hardwareData" :key="index">
                      <span class="livestock-name">{{ item.name }}</span>
                      <span class="livestock-count">{{ item.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

const statistics = ref({
  households: 2,
  population: 2,
  male: 2,
  female: 0
})

const populationData = ref([
  { politicalStatus: '党员', politicalCount: 2, ageRange: '0-14岁', ageCount: 0, healthStatus: '健康', healthCount: 2 },
  { politicalStatus: '群众', politicalCount: 0, ageRange: '15-59岁', ageCount: 2, healthStatus: '慢病', healthCount: 0 },
  { politicalStatus: '其他', politicalCount: 0, ageRange: '60-79岁', ageCount: 0, healthStatus: '残疾', healthCount: 0 },
  { politicalStatus: '', politicalCount: '', ageRange: '70-80岁', ageCount: 0, healthStatus: '大病', healthCount: 0 }
])

const agricultureData = ref([
  { label: '耕地', value: '502.51万亩', percentage: 80, color: '#ff6b6b' },
  { label: '林地', value: '258.77万亩', percentage: 50, color: '#4ecdc4' },
  { label: '退耕地', value: '0亩', percentage: 0, color: '#ffe66d' },
  { label: '水面', value: '0亩', percentage: 0, color: '#95e1d3' },
  { label: '草本场', value: '277.36万亩', percentage: 55, color: '#a29bfe' },
  { label: '林果', value: '0亩', percentage: 0, color: '#fd79a8' }
])

const householdTypes = ref([
  { label: '一般户', count: 2, percentage: 100, color: '#00ffff' },
  { label: '脱贫户', count: 0, percentage: 0, color: '#00ff00' },
  { label: '监测户', count: 0, percentage: 0, color: '#ffff00' },
  { label: '低保户', count: 0, percentage: 0, color: '#ff00ff' },
  { label: '五保户', count: 0, percentage: 0, color: '#ff6600' },
  { label: '重点优抚', count: 0, percentage: 0, color: '#ff0000' }
])

const previousYearIncome = ref([
  { label: '工资性收入', value: '0' },
  { label: '其他收入', value: '0' },
  { label: '资产收益/扶贫分红', value: '0' },
  { label: '低保金', value: '0' },
  { label: '其他财产性收入', value: '0' },
  { label: '转移性收入', value: '0' }
])

const currentYearIncome = ref([
  { label: '工资性收入', value: '0' },
  { label: '其他收入', value: '0' },
  { label: '资产收益/扶贫分红', value: '0' },
  { label: '低保金', value: '0' },
  { label: '其他财产性收入', value: '0' },
  { label: '转移性收入', value: '0' }
])

const cropData = ref([
  { name: '粮食作物', value: 0, color: '#00ffff' },
  { name: '经济作物', value: 0, color: '#00ff00' },
  { name: '林下经济', value: 0, color: '#ffff00' },
  { name: '中药材', value: 0, color: '#ff00ff' }
])

const cropLabels = ref(['南江乡', '想法乡', '兴塘镇', '团结镇', '古城乡', '繁华乡'])

const workDynamic = ref([
  { summary: '搬迁验收', time: '2024-04-01', issued: 1, pending: 1, completed: 0, overdue: 0 },
  { summary: '134', time: '2024-04-01', issued: 1, pending: 0, completed: 0, overdue: 0 },
  { summary: '基本任务', time: '2024-12-30', issued: 1, pending: 0, completed: 0, overdue: 0 },
  { summary: '基本任务状态', time: '2024-03-04', issued: 1, pending: 0, completed: 0, overdue: 0 },
  { summary: '大排查测试', time: '2024-01-15', issued: 2, pending: 0, completed: 2, overdue: 0 },
  { summary: '统计信息', time: '2024-01-15', issued: 2, pending: 0, completed: 2, overdue: 0 }
])

const warningStats = ref([
  { label: '低于监测户收入', value: '0户' },
  { label: '低于上年收入', value: '0户' },
  { label: '突发事件', value: '0户' }
])

const warningList = ref([
  { householdNo: '', name: '', type: '', info: '' }
])

const facilityData = ref([
  { label: '育肥圈', value: '2m²', color: '#00ffff' },
  { label: '饲料间', value: '0m²', color: '#00ccff' },
  { label: '储草间', value: '0m²', color: '#0099ff' },
  { label: '棚圈', value: '0m²', color: '#0066ff' }
])

const livestockData = ref([
  { name: '羊', count: 0 },
  { name: '牛', count: 0 },
  { name: '马', count: 0 },
  { name: '驴', count: 0 },
  { name: '骡', count: 0 },
  { name: '猪', count: 0 },
  { name: '鸡', count: 0 },
  { name: '鸭', count: 0 },
  { name: '鹅', count: 0 },
  { name: '其它', count: 0 }
])

const hardwareData = ref([
  { name: '小五金', count: 0 },
  { name: '铡草机', count: 0 },
  { name: '粉碎机', count: 0 },
  { name: '磨面机', count: 0 },
  { name: '榨油机', count: 0 },
  { name: '铡草机', count: 0 },
  { name: '水泵', count: 0 },
  { name: '柴油机', count: 0 },
  { name: '发电机', count: 0 },
  { name: '车', count: 0 }
])

const getRingDashArray = (percentage) => {
  const circumference = 2 * Math.PI * 40
  const filled = (percentage / 100) * circumference
  return `${filled} ${circumference - filled}`
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '/')
}

let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #0d1f35 50%, #0a1628 100%);
  padding: 20px;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 30px;
  background: linear-gradient(90deg, rgba(0,100,150,0.3) 0%, rgba(0,150,200,0.2) 50%, rgba(0,100,150,0.3) 100%);
  border-radius: 10px;
  border: 1px solid rgba(0,255,255,0.3);
}

.region-name {
  font-size: 18px;
  color: #00ffff;
  font-weight: bold;
}

.dashboard-title {
  font-size: 28px;
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0,255,255,0.5);
  margin: 0;
}

.current-time {
  font-size: 16px;
  color: #fff;
  margin-right: 15px;
}

.screen-btn {
  padding: 8px 16px;
  background: rgba(0,255,255,0.2);
  border: 1px solid rgba(0,255,255,0.5);
  color: #00ffff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.screen-btn:hover {
  background: rgba(0,255,255,0.4);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 15px;
}

.grid-item {
  grid-column: span 1;
  grid-row: span 1;
}

.grid-item.large-row {
  grid-row: span 1;
  grid-column: span 2;
}

.grid-item.large-col {
  grid-row: span 2;
  grid-column: span 1;
}

.panel {
  background: rgba(5, 20, 40, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(90deg, rgba(0, 100, 150, 0.4) 0%, rgba(0, 150, 200, 0.3) 100%);
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.panel-icon {
  font-size: 18px;
  margin-right: 10px;
}

.panel-title {
  font-size: 16px;
  color: #00ffff;
  font-weight: bold;
}

.panel-body {
  padding: 15px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 8px;
  margin: 0 5px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.stat-card.male {
  border-color: rgba(255, 100, 100, 0.5);
}

.stat-card.female {
  border-color: rgba(255, 150, 200, 0.5);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  color: #00ffff;
  font-weight: bold;
}

.stat-unit {
  font-size: 12px;
  color: #999;
  margin-left: 3px;
}

.table-section {
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 8px 5px;
  font-size: 12px;
  color: #ccc;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
}

.table-row.header-row {
  background: rgba(0, 100, 150, 0.3);
  color: #00ffff;
  font-weight: bold;
}

.small-table .table-row {
  grid-template-columns: repeat(6, 1fr);
  font-size: 11px;
}

.agriculture-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.agriculture-item {
  text-align: center;
}

.agri-ring {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.ring-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  color: #fff;
  text-align: center;
}

.ring-label {
  font-size: 12px;
  color: #999;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 150px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
}

.bar-wrapper {
  width: 30px;
  height: 100px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar {
  width: 100%;
  border-radius: 5px 5px 0 0;
  transition: height 0.5s ease;
}

.bar-value {
  font-size: 12px;
  color: #fff;
  margin-top: 5px;
}

.bar-label {
  font-size: 10px;
  color: #999;
}

.economy-section {
  margin-bottom: 15px;
}

.section-title {
  font-size: 13px;
  color: #00ffff;
  margin-bottom: 10px;
  padding-left: 5px;
  border-left: 3px solid #00ffff;
}

.economy-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
}

.economy-item {
  text-align: center;
  padding: 8px 5px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.1);
}

.economy-label {
  display: block;
  font-size: 10px;
  color: #999;
  margin-bottom: 5px;
}

.economy-value {
  font-size: 14px;
  color: #00ffff;
  font-weight: bold;
}

.crop-chart {
  margin-bottom: 15px;
}

.crop-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.crop-bar-container {
  flex: 1;
  height: 20px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
}

.crop-bar {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.crop-name {
  font-size: 12px;
  color: #ccc;
  width: 60px;
}

.crop-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #666;
}

.warning-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 50, 50, 0.1);
  border-radius: 8px;
}

.warning-item {
  text-align: center;
}

.warning-value {
  display: block;
  font-size: 20px;
  color: #ff6b6b;
  font-weight: bold;
}

.warning-label {
  font-size: 11px;
  color: #999;
}

.farming-container {
  display: flex;
  gap: 20px;
}

.farming-left {
  flex: 1;
}

.facility-tabs {
  display: flex;
  margin-bottom: 15px;
}

.tab-btn {
  padding: 8px 16px;
  background: rgba(0, 100, 150, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #999;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.tab-btn.active {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  border-bottom: none;
}

.pyramid-chart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pyramid-svg {
  width: 150px;
  height: 150px;
}

.pyramid-labels {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ccc;
}

.label-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.farming-right {
  flex: 1;
}

.livestock-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.livestock-card {
  background: rgba(0, 50, 100, 0.3);
  border-radius: 8px;
  padding: 10px;
}

.card-title {
  font-size: 13px;
  color: #00ffff;
  margin-bottom: 10px;
  font-weight: bold;
}

.livestock-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 11px;
  color: #ccc;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
}

.livestock-name {
  width: 60%;
}

.livestock-count {
  color: #00ffff;
}
</style>