<template>
  <div class="dashboard-container" ref="dashboardRef">
    <div class="dashboard-header">
      <div class="header-left">
        <div class="region-select">
          <span class="region-label">塔拉村</span>
          <span class="region-arrow">▼</span>
        </div>
      </div>
      <div class="header-center">
        <h1 class="dashboard-title">乡村综合事务与数据管理平台</h1>
      </div>
      <div class="header-right">
        <span class="current-time">{{ currentTime }}</span>
        <span class="current-date">{{ currentDate }}</span>
        <button class="screen-btn">投屏</button>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="grid-panel population-panel">
        <div class="panel-header">
          <span class="panel-title">人口分布</span>
        </div>
        <div class="panel-body">
          <div class="population-summary">
            <div class="summary-card male-card">
              <span class="summary-label">户数</span>
              <span class="summary-value">7户</span>
            </div>
            <div class="summary-card">
              <span class="summary-label">人口数</span>
              <span class="summary-value">13人</span>
            </div>
            <div class="summary-card male-card">
              <span class="summary-label">男</span>
              <span class="summary-value">8人</span>
            </div>
            <div class="summary-card female-card">
              <span class="summary-label">女</span>
              <span class="summary-value">5人</span>
            </div>
          </div>
          
          <div class="population-tables">
            <div class="table-section">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>政治面貌</th>
                    <th>数量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in politicalStatus" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="table-section">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>年龄分布</th>
                    <th>数量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in ageDistribution" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="table-section">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>健康状况</th>
                    <th>数量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in healthStatus" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel land-panel">
        <div class="panel-header">
          <span class="panel-title">农业用地</span>
        </div>
        <div class="panel-body">
          <div class="land-grid">
            <div v-for="(item, index) in landData" :key="index" class="land-card">
              <div class="land-ring">
                <svg viewBox="0 0 60 60" class="ring-svg">
                  <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="6"/>
                  <circle cx="30" cy="30" r="22" fill="none" :stroke="item.color" stroke-width="6"
                          :stroke-dasharray="getRingDash(item.percentage)" stroke-linecap="round" 
                          transform="rotate(-90 30 30)" class="animate-ring"/>
                </svg>
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
          <span class="panel-title">户类型</span>
        </div>
        <div class="panel-body">
          <div class="household-chart">
            <div v-for="(item, index) in householdData" :key="index" class="household-bar-item">
              <div class="household-bar-wrapper">
                <div class="household-bar" :style="{ height: item.value + 'px', backgroundColor: item.color }"></div>
              </div>
              <span class="household-label">{{ item.label }}</span>
              <span class="household-value">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel economy-panel">
        <div class="panel-header">
          <span class="panel-title">家庭经济</span>
        </div>
        <div class="panel-body">
          <div class="economy-section">
            <span class="section-title">往年收支情况</span>
            <div class="economy-bars">
              <div v-for="(item, index) in lastYearEconomy" :key="index" class="economy-bar-item">
                <span class="economy-label">{{ item.label }}</span>
                <div class="economy-bar-wrapper">
                  <div class="economy-bar" :style="{ width: item.value + '%' }"></div>
                </div>
                <span class="economy-value">{{ item.amount }}</span>
              </div>
            </div>
          </div>
          <div class="economy-section">
            <span class="section-title">本年收支情况</span>
            <div class="economy-bars">
              <div v-for="(item, index) in thisYearEconomy" :key="index" class="economy-bar-item">
                <span class="economy-label">{{ item.label }}</span>
                <div class="economy-bar-wrapper">
                  <div class="economy-bar" :style="{ width: item.value + '%' }"></div>
                </div>
                <span class="economy-value">{{ item.amount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel planting-panel">
        <div class="panel-header">
          <span class="panel-title">种植业</span>
          <div class="planting-legend">
            <span class="legend-item"><span class="legend-color" style="background: #00c8ff"></span>粮食作物</span>
            <span class="legend-item"><span class="legend-color" style="background: #ff6b6b"></span>经济作物</span>
            <span class="legend-item"><span class="legend-color" style="background: #4ecdc4"></span>林下经济</span>
            <span class="legend-item"><span class="legend-color" style="background: #ffe66d"></span>中药材</span>
          </div>
        </div>
        <div class="panel-body">
          <div class="planting-chart">
            <svg viewBox="0 0 300 150" class="planting-svg">
              <g v-for="(village, vIndex) in plantingData" :key="vIndex">
                <rect v-for="(crop, cIndex) in village.crops" :key="cIndex"
                      :x="vIndex * 60 + 10 + cIndex * 10"
                      :y="140 - crop.value * 1.2"
                      width="8"
                      :height="crop.value * 1.2"
                      :fill="crop.color"/>
              </g>
            </svg>
            <div class="planting-labels">
              <span v-for="village in plantingData" :key="village.name">{{ village.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-panel task-panel">
        <div class="panel-header">
          <span class="panel-title">工作动态</span>
        </div>
        <div class="panel-body">
          <table class="task-table">
            <thead>
              <tr>
                <th>事件摘要</th>
                <th>时间</th>
                <th>下达数</th>
                <th>待办数</th>
                <th>已办数</th>
                <th>超时数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in taskList" :key="task.id">
                <td>{{ task.summary }}</td>
                <td>{{ task.time }}</td>
                <td>{{ task.issued }}</td>
                <td>{{ task.pending }}</td>
                <td>{{ task.completed }}</td>
                <td>{{ task.overdue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-panel warning-panel">
        <div class="panel-header">
          <span class="panel-title">监测预警</span>
        </div>
        <div class="panel-body">
          <div class="warning-summary">
            <div class="warning-stat">
              <span class="warning-label">低于监测人均收入</span>
              <span class="warning-value">0户</span>
            </div>
            <div class="warning-stat">
              <span class="warning-label">低于上年度收入</span>
              <span class="warning-value">0户</span>
            </div>
            <div class="warning-stat">
              <span class="warning-label">突发事件</span>
              <span class="warning-value">2户</span>
            </div>
          </div>
          <table class="warning-table">
            <thead>
              <tr>
                <th>户号</th>
                <th>户主姓名</th>
                <th>预警类型</th>
                <th>预警信息</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="warning in warningList" :key="warning.id">
                <td>{{ warning.id }}</td>
                <td>{{ warning.name }}</td>
                <td>{{ warning.type }}</td>
                <td>{{ warning.info }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-panel livestock-panel">
        <div class="panel-header">
          <span class="panel-title">养殖业/设施</span>
          <div class="livestock-tabs">
            <button class="tab-btn active">养殖设施</button>
            <button class="tab-btn">养殖业</button>
          </div>
        </div>
        <div class="panel-body">
          <div class="facility-section">
            <div class="pyramid-chart">
              <svg viewBox="0 0 200 150" class="pyramid-svg">
                <polygon points="100,10 180,50 100,90 20,50" fill="#00c8ff"/>
                <polygon points="100,50 160,80 100,110 40,80" fill="#4ecdc4"/>
                <polygon points="100,90 140,115 100,140 60,115" fill="#ffe66d"/>
                <text x="100" y="40" text-anchor="middle" fill="white" font-size="12">{{ facilityData[0].value }}</text>
                <text x="100" y="85" text-anchor="middle" fill="white" font-size="12">{{ facilityData[1].value }}</text>
                <text x="100" y="125" text-anchor="middle" fill="white" font-size="12">{{ facilityData[2].value }}</text>
              </svg>
              <div class="pyramid-labels">
                <span>{{ facilityData[0].label }}</span>
                <span>{{ facilityData[1].label }}</span>
                <span>{{ facilityData[2].label }}</span>
              </div>
            </div>
          </div>
          <div class="livestock-section">
            <table class="livestock-table">
              <thead>
                <tr>
                  <th>牧畜</th>
                  <th>羊</th>
                  <th>牛</th>
                  <th>猪</th>
                  <th>驴</th>
                  <th>其它</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in livestockData" :key="item.type">
                  <td>{{ item.type }}</td>
                  <td>{{ item.sheep }}</td>
                  <td>{{ item.cow }}</td>
                  <td>{{ item.pig }}</td>
                  <td>{{ item.donkey }}</td>
                  <td>{{ item.other }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dashboardRef = ref(null)
const currentTime = ref('')
const currentDate = ref('')

const politicalStatus = ref([
  { name: '党员', value: 0 },
  { name: '团员', value: 0 },
  { name: '群众', value: 13 },
  { name: '其他', value: 0 }
])

const ageDistribution = ref([
  { name: '0-14岁', value: 3 },
  { name: '15-59岁', value: 9 },
  { name: '60-70岁', value: 0 },
  { name: '70-80岁', value: 1 }
])

const healthStatus = ref([
  { name: '健康', value: 10 },
  { name: '大病', value: 1 },
  { name: '残疾', value: 0 }
])

const landData = ref([
  { label: '耕地', value: '1141.6亩', percentage: 80, color: '#ff6b6b' },
  { label: '林地', value: '1161.96亩', percentage: 75, color: '#4ecdc4' },
  { label: '退耕还林', value: '25.5亩', percentage: 20, color: '#ffe66d' },
  { label: '水面', value: '35.26亩', percentage: 30, color: '#95e1d3' },
  { label: '灌木林', value: '2.02万亩', percentage: 60, color: '#a8e6cf' },
  { label: '林果', value: '16.63亩', percentage: 40, color: '#ffd3a5' }
])

const householdData = ref([
  { label: '一般户', count: 5, value: 150, color: '#00c8ff' },
  { label: '脱贫户', count: 0, value: 0, color: '#ffe66d' },
  { label: '边缘易致贫户', count: 0, value: 0, color: '#4ecdc4' },
  { label: '已消除风险边缘户', count: 1, value: 50, color: '#ff9ff3' },
  { label: '未消除风险边缘户', count: 1, value: 50, color: '#ff9ff3' },
  { label: '监测户', count: 0, value: 0, color: '#ff6b6b' }
])

const lastYearEconomy = ref([
  { label: '工资收入', value: 0, amount: 0 },
  { label: '其他收入', value: 0, amount: 0 },
  { label: '资产收益扶贫分红收入', value: 0, amount: 0 },
  { label: '低保金', value: 0, amount: 0 },
  { label: '其他财产性收入', value: 0, amount: 0 },
  { label: '转移性收入', value: 0, amount: 0 }
])

const thisYearEconomy = ref([
  { label: '工资收入', value: 0, amount: 0 },
  { label: '其他收入', value: 0, amount: 0 },
  { label: '资产收益扶贫分红收入', value: 0, amount: 0 },
  { label: '低保金', value: 0, amount: 0 },
  { label: '其他财产性收入', value: 0, amount: 0 },
  { label: '转移性收入', value: 30, amount: 363 }
])

const plantingData = ref([
  { name: '哈拉霍落', crops: [{ value: 0, color: '#00c8ff' }, { value: 0, color: '#ff6b6b' }, { value: 0, color: '#4ecdc4' }, { value: 0, color: '#ffe66d' }] },
  { name: '哈拉沟中', crops: [{ value: 0, color: '#00c8ff' }, { value: 0, color: '#ff6b6b' }, { value: 0, color: '#4ecdc4' }, { value: 0, color: '#ffe66d' }] },
  { name: '哈拉沟村', crops: [{ value: 0, color: '#00c8ff' }, { value: 0, color: '#ff6b6b' }, { value: 0, color: '#4ecdc4' }, { value: 0, color: '#ffe66d' }] },
  { name: '哈拉北', crops: [{ value: 0, color: '#00c8ff' }, { value: 0, color: '#ff6b6b' }, { value: 0, color: '#4ecdc4' }, { value: 0, color: '#ffe66d' }] }
])

const taskList = ref([
  { id: 1, summary: '', time: '', issued: '', pending: '', completed: '', overdue: '' }
])

const warningList = ref([
  { id: '66678', name: '尕铁', type: '突发事件', info: '因病' },
  { id: '66678', name: '尕铁', type: '突发事件', info: '因病' },
  { id: '66678', name: '尕铁', type: '突发事件', info: '因病' },
  { id: '66678', name: '尕铁', type: '突发事件', info: '因病' }
])

const facilityData = ref([
  { label: '青贮窖', value: '101.17m²' },
  { label: '储草棚', value: '95.6m²' },
  { label: '暖棚', value: '66m²' },
  { label: '棚圈', value: '0m²' }
])

const livestockData = ref([
  { type: '羊', sheep: 0, cow: 0, pig: 0, donkey: 0, other: 0 },
  { type: '牛', sheep: 0, cow: 0, pig: 0, donkey: 0, other: 0 },
  { type: '猪', sheep: 0, cow: 0, pig: 0, donkey: 0, other: 0 },
  { type: '驴', sheep: 0, cow: 0, pig: 0, donkey: 0, other: 0 },
  { type: '其它', sheep: 0, cow: 0, pig: 0, donkey: 0, other: 0 }
])

const getRingDash = (percentage) => {
  const circumference = 2 * Math.PI * 22
  const dashLength = (percentage / 100) * circumference
  return `${dashLength} ${circumference - dashLength}`
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN')
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
  padding: 15px 30px;
  background: linear-gradient(90deg, #0d1f35 0%, #1a3a5c 50%, #0d1f35 100%);
  border: 2px solid #00c8ff;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #00c8ff, transparent);
}

.header-left {
  display: flex;
  align-items: center;
}

.region-select {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 200, 255, 0.1);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 20px;
  color: #00c8ff;
  font-size: 14px;
}

.region-arrow {
  font-size: 10px;
}

.header-center {
  text-align: center;
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  color: #00c8ff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #fff;
}

.current-time {
  font-size: 20px;
  font-weight: bold;
  color: #00c8ff;
  font-family: 'Courier New', monospace;
}

.current-date {
  font-size: 14px;
  color: #8892a6;
}

.screen-btn {
  padding: 8px 20px;
  background: rgba(0, 200, 255, 0.2);
  border: 1px solid #00c8ff;
  border-radius: 4px;
  color: #00c8ff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.screen-btn:hover {
  background: rgba(0, 200, 255, 0.4);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 15px;
}

.grid-panel {
  background: linear-gradient(145deg, rgba(13, 31, 53, 0.9), rgba(20, 45, 70, 0.8));
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.grid-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00c8ff, transparent);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(0, 200, 255, 0.05);
  border-bottom: 1px solid rgba(0, 200, 255, 0.2);
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #00c8ff;
  position: relative;
}

.panel-title::before,
.panel-title::after {
  content: '◆';
  color: #00c8ff;
  font-size: 10px;
  margin: 0 8px;
}

.panel-body {
  padding: 15px;
}

.economy-panel {
  grid-column: span 2;
}

.population-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.summary-card {
  background: rgba(0, 200, 255, 0.1);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.summary-card.male-card {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.summary-card.female-card {
  background: rgba(255, 153, 243, 0.1);
  border-color: rgba(255, 153, 243, 0.3);
}

.summary-label {
  display: block;
  font-size: 12px;
  color: #8892a6;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.population-tables {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.data-table {
  width: 100%;
  font-size: 11px;
  border-collapse: collapse;
}

.data-table th {
  background: rgba(0, 200, 255, 0.1);
  color: #00c8ff;
  padding: 5px;
  text-align: center;
  border: 1px solid rgba(0, 200, 255, 0.2);
}

.data-table td {
  padding: 5px;
  text-align: center;
  color: #b8c4d4;
  border: 1px solid rgba(0, 200, 255, 0.1);
}

.land-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.land-card {
  text-align: center;
}

.land-ring {
  margin-bottom: 8px;
}

.ring-svg {
  width: 60px;
  height: 60px;
}

.animate-ring {
  animation: ring-animation 2s ease-out forwards;
}

@keyframes ring-animation {
  from {
    stroke-dasharray: 0 138.23;
  }
}

.land-value {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.land-label {
  font-size: 11px;
  color: #8892a6;
}

.household-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 180px;
  padding-top: 20px;
}

.household-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.household-bar-wrapper {
  height: 150px;
  width: 25px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
}

.household-bar {
  width: 100%;
  border-radius: 4px;
  transition: height 0.5s ease-out;
}

.household-label {
  font-size: 10px;
  color: #8892a6;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.household-value {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.economy-section {
  margin-bottom: 15px;
}

.section-title {
  font-size: 12px;
  color: #00c8ff;
  margin-bottom: 10px;
  display: block;
}

.economy-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.economy-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.economy-label {
  width: 140px;
  font-size: 11px;
  color: #b8c4d4;
}

.economy-bar-wrapper {
  flex: 1;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.economy-bar {
  height: 100%;
  background: linear-gradient(90deg, #00c8ff, #0088cc);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.economy-value {
  width: 60px;
  font-size: 11px;
  color: #00c8ff;
  text-align: right;
}

.planting-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #b8c4d4;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.planting-chart {
  padding-top: 20px;
}

.planting-svg {
  width: 100%;
  height: 120px;
}

.planting-labels {
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
}

.planting-labels span {
  font-size: 11px;
  color: #8892a6;
}

.task-table,
.warning-table,
.livestock-table {
  width: 100%;
  font-size: 11px;
  border-collapse: collapse;
}

.task-table th,
.warning-table th,
.livestock-table th {
  background: rgba(0, 200, 255, 0.1);
  color: #00c8ff;
  padding: 6px;
  text-align: center;
  border: 1px solid rgba(0, 200, 255, 0.2);
  font-weight: normal;
}

.task-table td,
.warning-table td,
.livestock-table td {
  padding: 6px;
  text-align: center;
  color: #b8c4d4;
  border: 1px solid rgba(0, 200, 255, 0.1);
}

.warning-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.warning-stat {
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 4px;
}

.warning-label {
  display: block;
  font-size: 11px;
  color: #ff6b6b;
  margin-bottom: 5px;
}

.warning-value {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
}

.livestock-tabs {
  display: flex;
  gap: 10px;
}

.tab-btn {
  padding: 5px 15px;
  background: transparent;
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 4px;
  color: #8892a6;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.tab-btn.active {
  background: rgba(0, 200, 255, 0.2);
  color: #00c8ff;
  border-color: #00c8ff;
}

.facility-section {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.pyramid-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pyramid-svg {
  width: 200px;
  height: 150px;
}

.pyramid-labels {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 10px;
}

.pyramid-labels span {
  font-size: 11px;
  color: #8892a6;
}

@media (max-width: 1600px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .economy-panel {
    grid-column: span 2;
  }
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .economy-panel {
    grid-column: span 1;
  }
}
</style>