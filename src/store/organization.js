import { ref, computed } from 'vue'

const STORAGE_KEY = 'village_committee_data'

const defaultData = [
  { id: 1, name: '灏明县', code: '0008', type: '部门', category: '区县', hasChildren: true, parentId: 0, expanded: true },
  { id: 11, name: '灏明镇', code: '0008001', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 12, name: '光明镇', code: '0008002', type: '部门', category: '乡镇', hasChildren: true, parentId: 1, expanded: false },
  { id: 121, name: '塔拉村', code: '0008002001', type: '部门', category: '村/社区', hasChildren: false, parentId: 12, expanded: false },
  { id: 122, name: '红旗村', code: '0008002002', type: '部门', category: '村/社区', hasChildren: false, parentId: 12, expanded: false },
  { id: 123, name: '红星村', code: '0008002003', type: '部门', category: '村/社区', hasChildren: false, parentId: 12, expanded: false },
  { id: 124, name: '前进村', code: '0008002004', type: '部门', category: '村/社区', hasChildren: false, parentId: 12, expanded: false },
  { id: 13, name: '古堰乡', code: '0008003', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 14, name: '繁荣乡', code: '0008004', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 15, name: '大明镇', code: '0008005', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 16, name: '鸳鸯镇', code: '0008006', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 17, name: '金汇镇', code: '0008006', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 18, name: '桃花镇', code: '0008007', type: '部门', category: '乡镇', hasChildren: false, parentId: 1, expanded: false },
  { id: 19, name: '井沟村', code: '0008008', type: '部门', category: '村/社区', hasChildren: false, parentId: 1, expanded: false }
]

const loadTableData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultData
  } catch {
    return defaultData
  }
}

const saveTableData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const organizationData = ref(loadTableData())

const villageOptions = computed(() => {
  return organizationData.value
    .filter(item => item.category === '村/社区')
    .map(item => item.name)
})

const groupOptions = computed(() => {
  const groups = new Set()
  organizationData.value.forEach(item => {
    if (item.category === '村/社区') {
      const villageName = item.name
      if (villageName.includes('村')) {
        const baseName = villageName.replace(/村$/, '')
        groups.add(villageName)
        groups.add(`${baseName}北`)
        groups.add(`${baseName}中`)
        groups.add(`${baseName}南`)
      } else {
        groups.add(villageName)
      }
    }
  })
  return Array.from(groups).sort()
})

const allOrganizationOptions = computed(() => {
  return organizationData.value.map(item => ({
    id: item.id,
    name: item.name,
    code: item.code,
    type: item.type,
    category: item.category
  }))
})

const updateOrganizationData = (data) => {
  organizationData.value = data
  saveTableData(data)
}

export {
  organizationData,
  villageOptions,
  groupOptions,
  allOrganizationOptions,
  updateOrganizationData,
  saveTableData
}
