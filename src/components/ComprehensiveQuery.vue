<template>
  <div class="comprehensive-query">
    <el-tabs v-model="activeTab" type="card" class="query-tabs">
      <el-tab-pane label="全局搜索" name="global">
        <div class="global-search-page">
          <div class="search-center">
            <div class="search-box-wrapper">
              <el-input
                v-model="searchKeyword"
                placeholder="输入关键词搜索（姓名、身份证号、项目名称、资产编号等）"
                class="global-search-input"
                @input="handleSearchInput"
                @keyup.enter="handleGlobalSearch"
              >
                <template #append>
                  <el-button type="primary" @click="handleGlobalSearch">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
              <div v-if="searchSuggestions.length > 0" class="search-suggestions">
                <div
                  v-for="item in searchSuggestions"
                  :key="item.id"
                  class="suggestion-item"
                  @click="selectSuggestion(item)"
                >
                  <el-icon :size="16" class="suggestion-icon">{{ item.icon }}</el-icon>
                  <span class="suggestion-text">{{ item.text }}</span>
                  <span class="suggestion-type">{{ item.type }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quick-entries">
            <h3 class="section-title">快捷查询入口</h3>
            <div class="entry-grid">
              <div class="entry-card" @click="switchToTab('person')">
                <div class="entry-icon user-icon">
                  <el-icon><User /></el-icon>
                </div>
                <div class="entry-name">查人</div>
                <div class="entry-desc">村民、人才信息</div>
              </div>
              <div class="entry-card" @click="switchToTab('asset')">
                <div class="entry-icon asset-icon">
                  <el-icon><Home /></el-icon>
                </div>
                <div class="entry-name">查房</div>
                <div class="entry-desc">宅基地、资产</div>
              </div>
              <div class="entry-card" @click="switchToTab('finance')">
                <div class="entry-icon finance-icon">
                  <el-icon><Wallet /></el-icon>
                </div>
                <div class="entry-name">查钱</div>
                <div class="entry-desc">收支、补贴</div>
              </div>
              <div class="entry-card" @click="switchToTab('task')">
                <div class="entry-icon task-icon">
                  <el-icon><ListChecks /></el-icon>
                </div>
                <div class="entry-name">查事</div>
                <div class="entry-desc">任务、项目</div>
              </div>
            </div>
          </div>

          <div class="search-history">
            <div class="history-header">
              <h3 class="section-title">搜索历史</h3>
              <span class="clear-history" @click="clearHistory">清除历史</span>
            </div>
            <div v-if="searchHistory.length > 0" class="history-tags">
              <span
                v-for="(item, index) in searchHistory.slice(0, 10)"
                :key="index"
                class="history-tag"
                @click="searchKeyword = item; handleGlobalSearch()"
              >
                <el-icon><History /></el-icon>
                {{ item }}
              </span>
            </div>
            <div v-else class="empty-history">暂无搜索记录</div>
          </div>

          <div class="hot-search">
            <h3 class="section-title">热门搜索</h3>
            <div class="hot-tags">
              <span
                v-for="(item, index) in hotSearchWords"
                :key="index"
                class="hot-tag"
                :class="{ 'hot-tag-hot': index < 3 }"
                @click="searchKeyword = item.word; handleGlobalSearch()"
              >
                <span class="hot-rank">{{ index + 1 }}</span>
                {{ item.word }}
                <span class="hot-count">{{ item.count }}次</span>
              </span>
            </div>
          </div>

          <div v-if="globalSearchResults.length > 0" class="search-results">
            <h3 class="section-title">搜索结果</h3>
            <div v-for="group in globalSearchResults" :key="group.type" class="result-group">
              <h4 class="group-title">
                <el-icon>{{ group.icon }}</el-icon>
                {{ group.label }}
                <span class="group-count">共{{ group.items.length }}条</span>
              </h4>
              <div class="result-list">
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  class="result-item"
                  @click="viewDetail(item, group.type)"
                >
                  <div class="result-info">
                    <div class="result-title">{{ item.title }}</div>
                    <div class="result-desc">{{ item.desc }}</div>
                  </div>
                  <el-icon class="result-arrow"><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="查人" name="person">
        <div class="person-query-page">
          <div class="filter-section">
            <el-form :model="personFilter" class="filter-form">
              <div class="filter-row">
                <el-form-item label="姓名">
                  <el-input v-model="personFilter.name" placeholder="请输入姓名" class="filter-input" />
                </el-form-item>
                <el-form-item label="身份证号">
                  <el-input v-model="personFilter.idCard" placeholder="请输入身份证号" class="filter-input" />
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="personFilter.phone" placeholder="请输入手机号" class="filter-input" />
                </el-form-item>
                <el-form-item label="所属网格">
                  <el-select v-model="personFilter.grid" placeholder="请选择" class="filter-select">
                    <el-option label="全部" value="" />
                    <el-option label="第一网格" value="grid1" />
                    <el-option label="第二网格" value="grid2" />
                    <el-option label="第三网格" value="grid3" />
                  </el-select>
                </el-form-item>
                <el-form-item label="政治面貌">
                  <el-select v-model="personFilter.politicalStatus" placeholder="请选择" class="filter-select">
                    <el-option label="全部" value="" />
                    <el-option label="党员" value="party" />
                    <el-option label="群众" value="mass" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="filter-row">
                <el-form-item label="特殊标签">
                  <div class="checkbox-group">
                    <label v-for="tag in personTags" :key="tag.value" class="checkbox-item">
                      <input type="checkbox" v-model="personFilter.tags" :value="tag.value" />
                      <span>{{ tag.label }}</span>
                    </label>
                  </div>
                </el-form-item>
              </div>
              <div class="filter-actions">
                <el-button type="primary" @click="queryPerson">查询</el-button>
                <el-button @click="resetPersonFilter">重置</el-button>
                <el-button type="text" @click="showAdvancedFilter = !showAdvancedFilter">
                  {{ showAdvancedFilter ? '收起' : '高级筛选' }}
                </el-button>
              </div>
            </el-form>

            <div v-if="showAdvancedFilter" class="advanced-filter">
              <el-form :model="personAdvancedFilter" class="advanced-form">
                <div class="filter-row">
                  <el-form-item label="年龄范围">
                    <el-input-number v-model="personAdvancedFilter.minAge" :min="0" :max="150" />
                    <span>至</span>
                    <el-input-number v-model="personAdvancedFilter.maxAge" :min="0" :max="150" />
                  </el-form-item>
                  <el-form-item label="逻辑关系">
                    <el-select v-model="personAdvancedFilter.logic" class="filter-select">
                      <el-option label="且" value="and" />
                      <el-option label="或" value="or" />
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>

          <div class="result-section">
            <div class="result-header">
              <span class="result-count">共{{ personResults.length }}条记录</span>
              <div class="result-actions">
                <el-button type="text" @click="showColumnSelector = !showColumnSelector">自定义列</el-button>
                <el-button type="primary" @click="exportPersonData">导出Excel</el-button>
              </div>
            </div>

            <el-table :data="personResults" border class="query-table">
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="age" label="年龄" />
              <el-table-column prop="phone" label="联系电话" />
              <el-table-column prop="address" label="家庭住址" />
              <el-table-column prop="grid" label="所属网格" />
              <el-table-column label="标签">
                <template #default="scope">
                  <span
                    v-for="tag in scope.row.tags"
                    :key="tag"
                    class="tag-badge"
                    :class="getTagClass(tag)"
                  >
                    {{ getTagLabel(tag) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewPersonDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-dialog title="全景档案" v-model="personDetailDialog" width="800px">
            <div v-if="selectedPerson" class="person-detail">
              <div class="detail-header">
                <div class="avatar-wrapper">
                  <img :src="selectedPerson.avatar" alt="头像" class="detail-avatar" />
                </div>
                <div class="basic-info">
                  <h2>{{ selectedPerson.name }}</h2>
                  <p>身份证号：{{ selectedPerson.idCard }}</p>
                  <p>联系电话：{{ selectedPerson.phone }}</p>
                  <p>家庭住址：{{ selectedPerson.address }}</p>
                </div>
              </div>
              <el-tabs v-model="personDetailTab" type="card" class="detail-tabs">
                <el-tab-pane label="家庭关系" name="family">
                  <el-table :data="selectedPerson.familyMembers" border>
                    <el-table-column prop="name" label="姓名" />
                    <el-table-column prop="relation" label="关系" />
                    <el-table-column prop="age" label="年龄" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="资产关联" name="assets">
                  <el-table :data="selectedPerson.assets" border>
                    <el-table-column prop="name" label="资产名称" />
                    <el-table-column prop="type" label="类型" />
                    <el-table-column prop="value" label="价值" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="资金关联" name="funds">
                  <el-table :data="selectedPerson.subsidies" border>
                    <el-table-column prop="name" label="补贴项目" />
                    <el-table-column prop="amount" label="金额" />
                    <el-table-column prop="date" label="发放日期" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="任务关联" name="tasks">
                  <el-table :data="selectedPerson.tasks" border>
                    <el-table-column prop="name" label="任务名称" />
                    <el-table-column prop="status" label="状态" />
                    <el-table-column prop="role" label="角色" />
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>

      <el-tab-pane label="查财物" name="finance">
        <div class="finance-query-page">
          <el-tabs v-model="financeTab" type="card">
            <el-tab-pane label="收支查询" name="income-expense">
              <div class="filter-section">
                <el-form :model="financeFilter" class="filter-form">
                  <div class="filter-row">
                    <el-form-item label="时间范围">
                      <el-date-picker v-model="financeFilter.dateRange" type="daterange" range-separator="至" class="filter-input" />
                    </el-form-item>
                    <el-form-item label="收支类型">
                      <el-select v-model="financeFilter.type" placeholder="请选择" class="filter-select">
                        <el-option label="全部" value="" />
                        <el-option label="经营性" value="business" />
                        <el-option label="补助性" value="subsidy" />
                        <el-option label="捐赠" value="donation" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="经手人">
                      <el-input v-model="financeFilter.handler" placeholder="请输入经手人" class="filter-input" />
                    </el-form-item>
                    <el-form-item label="摘要关键词">
                      <el-input v-model="financeFilter.keyword" placeholder="请输入关键词" class="filter-input" />
                    </el-form-item>
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="queryFinance">查询</el-button>
                    <el-button @click="resetFinanceFilter">重置</el-button>
                  </div>
                </el-form>
              </div>
              <el-table :data="financeResults" border class="query-table">
                <el-table-column prop="voucherNo" label="凭证号" />
                <el-table-column prop="amount" label="金额" />
                <el-table-column prop="counterparty" label="对方账户" />
                <el-table-column prop="status" label="审批状态" />
                <el-table-column prop="date" label="日期" />
                <el-table-column label="操作" width="150">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="viewVoucher(scope.row)">查看凭证</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="资产查询" name="asset">
              <div class="filter-section">
                <el-form :model="assetFilter" class="filter-form">
                  <div class="filter-row">
                    <el-form-item label="资产类别">
                      <el-select v-model="assetFilter.category" placeholder="请选择" class="filter-select">
                        <el-option label="全部" value="" />
                        <el-option label="固定资产" value="fixed" />
                        <el-option label="资源性资产" value="resource" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                      <el-select v-model="assetFilter.status" placeholder="请选择" class="filter-select">
                        <el-option label="全部" value="" />
                        <el-option label="闲置" value="idle" />
                        <el-option label="出租" value="rented" />
                        <el-option label="自用" value="self-use" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="坐落位置">
                      <el-input v-model="assetFilter.location" placeholder="请输入位置" class="filter-input" />
                    </el-form-item>
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="queryAsset">查询</el-button>
                    <el-button @click="resetAssetFilter">重置</el-button>
                  </div>
                </el-form>
              </div>
              <el-table :data="assetResults" border class="query-table">
                <el-table-column prop="name" label="资产名称" />
                <el-table-column prop="category" label="类别" />
                <el-table-column prop="originalValue" label="原值" />
                <el-table-column prop="depreciation" label="折旧" />
                <el-table-column prop="user" label="使用人" />
                <el-table-column prop="contractEnd" label="合同到期日" />
                <el-table-column label="预警">
                  <template #default="scope">
                    <span v-if="isExpiring(scope.row.contractEnd)" class="expiring-tag">即将到期</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>

      <el-tab-pane label="查事项" name="task">
        <div class="task-query-page">
          <el-tabs v-model="taskTab" type="card">
            <el-tab-pane label="项目/任务" name="project">
              <div class="filter-section">
                <el-form :model="taskFilter" class="filter-form">
                  <div class="filter-row">
                    <el-form-item label="项目阶段">
                      <el-select v-model="taskFilter.phase" placeholder="请选择" class="filter-select">
                        <el-option label="全部" value="" />
                        <el-option label="立项" value="init" />
                        <el-option label="在建" value="in-progress" />
                        <el-option label="验收" value="acceptance" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="负责人">
                      <el-input v-model="taskFilter.manager" placeholder="请输入负责人" class="filter-input" />
                    </el-form-item>
                    <el-form-item label="资金来源">
                      <el-input v-model="taskFilter.fundingSource" placeholder="请输入资金来源" class="filter-input" />
                    </el-form-item>
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="queryTask">查询</el-button>
                    <el-button @click="resetTaskFilter">重置</el-button>
                  </div>
                </el-form>
              </div>
              <el-table :data="taskResults" border class="query-table">
                <el-table-column prop="name" label="项目名称" />
                <el-table-column prop="manager" label="负责人" />
                <el-table-column prop="phase" label="阶段" />
                <el-table-column label="进度">
                  <template #default="scope">
                    <el-progress :percentage="scope.row.progress" :show-text="false" />
                    <span class="progress-text">{{ scope.row.progress }}%</span>
                  </template>
                </el-table-column>
                <el-table-column prop="fundRate" label="资金执行率" />
                <el-table-column prop="blockedBy" label="滞留环节" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="预警记录" name="warning">
              <div class="filter-section">
                <el-form :model="warningFilter" class="filter-form">
                  <div class="filter-row">
                    <el-form-item label="预警类型">
                      <el-select v-model="warningFilter.type" placeholder="请选择" class="filter-select">
                        <el-option label="全部" value="" />
                        <el-option label="防返贫" value="anti-poverty" />
                        <el-option label="财务异常" value="finance" />
                        <el-option label="矛盾调解" value="conflict" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="处理状态">
                      <el-select v-model="warningFilter.status" placeholder="请选择" class="filter-select">
                        <el-option label="全部" value="" />
                        <el-option label="未处理" value="pending" />
                        <el-option label="已办结" value="completed" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-actions">
                    <el-button type="primary" @click="queryWarning">查询</el-button>
                    <el-button @click="resetWarningFilter">重置</el-button>
                  </div>
                </el-form>
              </div>
              <el-table :data="warningResults" border class="query-table">
                <el-table-column prop="content" label="预警内容" />
                <el-table-column prop="type" label="预警类型" />
                <el-table-column prop="triggerTime" label="触发时间" />
                <el-table-column prop="handler" label="处理人" />
                <el-table-column prop="result" label="处理结果" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>

      <el-tab-pane label="查组织" name="organization">
        <div class="org-query-page">
          <div class="org-tree-section">
            <h3 class="section-title">组织架构</h3>
            <el-tree
              :data="orgTree"
              :props="treeProps"
              default-expand-all
              node-key="id"
              @node-click="handleOrgClick"
              class="org-tree"
            />
          </div>
          <div class="org-detail-section">
            <h3 class="section-title">成员详情</h3>
            <div v-if="selectedOrg" class="org-detail">
              <h4>{{ selectedOrg.label }} - {{ selectedOrg.desc }}</h4>
              <el-table :data="selectedOrg.members" border class="member-table">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="position" label="职务" />
                <el-table-column prop="term" label="任期" />
                <el-table-column prop="phone" label="联系电话" />
              </el-table>
            </div>
            <div v-else class="empty-org">请选择组织查看成员详情</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, User, Home, Wallet, ListChecks, History, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('global')
const financeTab = ref('income-expense')
const taskTab = ref('project')
const personDetailTab = ref('family')
const showAdvancedFilter = ref(false)
const showColumnSelector = ref(false)
const personDetailDialog = ref(false)
const searchKeyword = ref('')
const selectedPerson = ref(null)
const selectedOrg = ref(null)

const treeProps = {
  label: 'label',
  children: 'children'
}

const searchHistory = ref(['张三', '低保户', '项目A', '123456'])

const hotSearchWords = ref([
  { word: '低保户名单', count: 156 },
  { word: 'XX工程项目', count: 132 },
  { word: '2024年补贴', count: 98 },
  { word: '监测户', count: 87 },
  { word: '党员信息', count: 76 }
])

const personTags = [
  { label: '低保户', value: 'low-income' },
  { label: '五保户', value: 'five-guarantee' },
  { label: '党员', value: 'party-member' },
  { label: '监测户', value: 'monitor' }
]

const searchSuggestions = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  const suggestions = [
    { id: 1, text: '张三', type: '村民', icon: User },
    { id: 2, text: '张三家', type: '家庭', icon: Home },
    { id: 3, text: '张三负责的工程', type: '项目', icon: ListChecks },
    { id: 4, text: '张三的补贴记录', type: '补贴', icon: Wallet }
  ]
  return suggestions.filter(item => item.text.toLowerCase().includes(keyword))
})

const globalSearchResults = ref([])

const personFilter = reactive({
  name: '',
  idCard: '',
  phone: '',
  grid: '',
  politicalStatus: '',
  tags: []
})

const personAdvancedFilter = reactive({
  minAge: '',
  maxAge: '',
  logic: 'and'
})

const financeFilter = reactive({
  dateRange: [],
  type: '',
  handler: '',
  keyword: ''
})

const assetFilter = reactive({
  category: '',
  status: '',
  location: ''
})

const taskFilter = reactive({
  phase: '',
  manager: '',
  fundingSource: ''
})

const warningFilter = reactive({
  type: '',
  status: ''
})

const personResults = ref([
  {
    id: 1,
    name: '张三',
    age: 34,
    idCard: '110101199001011234',
    phone: '13800138001',
    address: '塔拉村一组',
    grid: '第一网格',
    politicalStatus: '党员',
    tags: ['low-income', 'party-member'],
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20male&image_size=square',
    familyMembers: [
      { name: '张妻', relation: '配偶', age: 32 },
      { name: '张小明', relation: '子女', age: 8 }
    ],
    assets: [
      { name: '宅基地', type: '房产', value: '200000' },
      { name: '承包地', type: '土地', value: '50000' }
    ],
    subsidies: [
      { name: '农业补贴', amount: '2000', date: '2026-05-01' },
      { name: '低保补贴', amount: '1500', date: '2026-05-01' }
    ],
    tasks: [
      { name: '公益岗值班', status: '进行中', role: '值班员' }
    ]
  },
  {
    id: 2,
    name: '李四',
    age: 45,
    idCard: '110101198005055678',
    phone: '13900139002',
    address: '敖包村二组',
    grid: '第二网格',
    politicalStatus: '群众',
    tags: ['monitor'],
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20male%20middle%20age&image_size=square',
    familyMembers: [],
    assets: [],
    subsidies: [],
    tasks: []
  },
  {
    id: 3,
    name: '王五',
    age: 68,
    idCard: '110101195810109012',
    phone: '13700137003',
    address: '北山村三组',
    grid: '第三网格',
    politicalStatus: '党员',
    tags: ['five-guarantee'],
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20elderly%20male&image_size=square',
    familyMembers: [],
    assets: [],
    subsidies: [],
    tasks: []
  }
])

const financeResults = ref([
  { id: 1, voucherNo: 'PZ202605001', amount: '5000.00', counterparty: '张三', status: '已审批', date: '2026-05-18' },
  { id: 2, voucherNo: 'PZ202605002', amount: '12000.00', counterparty: '李四', status: '待审批', date: '2026-05-17' },
  { id: 3, voucherNo: 'PZ202605003', amount: '3000.00', counterparty: '王五', status: '已审批', date: '2026-05-16' }
])

const assetResults = ref([
  { id: 1, name: '村委会办公楼', category: '固定资产', originalValue: '500000', depreciation: '100000', user: '村委会', contractEnd: '2030-12-31' },
  { id: 2, name: '村集体土地', category: '资源性资产', originalValue: '300000', depreciation: '0', user: '村集体', contractEnd: '' },
  { id: 3, name: '灌溉设备', category: '固定资产', originalValue: '50000', depreciation: '20000', user: '张三', contractEnd: '2026-06-30' }
])

const taskResults = ref([
  { id: 1, name: '村道路改造工程', manager: '张三', phase: '在建', progress: 65, fundRate: '70%', blockedBy: '工程队' },
  { id: 2, name: '文化广场建设', manager: '李四', phase: '立项', progress: 10, fundRate: '20%', blockedBy: '审批中' },
  { id: 3, name: '农田水利修复', manager: '王五', phase: '验收', progress: 95, fundRate: '90%', blockedBy: '' }
])

const warningResults = ref([
  { id: 1, content: '监测户收入异常下降', type: '防返贫', triggerTime: '2026-05-17 10:30', handler: '张三', result: '处理中' },
  { id: 2, content: '某笔支出审批超时', type: '财务异常', triggerTime: '2026-05-16 14:20', handler: '李四', result: '已办结' },
  { id: 3, content: '村民纠纷待调解', type: '矛盾调解', triggerTime: '2026-05-15 09:15', handler: '王五', result: '未处理' }
])

const orgTree = ref([
  {
    id: '1',
    label: '灏明县',
    desc: '县级别',
    children: [
      {
        id: '1-1',
        label: '光明镇',
        desc: '镇级别',
        children: [
          {
            id: '1-1-1',
            label: '村党支部',
            desc: '党组织',
            members: [
              { name: '张三', position: '书记', term: '2021-2025', phone: '13800138001' },
              { name: '李四', position: '副书记', term: '2021-2025', phone: '13900139002' }
            ]
          },
          {
            id: '1-1-2',
            label: '村委会',
            desc: '村民自治组织',
            members: [
              { name: '王五', position: '主任', term: '2021-2025', phone: '13700137003' },
              { name: '赵六', position: '副主任', term: '2021-2025', phone: '13600136004' }
            ]
          },
          {
            id: '1-1-3',
            label: '第一村民小组',
            desc: '村民小组',
            members: [
              { name: '孙七', position: '组长', term: '2021-2025', phone: '13500135005' }
            ]
          }
        ]
      }
    ]
  }
])

const handleSearchInput = () => {}

const handleGlobalSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  if (!searchHistory.value.includes(searchKeyword.value)) {
    searchHistory.value.unshift(searchKeyword.value)
  }
  globalSearchResults.value = [
    {
      type: 'person',
      label: '村民',
      icon: User,
      items: [
        { id: 1, title: '张三', desc: '塔拉村一组，党员，低保户' },
        { id: 2, title: '李四', desc: '敖包村二组，监测户' }
      ]
    },
    {
      type: 'asset',
      label: '资产',
      icon: Home,
      items: [
        { id: 3, title: '张三家宅基地', desc: '塔拉村一组，面积120平米' }
      ]
    },
    {
      type: 'finance',
      label: '补贴',
      icon: Wallet,
      items: [
        { id: 4, title: '张三的农业补贴', desc: '2026年5月发放，金额2000元' }
      ]
    },
    {
      type: 'task',
      label: '任务',
      icon: ListChecks,
      items: [
        { id: 5, title: '张三参与的公益岗', desc: '值班任务，进行中' }
      ]
    }
  ]
}

const selectSuggestion = (item) => {
  searchKeyword.value = item.text
  handleGlobalSearch()
}

const clearHistory = () => {
  searchHistory.value = []
}

const switchToTab = (tab) => {
  activeTab.value = tab
}

const viewDetail = (item, type) => {
  ElMessage.info(`查看${item.title}详情`)
}

const queryPerson = () => {
  ElMessage.info('查询人员信息')
}

const resetPersonFilter = () => {
  personFilter.name = ''
  personFilter.idCard = ''
  personFilter.phone = ''
  personFilter.grid = ''
  personFilter.politicalStatus = ''
  personFilter.tags = []
}

const exportPersonData = () => {
  ElMessage.success('导出成功')
}

const viewPersonDetail = (person) => {
  selectedPerson.value = person
  personDetailDialog.value = true
}

const getTagClass = (tag) => {
  const classes = {
    'low-income': 'tag-low-income',
    'five-guarantee': 'tag-five-guarantee',
    'party-member': 'tag-party-member',
    'monitor': 'tag-monitor'
  }
  return classes[tag] || ''
}

const getTagLabel = (tag) => {
  const labels = {
    'low-income': '低保户',
    'five-guarantee': '五保户',
    'party-member': '党员',
    'monitor': '监测户'
  }
  return labels[tag] || tag
}

const queryFinance = () => {
  ElMessage.info('查询收支信息')
}

const resetFinanceFilter = () => {
  financeFilter.dateRange = []
  financeFilter.type = ''
  financeFilter.handler = ''
  financeFilter.keyword = ''
}

const viewVoucher = (row) => {
  ElMessage.info(`查看凭证: ${row.voucherNo}`)
}

const queryAsset = () => {
  ElMessage.info('查询资产信息')
}

const resetAssetFilter = () => {
  assetFilter.category = ''
  assetFilter.status = ''
  assetFilter.location = ''
}

const isExpiring = (date) => {
  if (!date) return false
  const endDate = new Date(date)
  const now = new Date()
  const diff = endDate - now
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000
}

const queryTask = () => {
  ElMessage.info('查询任务信息')
}

const resetTaskFilter = () => {
  taskFilter.phase = ''
  taskFilter.manager = ''
  taskFilter.fundingSource = ''
}

const queryWarning = () => {
  ElMessage.info('查询预警信息')
}

const resetWarningFilter = () => {
  warningFilter.type = ''
  warningFilter.status = ''
}

const handleOrgClick = (data) => {
  selectedOrg.value = data
}
</script>

<style scoped>
.comprehensive-query {
  padding: 20px;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.query-tabs {
  height: 100%;
}

.global-search-page {
  padding: 40px;
}

.search-center {
  text-align: center;
  margin-bottom: 40px;
}

.search-box-wrapper {
  position: relative;
  width: 60%;
  margin: 0 auto;
}

.global-search-input {
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #f5f7fa;
}

.suggestion-icon {
  margin-right: 12px;
  color: #007bff;
}

.suggestion-text {
  flex: 1;
}

.suggestion-type {
  color: #909399;
  font-size: 12px;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.quick-entries {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.entry-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.entry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.entry-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 28px;
  color: #fff;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.asset-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.finance-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.task-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.entry-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 12px;
  color: #909399;
}

.search-history {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.clear-history {
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-tag {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  gap: 6px;
}

.empty-history {
  text-align: center;
  color: #909399;
  padding: 20px;
}

.hot-search {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tag {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #fff7e6;
  border-radius: 20px;
  font-size: 14px;
  color: #e6a23c;
  cursor: pointer;
  gap: 8px;
}

.hot-tag-hot {
  background: #fff1f0;
  color: #f56c6c;
}

.hot-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  font-size: 12px;
}

.hot-count {
  font-size: 12px;
}

.search-results {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.result-group {
  margin-bottom: 20px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.group-count {
  margin-left: auto;
  font-weight: normal;
  color: #909399;
  font-size: 12px;
}

.result-list {
  border-top: 1px solid #ebf0f5;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebf0f5;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: #fafafa;
}

.result-info {
  flex: 1;
}

.result-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.result-desc {
  font-size: 12px;
  color: #909399;
}

.result-arrow {
  color: #c0c4cc;
}

.person-query-page,
.finance-query-page,
.task-query-page,
.org-query-page {
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

.filter-section {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.filter-form {
  margin-bottom: 0;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.filter-input {
  width: 200px;
}

.filter-select {
  width: 200px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.advanced-filter {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #e4e7ed;
}

.result-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-count {
  color: #606266;
  font-size: 14px;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.query-table {
  width: 100%;
}

.tag-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 4px;
}

.tag-low-income {
  background: #e8f5e9;
  color: #2e7d32;
}

.tag-five-guarantee {
  background: #e3f2fd;
  color: #1565c0;
}

.tag-party-member {
  background: #ffebee;
  color: #c62828;
}

.tag-monitor {
  background: #fff8e1;
  color: #ef6c00;
}

.person-detail {
  padding: 10px;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e4e7ed;
}

.detail-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basic-info h2 {
  margin: 0 0 10px;
}

.basic-info p {
  margin: 5px 0;
  color: #606266;
}

.detail-tabs {
  margin-top: 10px;
}

.progress-text {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
}

.expiring-tag {
  color: #f56c6c;
  font-size: 12px;
  background: #fff1f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.org-query-page {
  flex-direction: row;
  gap: 20px;
}

.org-tree-section {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.org-tree {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}

.org-detail-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.member-table {
  margin-top: 10px;
}

.empty-org {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #909399;
}
</style>