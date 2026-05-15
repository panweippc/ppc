<template>
  <div class="committee-management">
    <div class="left-panel">
      <div class="tree-container">
        <el-tree
          :data="treeData"
          :props="treeProps"
          :expand-on-click-node="true"
          @node-click="handleNodeClick"
          class="tree"
        />
      </div>
    </div>
    
    <div class="right-panel">
      <div class="panel-header">
        <span class="panel-title">机构列表</span>
        <button class="add-btn" @click="handleAdd">
          <span class="add-icon">+</span> 新增
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>机构名称</th>
              <th>机构编码</th>
              <th>机构类型</th>
              <th>机构分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td>
              <span 
                v-if="hasVisibleChildren(item.id)" 
                class="expand-icon"
                :class="{ expanded: isExpanded(item.id) }"
                @click="toggleExpand(item.id)"
              >{{ isExpanded(item.id) ? '▲' : '▼' }}</span>
              <span v-else class="expand-placeholder"></span>
              <span :style="{ marginLeft: getHierarchy(item) * 20 + 'px' }">{{ item.name }}</span>
            </td>
            <td>{{ item.code }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.category }}</td>
            <td class="action-buttons">
              <button class="btn btn-edit" @click="handleEdit(item)">编辑</button>
              <button class="btn btn-delete" @click="handleDelete(item)">删除</button>
              <button class="btn btn-add-child" @click="handleAddChild(item)">添加下级机构</button>
              <button class="btn btn-feature" @click="handleFeature(item)">特色产业</button>
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
    </div>
    
    <el-dialog 
      title="选择机构" 
      v-model="parentSelectorVisible" 
      width="400px"
      class="form-dialog"
    >
      <div class="parent-selector-content">
        <div class="search-box">
          <label>关键字:</label>
          <el-input 
            v-model="searchKeyword" 
            placeholder="请输入关键字" 
            style="width: 200px;"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        <div class="tree-select-container">
          <el-tree
            :data="selectorTreeData"
            :props="treeProps"
            :expand-on-click-node="true"
            :highlight-current="true"
            @node-click="handleSelectParent"
            class="selector-tree"
          />
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button type="primary" @click="handleConfirmParent">确定</el-button>
          <el-button @click="handleClearParent">清除</el-button>
          <el-button @click="parentSelectorVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    
    <el-dialog 
      title="年度" 
      v-model="yearSelectDialogVisible" 
      width="350px"
      :show-header="false"
      class="year-select-dialog"
    >
      <div class="year-select-content">
        <div class="year-label">年度:</div>
        <select v-model="selectedYear" class="year-select" style="width: 200px; height: 32px; padding: 0 12px; border: 1px solid #dcdfe6; border-radius: 4px;">
          <option v-for="year in getYearOptions()" :key="year" :value="year">{{ year }}年</option>
        </select>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button type="primary" @click="handleYearConfirm">确定</el-button>
          <el-button @click="handleYearCancel">取消</el-button>
        </div>
      </template>
    </el-dialog>
    
    <el-dialog 
      :title="`特色产业 - (${selectedYear}年)`" 
      v-model="featureDialogVisible" 
      width="900px"
      class="feature-dialog"
    >
      <div class="feature-content">
        <div class="feature-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            :class="['tab-btn', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >{{ tab }}</button>
          <button class="submit-btn" @click="handleSubmitFeature">提交数据</button>
        </div>
        
        <div class="feature-section">
          <div class="section-title">现有产业信息录入</div>
          <button class="add-btn industry-add-btn" @click="addExistingIndustry">+ 添加</button>
        </div>
        
        <div class="industry-table">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="(field, index) in getCurrentFields('existing')" :key="index">{{ field.name }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in existingIndustries" :key="item.id">
                <td v-for="(field, index) in getCurrentFields('existing')" :key="index">
                  <select v-if="field.type === 'select'" v-model="item.data[index]" class="type-select">
                    <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <input v-else v-model="item.data[index]" type="text" class="industry-input" :placeholder="field.name" />
                </td>
                <td>
                  <button class="delete-btn" @click="deleteExistingIndustry(item.id)">
                    <span>🗑️</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="feature-section">
          <div class="section-title">规划信息录入</div>
          <button class="add-btn industry-add-btn" @click="addPlannedIndustry">+ 添加</button>
        </div>
        
        <div class="industry-table">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="(field, index) in getCurrentFields('planned')" :key="index">{{ field.name }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in plannedIndustries" :key="item.id">
                <td v-for="(field, index) in getCurrentFields('planned')" :key="index">
                  <select v-if="field.type === 'select'" v-model="item.data[index]" class="type-select">
                    <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <input v-else v-model="item.data[index]" type="text" class="industry-input" :placeholder="field.name" />
                </td>
                <td>
                  <button class="delete-btn" @click="deletePlannedIndustry(item.id)">
                    <span>🗑️</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="handleFeatureClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    
    <el-dialog 
      title="新增机构" 
      v-model="dialogVisible" 
      width="550px"
      class="form-dialog"
    >
      <div class="add-form">
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">上级机构:</label>
            <div class="input-group">
              <input 
                type="text" 
                v-model="formData.parent" 
                readonly
                class="form-input"
                placeholder="请选择上级机构"
              />
              <button class="search-icon-btn" @click="handleSearchParent">
                <span>🔍</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item required">
            <label class="form-label">机构名称:</label>
            <input 
              type="text" 
              v-model="formData.name" 
              class="form-input"
              placeholder="请输入机构名称"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">机构编码:</label>
            <input 
              type="text" 
              v-model="formData.code" 
              class="form-input"
              placeholder="请输入机构编码"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">机构排序:</label>
            <input 
              type="number" 
              v-model="formData.sortOrder" 
              class="form-input"
              placeholder="请输入排序号"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">机构类型:</label>
            <select v-model="formData.type" class="form-select">
              <option value="部门">部门</option>
              <option value="单位">单位</option>
            </select>
          </div>
          
          <div class="form-item">
            <label class="form-label">机构分类:</label>
            <select v-model="formData.category" class="form-select">
              <option value="区县">区县</option>
              <option value="乡镇">乡镇</option>
              <option value="村/社区">村/社区</option>
              <option value="组">组</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">是否可用:</label>
            <select v-model="formData.enabled" class="form-select">
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">集体土地面积:</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model="formData.landArea" 
                class="form-input"
                placeholder="请输入面积"
              />
              <span class="unit">亩</span>
            </div>
          </div>
          
          <div class="form-item">
            <label class="form-label">集体林地面积:</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model="formData.forestArea" 
                class="form-input"
                placeholder="请输入面积"
              />
              <span class="unit">亩</span>
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">集体草场面积:</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model="formData.pastureArea" 
                class="form-input"
                placeholder="请输入面积"
              />
              <span class="unit">亩</span>
            </div>
          </div>
          
          <div class="form-item">
            <label class="form-label">集体房屋面积:</label>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model="formData.houseArea" 
                class="form-input"
                placeholder="请输入面积"
              />
              <span class="unit">㎡</span>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <button class="btn-submit" @click="handleSubmit">提交</button>
          <button class="btn-cancel" @click="handleCancel">返回</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { organizationData, saveTableData } from '../store/organization'

const treeProps = {
  label: 'label',
  children: 'children',
  expanded: 'expanded'
}

const treeData = ref([
  {
    id: 1,
    label: '灏明县',
    expanded: true,
    children: [
      { id: 11, label: '灏明镇' },
      {
        id: 12,
        label: '光明镇',
        expanded: true,
        children: [
          {
            id: 121,
            label: '塔拉村',
            expanded: true,
            children: [
              { id: 1211, label: '塔拉村' },
              { id: 1212, label: '塔拉北' },
              { id: 1213, label: '塔拉中' },
              { id: 1214, label: '塔拉南' }
            ]
          },
          {
            id: 122,
            label: '敖包村',
            children: [
              { id: 1221, label: '敖包村' },
              { id: 1222, label: '敖包北' },
              { id: 1223, label: '敖包中' },
              { id: 1224, label: '敖包南' }
            ]
          },
          {
            id: 123,
            label: '北山村',
            children: [
              { id: 1231, label: '北山村' },
              { id: 1232, label: '北山北' },
              { id: 1233, label: '北山中' },
              { id: 1234, label: '北山南' }
            ]
          }
        ]
      },
      { id: 13, label: '井沟村' }
    ]
  }
])

const tableData = organizationData

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => tableData.value.length)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const expandedIds = ref(new Set())

const toggleExpand = (id) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  expandedIds.value = new Set(expandedIds.value)
}

const isExpanded = (id) => {
  return expandedIds.value.has(id)
}

const getChildren = (parentId) => {
  return tableData.value.filter(item => item.parentId === parentId)
}

const hasVisibleChildren = (id) => {
  return tableData.value.some(item => {
    const pid = item.parentId !== undefined ? item.parentId : 0
    return Number(pid) === Number(id)
  })
}

const getHierarchy = (item, level = 0) => {
  const pid = item.parentId !== undefined ? item.parentId : 0
  if (pid === 0) return level
  const parent = tableData.value.find(p => p.id === pid)
  if (parent) {
    return getHierarchy(parent, level + 1)
  }
  return level
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const getVisibleData = () => {
  const result = []
  const traverse = (parentId, expanded) => {
    const children = tableData.value.filter(item => {
      const pid = item.parentId !== undefined ? item.parentId : 0
      return pid === parentId
    })
    children.forEach(item => {
      result.push(item)
      const hasChildren = hasVisibleChildren(item.id)
      if (hasChildren && expanded && isExpanded(item.id)) {
        traverse(item.id, true)
      }
    })
  }
  traverse(0, true)
  return result
}

const dialogVisible = ref(false)
const parentSelectorVisible = ref(false)
const searchKeyword = ref('')
const selectedParent = ref('')

const selectorTreeData = ref([
  {
    id: 1,
    label: '灏明县',
    expanded: true,
    children: [
      { id: 11, label: '灏明镇' },
      { id: 12, label: '光明镇' },
      { id: 13, label: '古堰乡' },
      { id: 14, label: '繁荣乡' },
      { id: 15, label: '大明镇' },
      { id: 16, label: '鸳鸯镇' },
      { id: 17, label: '金汇镇' },
      { id: 18, label: '桃花镇' }
    ]
  }
])

const formData = ref({
  parent: '塔拉村',
  name: '',
  code: '0008003001005',
  sortOrder: 30,
  type: '部门',
  category: '区县',
  enabled: '是',
  landArea: '',
  forestArea: '',
  pastureArea: '',
  houseArea: ''
})

const resetFormData = () => {
  formData.value = {
    parent: '塔拉村',
    name: '',
    code: '',
    sortOrder: '',
    type: '部门',
    category: '区县',
    enabled: '是',
    landArea: '',
    forestArea: '',
    pastureArea: '',
    houseArea: ''
  }
}

const handleNodeClick = (node) => {
  console.log('点击节点:', node.label)
}

const handleSearchParent = () => {
  selectedParent.value = formData.value.parent
  parentSelectorVisible.value = true
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleSelectParent = (node) => {
  selectedParent.value = node.label
}

const handleConfirmParent = () => {
  formData.value.parent = selectedParent.value
  parentSelectorVisible.value = false
}

const handleClearParent = () => {
  selectedParent.value = ''
  formData.value.parent = ''
}

const editingId = ref(null)

const handleAdd = () => {
  editingId.value = null
  resetFormData()
  dialogVisible.value = true
}

const handleEdit = (item) => {
  editingId.value = item.id
  formData.value = { 
    parent: item.parent || '',
    name: item.name,
    code: item.code,
    sortOrder: item.sortOrder || '',
    type: item.type,
    category: item.category,
    enabled: item.enabled || '是',
    landArea: item.landArea || '',
    forestArea: item.forestArea || '',
    pastureArea: item.pastureArea || '',
    houseArea: item.houseArea || ''
  }
  dialogVisible.value = true
}

const handleDelete = (item) => {
  ElMessageBox.confirm(
    '您确定要删除吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    tableData.value = tableData.value.filter(row => row.id !== item.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleAddChild = (item) => {
  editingId.value = null
  resetFormData()
  formData.value.parent = item.name
  dialogVisible.value = true
}

const featureDialogVisible = ref(false)
const yearSelectDialogVisible = ref(false)
const selectedYear = ref('')
const currentOrgName = ref('')

const handleFeature = (item) => {
  currentOrgName.value = item.name
  selectedYear.value = String(new Date().getFullYear())
  yearSelectDialogVisible.value = true
}

const getYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 2019; i <= 2033; i++) {
    years.push(String(i))
  }
  return years
}

const handleYearConfirm = () => {
  yearSelectDialogVisible.value = false
  featureDialogVisible.value = true
}

const handleYearCancel = () => {
  yearSelectDialogVisible.value = false
}

const handleFeatureClose = () => {
  featureDialogVisible.value = false
}

const handleSubmitFeature = () => {
  ElMessage.success('提交成功')
}

const activeTab = ref('农家乐')
const tabs = ['农家乐', '采摘园', '田园综合体', '牧家乐', '游乐设施', '村大棚经济', '特色农副产品']

const industryFields = {
  '农家乐': {
    existing: [
      { name: '名称', type: 'input' },
      { name: '住宿可容纳', type: 'input' },
      { name: '餐饮可容纳', type: 'input' },
      { name: '特色菜品', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '名称', type: 'input' },
      { name: '住宿可容纳人数', type: 'input' },
      { name: '餐饮可容纳', type: 'input' },
      { name: '特色菜品', type: 'input' },
      { name: '预计收入', type: 'input' }
    ]
  },
  '采摘园': {
    existing: [
      { name: '采摘园名称', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '采摘园名称', type: 'input' },
      { name: '预计收入', type: 'input' }
    ]
  },
  '田园综合体': {
    existing: [
      { name: '田园综合体名称', type: 'input' },
      { name: '占地（亩）', type: 'input' },
      { name: '住宿可容纳', type: 'input' },
      { name: '餐饮可容纳', type: 'input' },
      { name: '特色菜品', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '田园综合体名称', type: 'input' },
      { name: '占地（亩）', type: 'input' },
      { name: '住宿可容纳人数', type: 'input' },
      { name: '餐饮可容纳', type: 'input' },
      { name: '特色菜品', type: 'input' },
      { name: '预计收入', type: 'input' }
    ]
  },
  '牧家乐': {
    existing: [
      { name: '名称', type: 'input' },
      { name: '住宿可容纳', type: 'input' },
      { name: '餐饮可容纳', type: 'input' },
      { name: '特色菜品', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '名称', type: 'input' },
      { name: '住宿可容纳人数', type: 'input' },
      { name: '餐饮可容纳', type: 'input' },
      { name: '特色菜品', type: 'input' },
      { name: '预计收入', type: 'input' }
    ]
  },
  '游乐设施': {
    existing: [
      { name: '游乐设施名称', type: 'input' },
      { name: '占地（亩）', type: 'input' },
      { name: '可接待游客数量', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '游乐设施名称', type: 'input' },
      { name: '占地（亩）', type: 'input' },
      { name: '可接待游客数', type: 'input' },
      { name: '预计收入', type: 'input' }
    ]
  },
  '村大棚经济': {
    existing: [
      { name: '大棚类型', type: 'select', options: ['果树大棚', '葡萄大棚', '蔬菜大棚', '草莓大棚'] },
      { name: '可接待游客数', type: 'input' },
      { name: '占地（亩）', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '大棚类型', type: 'select', options: ['果树大棚', '葡萄大棚', '蔬菜大棚', '草莓大棚'] },
      { name: '可接待游客数', type: 'input' },
      { name: '占地（亩）', type: 'input' },
      { name: '预计收入', type: 'input' },
      { name: '备注', type: 'input' }
    ]
  },
  '特色农副产品': {
    existing: [
      { name: '农副产品种类', type: 'select', options: ['农家小笨鸡', '农家土猪', '农家土鸡蛋', '大米', '小米'] },
      { name: '单位', type: 'select', options: ['只', '头', '斤', '公斤', '吨'] },
      { name: '产量', type: 'input' },
      { name: '实际收入', type: 'input' }
    ],
    planned: [
      { name: '农副产品种类', type: 'select', options: ['农家小笨鸡', '农家土猪', '农家土鸡蛋', '大米', '小米'] },
      { name: '单位', type: 'select', options: ['只', '头', '斤', '公斤', '吨'] },
      { name: '产量', type: 'input' },
      { name: '预计收入', type: 'input' },
      { name: '备注', type: 'input' }
    ]
  }
}

const getCurrentFields = (type) => {
  return industryFields[activeTab.value]?.[type] || industryFields['农家乐'][type]
}

const existingIndustries = ref([{
  id: 1,
  data: ['', '', '', '']
}])

const plannedIndustries = ref([{
  id: 1,
  data: ['', '', '', '', '']
}])

const addExistingIndustry = () => {
  const newId = Date.now()
  const fieldCount = getCurrentFields('existing').length
  existingIndustries.value.push({
    id: newId,
    data: Array(fieldCount).fill('')
  })
}

const deleteExistingIndustry = (id) => {
  if (existingIndustries.value.length > 1) {
    existingIndustries.value = existingIndustries.value.filter(item => item.id !== id)
  } else {
    ElMessage.warning('至少保留一行')
  }
}

const addPlannedIndustry = () => {
  const newId = Date.now()
  const fieldCount = getCurrentFields('planned').length
  plannedIndustries.value.push({
    id: newId,
    data: Array(fieldCount).fill('')
  })
}

const deletePlannedIndustry = (id) => {
  if (plannedIndustries.value.length > 1) {
    plannedIndustries.value = plannedIndustries.value.filter(item => item.id !== id)
  } else {
    ElMessage.warning('至少保留一行')
  }
}

const handleCancel = () => {
  dialogVisible.value = false
}

const handleSubmit = () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入机构名称')
    return
  }
  
  if (editingId.value) {
    const index = tableData.value.findIndex(row => row.id === editingId.value)
    if (index !== -1) {
      tableData.value[index] = {
        id: editingId.value,
        name: formData.value.name,
        code: formData.value.code,
        type: formData.value.type,
        category: formData.value.category,
        hasChildren: tableData.value[index].hasChildren || false,
        parentId: tableData.value[index].parentId || 0,
        parent: formData.value.parent,
        sortOrder: formData.value.sortOrder,
        enabled: formData.value.enabled,
        landArea: formData.value.landArea,
        forestArea: formData.value.forestArea,
        pastureArea: formData.value.pastureArea,
        houseArea: formData.value.houseArea
      }
      saveTableData(tableData.value)
      ElMessage.success('编辑成功')
    }
  } else {
    const newId = Date.now()
    let parentId = 0
    if (formData.value.parent) {
      const parent = tableData.value.find(item => item.name === formData.value.parent)
      if (parent) {
        parentId = parent.id
        parent.hasChildren = true
      }
    }
    tableData.value.push({
      id: newId,
      name: formData.value.name,
      code: formData.value.code,
      type: formData.value.type,
      category: formData.value.category,
      hasChildren: false,
      parentId: parentId,
      parent: formData.value.parent,
      sortOrder: formData.value.sortOrder,
      enabled: formData.value.enabled,
      landArea: formData.value.landArea,
      forestArea: formData.value.forestArea,
      pastureArea: formData.value.pastureArea,
      houseArea: formData.value.houseArea
    })
    saveTableData(tableData.value)
    ElMessage.success('新增成功')
  }
  
  dialogVisible.value = false
}
</script>

<style scoped>
.committee-management {
  display: flex;
  height: 100%;
}

.left-panel {
  width: 250px;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.tree-container {
  padding: 15px;
}

.tree {
  font-size: 14px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

.table-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.expand-icon,
.expand-placeholder {
  display: inline-block;
  width: 16px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  color: #007bff;
}

.expand-icon:hover {
  color: #0056b3;
}

.expand-placeholder {
  color: transparent;
}

.btn {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background-color: #007bff;
  color: #fff;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-add-child {
  background-color: #007bff;
  color: #fff;
}

.btn-add-child:hover {
  background-color: #0056b3;
}

.btn-feature {
  background-color: #ffc107;
  color: #333;
}

.btn-feature:hover {
  background-color: #e0a800;
}

.form-content {
  padding: 10px 0;
}

.parent-selector {
  display: flex;
  align-items: center;
}

.parent-search-btn {
  padding: 8px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.input-with-unit .unit {
  margin-left: 8px;
  color: #666;
  font-size: 14px;
}

.parent-selector-content {
  padding: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.search-box label {
  font-size: 14px;
  color: #666;
}

.search-box .search-btn {
  padding: 7px 15px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.tree-select-container {
  max-height: 300px;
  overflow-y: auto;
}

.selector-tree {
  font-size: 14px;
}

.add-form {
  padding: 10px 0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-item {
  flex: 1;
}

.form-item.required .form-label::before {
  content: '*';
  color: #dc3545;
  margin-right: 4px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
  text-align: left;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
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

.form-select:focus {
  outline: none;
  border-color: #007bff;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group .form-input {
  border-radius: 4px 0 0 4px;
  border-right: none;
}

.search-icon-btn {
  padding: 8px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.btn-submit {
  padding: 8px 24px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-cancel {
  padding: 8px 24px;
  background-color: #fff;
  color: #666;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel:hover {
  background-color: #f5f5f5;
}

.year-select-dialog {
  .el-dialog__header {
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .el-dialog__body {
    padding: 20px;
  }
}

.year-select-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.year-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.feature-dialog {
  .el-dialog__body {
    padding: 10px;
  }
}

.feature-content {
  padding: 10px;
}

.feature-tabs {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #007bff;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.submit-btn {
  margin-left: auto;
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.feature-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.section-title {
  font-size: 14px;
  color: #666;
}

.feature-section .add-btn {
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.feature-section .add-btn:hover {
  background-color: #0056b3;
}

.industry-add-btn {
  margin-left: auto;
}

.industry-table {
  margin-bottom: 20px;
}

.industry-table .data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.industry-table .data-table th,
.industry-table .data-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.industry-table .data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
}

.industry-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.industry-input:focus {
  outline: none;
  border-color: #007bff;
}

.type-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}

.delete-btn {
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
  font-size: 16px;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>