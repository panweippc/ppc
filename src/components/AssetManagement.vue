<template>
  <div class="asset-management">
    <div class="search-section">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">年度</label>
          <el-input v-model="searchForm.year" placeholder="" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">资产编号</label>
          <el-input v-model="searchForm.assetNo" placeholder="请输入资产编号" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">资产名称</label>
          <el-input v-model="searchForm.assetName" placeholder="请输入资产名称" class="form-input" />
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">资产属性</label>
          <el-select v-model="searchForm.assetProperty" placeholder="" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="集体资产" value="集体资产" />
            <el-option label="到户资产" value="到户资产" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">资产类型</label>
          <el-select v-model="searchForm.assetType" placeholder="" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="到户" value="到户" />
            <el-option label="经营类无收益" value="经营类无收益" />
            <el-option label="公益类" value="公益类" />
            <el-option label="经营类" value="经营类" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">资产形态</label>
          <el-select v-model="searchForm.assetForm" placeholder="" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="权益性资产" value="权益性资产" />
            <el-option label="生物性资产" value="生物性资产" />
            <el-option label="固定资产" value="固定资产" />
          </el-select>
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">具体形态</label>
          <el-select v-model="searchForm.specificForm" placeholder="" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="资金投入" value="资金投入" />
            <el-option label="水利设施" value="水利设施" />
            <el-option label="图书馆" value="图书馆" />
            <el-option label="环卫公厕" value="环卫公厕" />
            <el-option label="医疗设备建设" value="医疗设备建设" />
            <el-option label="果树" value="果树" />
            <el-option label="农产品加工厂" value="农产品加工厂" />
            <el-option label="公路" value="公路" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">使用状况</label>
          <el-select v-model="searchForm.status" placeholder="" class="form-select">
            <el-option label="全部" value="" />
            <el-option label="正常使用" value="正常使用" />
            <el-option label="闲置" value="闲置" />
            <el-option label="损坏" value="损坏" />
          </el-select>
        </div>
        <div class="search-item">
          <label class="search-label">使用部门</label>
          <el-input v-model="searchForm.department" placeholder="请输入使用部门" class="form-input" />
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">监管部门</label>
          <el-input v-model="searchForm.supervisionDept" placeholder="请输入监管部门" class="form-input" />
        </div>
        <div class="search-item">
          <label class="search-label">村</label>
          <el-select v-model="searchForm.village" placeholder="请选择" class="form-select">
            <el-option label="请选择" value="" />
            <el-option label="灏明县" value="灏明县" />
            <el-option label="井沟村" value="井沟村" />
            <el-option label="光明新村" value="光明新村" />
            <el-option label="天野村" value="天野村" />
          </el-select>
        </div>
      </div>
    </div>

    <div class="table-section">
      <div class="table-header">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="filteredAssets" border class="asset-table">
        <el-table-column prop="year" label="年度" sortable />
        <el-table-column prop="assetNo" label="资产编号" sortable />
        <el-table-column prop="assetName" label="资产名称" sortable />
        <el-table-column prop="assetProperty" label="资产属性" sortable />
        <el-table-column prop="assetType" label="资产类型" sortable />
        <el-table-column prop="assetForm" label="资产形态" sortable />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="openViewDialog(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editAsset(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteAsset(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredAssets.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="数据信息" v-model="addDialog" width="800px" class="data-dialog">
      <div class="form-content">
        <div class="form-row">
          <el-form-item label="*年度" class="form-item">
            <el-input v-model="addForm.year" placeholder="" class="form-control" />
          </el-form-item>
          <el-form-item label="*资产编号" class="form-item">
            <el-input v-model="addForm.assetNo" placeholder="请输入资产编号" class="form-control" />
          </el-form-item>
          <el-form-item label="*资产名称" class="form-item">
            <el-input v-model="addForm.assetName" placeholder="请输入资产名称" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*资产属性" class="form-item">
            <el-select v-model="addForm.assetProperty" placeholder="" class="form-control">
              <el-option label="集体资产" value="集体资产" />
              <el-option label="到户资产" value="到户资产" />
            </el-select>
          </el-form-item>
          <el-form-item label="*资产类型" class="form-item">
            <el-select v-model="addForm.assetType" placeholder="" class="form-control">
              <el-option label="到户" value="到户" />
              <el-option label="经营类无收益" value="经营类无收益" />
              <el-option label="公益类" value="公益类" />
              <el-option label="经营类" value="经营类" />
            </el-select>
          </el-form-item>
          <el-form-item label="*资产形态" class="form-item">
            <el-select v-model="addForm.assetForm" placeholder="" class="form-control">
              <el-option label="权益性资产" value="权益性资产" />
              <el-option label="生物性资产" value="生物性资产" />
              <el-option label="固定资产" value="固定资产" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*具体形态" class="form-item">
            <el-select v-model="addForm.specificForm" placeholder="" class="form-control">
              <el-option label="资金投入" value="资金投入" />
              <el-option label="水利设施" value="水利设施" />
              <el-option label="图书馆" value="图书馆" />
              <el-option label="环卫公厕" value="环卫公厕" />
              <el-option label="医疗设备建设" value="医疗设备建设" />
              <el-option label="果树" value="果树" />
              <el-option label="农产品加工厂" value="农产品加工厂" />
              <el-option label="公路" value="公路" />
            </el-select>
          </el-form-item>
          <el-form-item label="使用状况" class="form-item">
            <el-select v-model="addForm.status" placeholder="" class="form-control">
              <el-option label="正常使用" value="正常使用" />
              <el-option label="闲置" value="闲置" />
              <el-option label="损坏" value="损坏" />
            </el-select>
          </el-form-item>
          <el-form-item label="使用部门" class="form-item">
            <el-input v-model="addForm.department" placeholder="请输入使用部门" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="增加方式" class="form-item">
            <el-select v-model="addForm.addMethod" placeholder="" class="form-control">
              <el-option label="新建" value="新建" />
              <el-option label="购置" value="购置" />
              <el-option label="捐赠" value="捐赠" />
            </el-select>
          </el-form-item>
          <el-form-item label="取得日期" class="form-item">
            <el-date-picker
              v-model="addForm.acquisitionDate"
              type="date"
              placeholder="请选择日期"
              class="form-control"
            />
          </el-form-item>
          <el-form-item label="数量" class="form-item">
            <el-input v-model="addForm.quantity" placeholder="" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="计量单位" class="form-item">
            <el-select v-model="addForm.unit" placeholder="" class="form-control">
              <el-option label="个" value="个" />
              <el-option label="台" value="台" />
              <el-option label="亩" value="亩" />
              <el-option label="平方米" value="平方米" />
              <el-option label="公里" value="公里" />
            </el-select>
          </el-form-item>
          <el-form-item label="监管部门" class="form-item">
            <el-input v-model="addForm.supervisionDept" placeholder="请输入监管部门" class="form-control" />
          </el-form-item>
          <el-form-item label="坐落位置" class="form-item">
            <el-input v-model="addForm.location" placeholder="请输入坐落位置" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="资产原值(万元)" class="form-item">
            <el-input v-model="addForm.originalValue" placeholder="" class="form-control" />
          </el-form-item>
          <el-form-item label="建设单位" class="form-item">
            <el-input v-model="addForm.constructionUnit" placeholder="请输入建设单位" class="form-control" />
          </el-form-item>
          <el-form-item label="录入人" class="form-item">
            <el-input v-model="addForm.recorder" placeholder="请输入录入人" class="form-control" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="录入日期" class="form-item">
            <el-date-picker
              v-model="addForm.recordDate"
              type="date"
              placeholder="请选择日期"
              class="form-control"
            />
          </el-form-item>
          <el-form-item label="*村" class="form-item">
            <el-select v-model="addForm.village" placeholder="请选择" class="form-control">
              <el-option label="灏明县" value="灏明县" />
              <el-option label="井沟村" value="井沟村" />
              <el-option label="光明新村" value="光明新村" />
              <el-option label="天野村" value="天野村" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目库" class="form-item">
            <div class="project-selector">
              <el-input 
                v-model="addForm.projectName" 
                placeholder="请选择" 
                class="project-input"
                readonly
              />
              <el-button type="primary" size="small" @click="openProjectSelector">
                <el-icon><Search /></el-icon>
              </el-button>
            </div>
            <input type="hidden" v-model="addForm.projectId" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="上传图片" class="form-item">
            <div class="photo-upload">
              <el-button type="primary" size="small">上传</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <template #footer>
        <el-button @click="addDialog = false">关闭</el-button>
        <el-button type="primary" @click="confirmAdd">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="项目库选择" v-model="projectSelectorDialog" width="600px">
      <div class="project-selector-content">
        <div class="project-search">
          <el-input v-model="projectSearch" placeholder="搜索项目名称" class="project-search-input" />
        </div>
        <el-table :data="filteredProjects" border class="project-table">
          <el-table-column prop="id" label="项目编号" />
          <el-table-column prop="name" label="项目名称" />
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="primary" size="small" @click="selectProject(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="数据信息" v-model="viewDialog" width="800px" class="data-dialog">
      <div class="view-content">
        <table class="view-table">
          <tr>
            <td class="label-cell">年度</td>
            <td class="value-cell">{{ viewAssetData.year }}</td>
            <td class="label-cell">资产编号</td>
            <td class="value-cell">{{ viewAssetData.assetNo }}</td>
            <td class="label-cell">资产名称</td>
            <td class="value-cell">{{ viewAssetData.assetName }}</td>
          </tr>
          <tr>
            <td class="label-cell">资产属性</td>
            <td class="value-cell">{{ viewAssetData.assetProperty }}</td>
            <td class="label-cell">资产类型</td>
            <td class="value-cell">{{ viewAssetData.assetType }}</td>
            <td class="label-cell">资产形态</td>
            <td class="value-cell">{{ viewAssetData.assetForm }}</td>
          </tr>
          <tr>
            <td class="label-cell">具体形态</td>
            <td class="value-cell">{{ viewAssetData.specificForm }}</td>
            <td class="label-cell">使用状况</td>
            <td class="value-cell">{{ viewAssetData.status }}</td>
            <td class="label-cell">使用部门</td>
            <td class="value-cell">{{ viewAssetData.department }}</td>
          </tr>
          <tr>
            <td class="label-cell">增加方式</td>
            <td class="value-cell">{{ viewAssetData.addMethod }}</td>
            <td class="label-cell">取得日期</td>
            <td class="value-cell">{{ viewAssetData.acquisitionDate }}</td>
            <td class="label-cell">数量</td>
            <td class="value-cell">{{ viewAssetData.quantity }}</td>
          </tr>
          <tr>
            <td class="label-cell">计量单位</td>
            <td class="value-cell">{{ viewAssetData.unit }}</td>
            <td class="label-cell">监管部门</td>
            <td class="value-cell">{{ viewAssetData.supervisionDept }}</td>
            <td class="label-cell">坐落位置</td>
            <td class="value-cell">{{ viewAssetData.location }}</td>
          </tr>
          <tr>
            <td class="label-cell">资产原值(万元)</td>
            <td class="value-cell">{{ viewAssetData.originalValue }}</td>
            <td class="label-cell">建设单位</td>
            <td class="value-cell">{{ viewAssetData.constructionUnit }}</td>
            <td class="label-cell">录入人</td>
            <td class="value-cell">{{ viewAssetData.recorder }}</td>
          </tr>
          <tr>
            <td class="label-cell">录入日期</td>
            <td class="value-cell">{{ viewAssetData.recordDate }}</td>
            <td class="label-cell">村</td>
            <td class="value-cell">{{ viewAssetData.village }}</td>
            <td class="label-cell">项目库</td>
            <td class="value-cell">{{ viewAssetData.projectName }}</td>
          </tr>
          <tr>
            <td class="label-cell">上传图片</td>
            <td class="value-cell" colspan="5">
              <div class="photo-preview">
                <img v-if="viewAssetData.photo" :src="viewAssetData.photo" alt="图片" />
                <div v-else class="no-photo">暂无图片</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <template #footer>
        <el-button @click="viewDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  year: '',
  assetNo: '',
  assetName: '',
  assetProperty: '',
  assetType: '',
  assetForm: '',
  specificForm: '',
  status: '',
  department: '',
  supervisionDept: '',
  village: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const projectSearch = ref('')

const assets = ref([
  { id: 1, year: '213', assetNo: '231', assetName: '123', assetProperty: '集体资产', assetType: '到户', assetForm: '权益性资产', specificForm: '资金投入', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 2, year: '2023', assetNo: '432', assetName: '432', assetProperty: '集体资产', assetType: '经营类无收益', assetForm: '权益性资产', specificForm: '', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 3, year: '2024', assetNo: '04', assetName: '水利设施', assetProperty: '到户资产', assetType: '经营类无收益', assetForm: '生物性资产', specificForm: '水利设施', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 4, year: '2024', assetNo: '04', assetName: '水利设施', assetProperty: '到户资产', assetType: '经营类无收益', assetForm: '生物性资产', specificForm: '水利设施', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 5, year: '2024', assetNo: '03', assetName: '图书馆', assetProperty: '集体资产', assetType: '公益类', assetForm: '固定资产', specificForm: '图书馆', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 6, year: '2024', assetNo: '003', assetName: '环卫公厕', assetProperty: '集体资产', assetType: '公益类', assetForm: '固定资产', specificForm: '环卫公厕', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 7, year: '2024', assetNo: '003', assetName: '环卫公厕', assetProperty: '集体资产', assetType: '公益类', assetForm: '固定资产', specificForm: '环卫公厕', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 8, year: '2024', assetNo: '001', assetName: '医疗设备建设', assetProperty: '集体资产', assetType: '公益类', assetForm: '固定资产', specificForm: '医疗设备建设', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 9, year: '2024', assetNo: 'zc(xm)0001', assetName: '果树', assetProperty: '到户资产', assetType: '到户', assetForm: '生物性资产', specificForm: '果树', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 10, year: '2024', assetNo: '01', assetName: '农产品加工厂', assetProperty: '集体资产', assetType: '经营类', assetForm: '生物性资产', specificForm: '农产品加工厂', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 11, year: '2024', assetNo: '006', assetName: '鸡心果树', assetProperty: '到户资产', assetType: '到户', assetForm: '生物性资产', specificForm: '果树', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 12, year: '2024', assetNo: '006', assetName: '鸡心果树', assetProperty: '到户资产', assetType: '到户', assetForm: '生物性资产', specificForm: '果树', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' },
  { id: 13, year: '2024', assetNo: '005', assetName: '公路', assetProperty: '集体资产', assetType: '经营类无收益', assetForm: '固定资产', specificForm: '公路', status: '', department: '', supervisionDept: '', location: '', originalValue: '', constructionUnit: '', recorder: '', recordDate: '', village: '', projectName: '', quantity: '', unit: '', addMethod: '', acquisitionDate: '' }
])

const projects = ref([
  { id: '1', name: '乡村道路建设项目' },
  { id: '2', name: '水利灌溉工程' },
  { id: '3', name: '农村电网改造' },
  { id: '4', name: '文化广场建设' },
  { id: '5', name: '生态农业园区' },
  { id: '6', name: '特色产业扶持' }
])

const addDialog = ref(false)
const addForm = reactive({
  year: '',
  assetNo: '',
  assetName: '',
  assetProperty: '',
  assetType: '',
  assetForm: '',
  specificForm: '',
  status: '',
  department: '',
  addMethod: '',
  acquisitionDate: '',
  quantity: '',
  unit: '',
  supervisionDept: '',
  location: '',
  originalValue: '',
  constructionUnit: '',
  recorder: '',
  recordDate: '',
  village: '',
  projectId: '',
  projectName: ''
})

const viewDialog = ref(false)
const viewAssetData = reactive({
  year: '',
  assetNo: '',
  assetName: '',
  assetProperty: '',
  assetType: '',
  assetForm: '',
  specificForm: '',
  status: '',
  department: '',
  addMethod: '',
  acquisitionDate: '',
  quantity: '',
  unit: '',
  supervisionDept: '',
  location: '',
  originalValue: '',
  constructionUnit: '',
  recorder: '',
  recordDate: '',
  village: '',
  projectName: '',
  photo: ''
})

const projectSelectorDialog = ref(false)

const filteredAssets = computed(() => {
  return assets.value.filter(asset => {
    if (searchForm.year && asset.year !== searchForm.year) return false
    if (searchForm.assetNo && !asset.assetNo.includes(searchForm.assetNo)) return false
    if (searchForm.assetName && !asset.assetName.includes(searchForm.assetName)) return false
    if (searchForm.assetProperty && asset.assetProperty !== searchForm.assetProperty) return false
    if (searchForm.assetType && asset.assetType !== searchForm.assetType) return false
    if (searchForm.assetForm && asset.assetForm !== searchForm.assetForm) return false
    if (searchForm.specificForm && asset.specificForm !== searchForm.specificForm) return false
    if (searchForm.status && asset.status !== searchForm.status) return false
    if (searchForm.department && !asset.department.includes(searchForm.department)) return false
    if (searchForm.supervisionDept && !asset.supervisionDept.includes(searchForm.supervisionDept)) return false
    if (searchForm.village && asset.village !== searchForm.village) return false
    return true
  })
})

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    if (projectSearch.value && !project.name.includes(projectSearch.value)) return false
    return true
  })
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const openAddDialog = () => {
  Object.keys(addForm).forEach(key => {
    addForm[key] = ''
  })
  addDialog.value = true
}

const confirmAdd = () => {
  if (!addForm.year) {
    ElMessage.error('请输入年度')
    return
  }
  if (!addForm.assetNo) {
    ElMessage.error('请输入资产编号')
    return
  }
  if (!addForm.assetName) {
    ElMessage.error('请输入资产名称')
    return
  }
  if (!addForm.assetProperty) {
    ElMessage.error('请选择资产属性')
    return
  }
  if (!addForm.assetType) {
    ElMessage.error('请选择资产类型')
    return
  }
  if (!addForm.assetForm) {
    ElMessage.error('请选择资产形态')
    return
  }
  if (!addForm.specificForm) {
    ElMessage.error('请选择具体形态')
    return
  }
  if (!addForm.village) {
    ElMessage.error('请选择村')
    return
  }

  assets.value.push({
    id: Date.now(),
    ...addForm
  })
  addDialog.value = false
  ElMessage.success('添加成功')
}

const openViewDialog = (asset) => {
  Object.keys(viewAssetData).forEach(key => {
    viewAssetData[key] = asset[key] || ''
  })
  viewDialog.value = true
}

const editAsset = (asset) => {
  ElMessage.info(`编辑资产: ${asset.assetName}`)
}

const deleteAsset = (asset) => {
  const index = assets.value.findIndex(a => a.id === asset.id)
  if (index > -1) {
    assets.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const openProjectSelector = () => {
  projectSearch.value = ''
  projectSelectorDialog.value = true
}

const selectProject = (project) => {
  addForm.projectId = project.id
  addForm.projectName = project.name
  projectSelectorDialog.value = false
}
</script>

<style scoped>
.asset-management {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.search-section {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 15px;
}

.search-row:last-child {
  margin-bottom: 0;
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

.form-input {
  width: 200px;
}

.form-select {
  width: 200px;
}

.search-actions {
  display: flex;
  gap: 10px;
}

.search-actions .el-button {
  width: 40px;
  padding: 0;
}

.table-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.asset-table {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.data-dialog {
  border-radius: 4px;
}

.form-content {
  padding: 10px 0;
}

.form-row {
  display: flex;
  gap: 25px;
  margin-bottom: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-size: 14px;
  color: #666;
}

.form-item label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.form-item label:not([class*="required"])::before {
  content: '';
  margin-right: 0;
}

.form-control {
  width: 220px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #409eff;
}

.project-selector {
  display: flex;
  gap: 0;
}

.project-input {
  flex: 1;
  border-radius: 4px 0 0 4px;
}

.project-selector .el-button {
  border-radius: 0 4px 4px 0;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-selector-content {
  padding: 10px 0;
}

.project-search {
  margin-bottom: 15px;
}

.project-search-input {
  width: 100%;
}

.project-table {
  width: 100%;
}

.view-content {
  padding: 10px 0;
}

.view-table {
  width: 100%;
  border-collapse: collapse;
}

.view-table td {
  border: 1px solid #dcdfe6;
  padding: 12px 15px;
}

.label-cell {
  background: #f5f7fa;
  font-weight: 500;
  color: #606266;
  width: 15%;
}

.value-cell {
  width: 18.33%;
  color: #303133;
}

.photo-preview {
  width: 150px;
  height: 100px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  color: #909399;
  font-size: 14px;
}
</style>