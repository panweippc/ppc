<template>
  <div class="member-management">
    <div class="left-panel" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-content">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="branch-tree">
          <div 
            v-for="branch in branchList" 
            :key="branch.id" 
            class="tree-item"
            :class="{ active: selectedBranch?.id === branch.id }"
            @click="selectBranch(branch)"
          >
            {{ branch.name }}
          </div>
        </div>
      </div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <el-icon v-if="sidebarCollapsed"><ArrowRight /></el-icon>
        <el-icon v-else><ArrowLeft /></el-icon>
      </button>
    </div>
    
    <div class="right-panel">
      <div class="filter-section">
        <el-form :model="filterForm" inline>
          <el-form-item label="姓名">
            <el-input v-model="filterForm.name" placeholder="请输入姓名" style="width: 150px;" />
          </el-form-item>
          <el-form-item label="入党时间">
            <el-date-picker
              v-model="filterForm.joinStartDate"
              type="date"
              placeholder="开始日期"
              value-format="YYYY-MM-DD"
              style="width: 120px;"
            />
            <span class="date-arrow">→</span>
            <el-date-picker
              v-model="filterForm.joinEndDate"
              type="date"
              placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 120px;"
            />
          </el-form-item>
          <el-form-item label="变动类型">
            <el-select v-model="filterForm.changeType" placeholder="请选择变动类型" style="width: 150px;">
              <el-option label="全部" value="" />
              <el-option label="新增" value="add" />
              <el-option label="转出" value="transfer_out" />
              <el-option label="转入" value="transfer_in" />
              <el-option label="退休" value="retire" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <span class="search-icon">🔍</span>
            </el-button>
            <el-button @click="handleReset">
              <span class="reset-icon">C</span>
            </el-button>
          </el-form-item>
        </el-form>
        
        <el-form :model="filterForm" inline style="margin-top: 10px;">
          <el-form-item label="职务/岗位">
            <el-select v-model="filterForm.position" placeholder="请选择职务" style="width: 150px;">
              <el-option label="全部" value="" />
              <el-option label="书记" value="secretary" />
              <el-option label="副书记" value="vice_secretary" />
              <el-option label="委员" value="committee" />
            </el-select>
          </el-form-item>
          <el-form-item label="任职时间">
            <el-date-picker
              v-model="filterForm.termStartDate"
              type="date"
              placeholder="开始日期"
              value-format="YYYY-MM-DD"
              style="width: 120px;"
            />
            <span class="date-arrow">→</span>
            <el-date-picker
              v-model="filterForm.termEndDate"
              type="date"
              placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 120px;"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <div class="table-header">
        <span class="header-title">党员列表</span>
        <button class="add-btn" @click="handleAdd">
          <span class="add-icon">+</span> 新增
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>所属党组</th>
              <th>村</th>
              <th>姓名</th>
              <th>性别</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td>{{ item.branch }}</td>
            <td>{{ item.village }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.gender }}</td>
            <td class="action-buttons">
              <button class="btn btn-view" @click="handleView(item)">查看</button>
              <button class="btn btn-edit" @click="handleEdit(item)">编辑</button>
              <button class="btn btn-delete" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="horizontal-scroll-bar">
        <div class="scroll-track">
          <div class="scroll-thumb"></div>
        </div>
      </div>
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
      title="数据信息" 
      v-model="dialogVisible" 
      width="900px"
      class="form-dialog"
    >
      <div class="form-content">
        <el-form :model="formData" label-width="100px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="*所属党组">
                <el-select v-model="formData.branch" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="branch in branchList"
                    :key="branch.id"
                    :label="branch.name"
                    :value="branch.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="*村">
                <el-select v-model="formData.village" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="group in groupOptions"
                    :key="group"
                    :label="group"
                    :value="group"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="*姓名">
                <el-input v-model="formData.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="照片">
                <div class="photo-upload">
                  <div class="upload-area">
                    <span class="upload-icon">+</span>
                    <span class="upload-text">上传照片</span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="*性别">
                <el-select v-model="formData.gender" placeholder="请选择" style="width: 100%;">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="*民族">
                <el-select v-model="formData.nation" placeholder="请选择" style="width: 100%;">
                  <el-option label="汉族" value="汉族" />
                  <el-option label="回族" value="回族" />
                  <el-option label="维吾尔族" value="维吾尔族" />
                  <el-option label="藏族" value="藏族" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学历">
                <el-select v-model="formData.education" placeholder="请选择" style="width: 100%;">
                  <el-option label="小学" value="小学" />
                  <el-option label="初中" value="初中" />
                  <el-option label="高中" value="高中" />
                  <el-option label="大专" value="大专" />
                  <el-option label="本科" value="本科" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="*联系方式">
                <el-input v-model="formData.phone" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="*身份证号">
                <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入党时间">
                <el-date-picker
                  v-model="formData.joinDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请日期">
                <el-date-picker
                  v-model="formData.applyDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="*介绍人一">
                <el-input v-model="formData.introducer1" placeholder="请输入介绍人一" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="*介绍人二">
                <el-input v-model="formData.introducer2" placeholder="请输入介绍人二" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="6">
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="是否成为积极分子">
                <el-select v-model="formData.isActiveMember" placeholder="请选择" style="width: 100%;">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="成为积极分子时间">
                <el-date-picker
                  v-model="formData.activeMemberDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否成为发展对象">
                <el-select v-model="formData.isDevelopmentObject" placeholder="请选择" style="width: 100%;">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="成为发展对象时间">
                <el-date-picker
                  v-model="formData.developmentObjectDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="是否成为预备党员">
                <el-select v-model="formData.isProbationary" placeholder="请选择" style="width: 100%;">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="成为预备党员时间">
                <el-date-picker
                  v-model="formData.probationaryDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否转正">
                <el-select v-model="formData.isFormal" placeholder="请选择" style="width: 100%;">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正时间">
                <el-date-picker
                  v-model="formData.formalDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="组织批准人">
                <el-input v-model="formData.approver" placeholder="请输入组织批准人" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="批准日期">
                <el-date-picker
                  v-model="formData.approvalDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="党费（元/年）">
                <el-input v-model="formData.dues" placeholder="请输入党费金额" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="任职时间">
                <el-date-picker
                  v-model="formData.termDate"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="奖惩情况">
                <el-input v-model="formData.rewards" placeholder="请输入奖惩情况" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input v-model="formData.remark" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <div class="section-divider">职务</div>
          
          <div v-for="(duty, index) in dutyList" :key="index" class="duty-row">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item :label="`*任职党组`">
                  <el-select v-model="duty.branch" placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="branch in branchList"
                      :key="branch.id"
                      :label="branch.name"
                      :value="branch.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="`*职务/岗位`">
                  <el-select v-model="duty.position" placeholder="请选择" style="width: 100%;">
                    <el-option label="书记" value="书记" />
                    <el-option label="副书记" value="副书记" />
                    <el-option label="委员" value="委员" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="`*任职时间`">
                  <div class="date-range">
                    <el-date-picker
                      v-model="duty.startDate"
                      type="date"
                      placeholder="开始日期"
                      style="width: 45%;"
                      value-format="YYYY-MM-DD"
                    />
                    <span class="date-arrow">→</span>
                    <el-date-picker
                      v-model="duty.endDate"
                      type="date"
                      placeholder="结束日期"
                      style="width: 45%;"
                      value-format="YYYY-MM-DD"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="delete-col">
                <el-button type="danger" icon="delete" circle @click="handleDeleteDuty(index)" />
              </el-col>
            </el-row>
          </div>
          
          <div class="add-duty-container">
            <el-button type="primary" @click="handleAddDuty">
              <span>+</span> 添加
            </el-button>
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
    
    <el-dialog 
      title="数据信息" 
      v-model="viewDialogVisible" 
      width="900px"
      class="view-dialog"
    >
      <div class="view-content">
        <div class="info-table-wrapper">
          <table class="info-table">
            <tbody>
              <tr>
                <td class="label-cell">所属党组</td>
                <td class="value-cell">{{ viewData.branch }}</td>
                <td class="label-cell">村</td>
                <td class="value-cell">{{ viewData.village }}</td>
                <td class="photo-cell" rowspan="6">
                  <div class="photo-placeholder">
                    <img src="" alt="照片" class="photo-img" />
                    <span v-if="!viewData.photo" class="no-photo">暂无照片</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="label-cell">姓名</td>
                <td class="value-cell">{{ viewData.name }}</td>
                <td class="label-cell">性别</td>
                <td class="value-cell">{{ viewData.gender }}</td>
              </tr>
              <tr>
                <td class="label-cell">民族</td>
                <td class="value-cell">{{ viewData.nation }}</td>
                <td class="label-cell">学历</td>
                <td class="value-cell">{{ viewData.education }}</td>
              </tr>
              <tr>
                <td class="label-cell">联系方式</td>
                <td class="value-cell">{{ viewData.phone }}</td>
                <td class="label-cell">身份证号</td>
                <td class="value-cell">{{ viewData.idCard }}</td>
              </tr>
              <tr>
                <td class="label-cell">入党时间</td>
                <td class="value-cell">{{ viewData.joinDate }}</td>
                <td class="label-cell">介绍人一</td>
                <td class="value-cell">{{ viewData.introducer1 }}</td>
              </tr>
              <tr>
                <td class="label-cell">介绍人二</td>
                <td class="value-cell">{{ viewData.introducer2 }}</td>
                <td class="label-cell">申请日期</td>
                <td class="value-cell">{{ viewData.applyDate }}</td>
              </tr>
              <tr>
                <td class="label-cell">是否成为积极分子</td>
                <td class="value-cell">{{ viewData.isActiveMember }}</td>
                <td class="label-cell">成为积极分子时间</td>
                <td class="value-cell" colspan="2">{{ viewData.activeMemberDate }}</td>
              </tr>
              <tr>
                <td class="label-cell">是否成为发展对象</td>
                <td class="value-cell">{{ viewData.isDevelopmentObject }}</td>
                <td class="label-cell">成为发展对象时间</td>
                <td class="value-cell" colspan="2">{{ viewData.developmentObjectDate }}</td>
              </tr>
              <tr>
                <td class="label-cell">是否成为预备党员</td>
                <td class="value-cell">{{ viewData.isProbationary }}</td>
                <td class="label-cell">成为预备党员时间</td>
                <td class="value-cell" colspan="2">{{ viewData.probationaryDate }}</td>
              </tr>
              <tr>
                <td class="label-cell">是否转正</td>
                <td class="value-cell">{{ viewData.isFormal }}</td>
                <td class="label-cell">转正时间</td>
                <td class="value-cell" colspan="2">{{ viewData.formalDate }}</td>
              </tr>
              <tr>
                <td class="label-cell">组织批准人</td>
                <td class="value-cell">{{ viewData.approver }}</td>
                <td class="label-cell">批准日期</td>
                <td class="value-cell" colspan="2">{{ viewData.approvalDate }}</td>
              </tr>
              <tr>
                <td class="label-cell">党费</td>
                <td class="value-cell">{{ viewData.dues }}元</td>
                <td class="label-cell">奖惩情况</td>
                <td class="value-cell" colspan="2">{{ viewData.rewards }}</td>
              </tr>
              <tr>
                <td class="label-cell">状态</td>
                <td class="value-cell">{{ viewData.status }}</td>
                <td class="label-cell"></td>
                <td class="value-cell" colspan="2"></td>
              </tr>
              <tr>
                <td class="label-cell">备注</td>
                <td class="value-cell" colspan="4">{{ viewData.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="section-divider">职务</div>
        <div class="duty-section">
          <div v-for="(duty, index) in viewDutyList" :key="index" class="duty-item">
            <span class="duty-label">任职党组：</span>
            <span class="duty-value">{{ duty.branch }}</span>
            <span class="duty-label">职务/岗位：</span>
            <span class="duty-value">{{ duty.position }}</span>
            <span class="duty-label">任职时间：</span>
            <span class="duty-value">{{ duty.startDate }} - {{ duty.endDate }}</span>
          </div>
        </div>
        
        <div class="section-divider">变动记录</div>
        <div class="change-section">
          <div v-for="(change, index) in viewChangeList" :key="index" class="change-item">
            <div class="change-row">
              <div class="change-field">
                <span class="change-label">变动原因：</span>
                <span class="change-value">{{ change.reason }}</span>
              </div>
              <div class="change-field">
                <span class="change-label">变动日期：</span>
                <span class="change-value">{{ change.date }}</span>
              </div>
            </div>
            <div class="change-row">
              <div class="change-field">
                <span class="change-label">变动类型：</span>
                <span class="change-value">{{ change.type }}</span>
              </div>
              <div class="change-field">
                <span class="change-label">原党支部：</span>
                <span class="change-value">{{ change.originalBranch }}</span>
              </div>
            </div>
            <div class="change-row">
              <div class="change-field">
                <span class="change-label">调入党支部：</span>
                <span class="change-value">{{ change.targetBranch }}</span>
              </div>
              <div class="change-field">
                <span class="change-label">备注：</span>
                <span class="change-value">{{ change.remark }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleCloseView">关闭</el-button>
      </template>
    </el-dialog>

    <div class="back-to-top" @click="scrollToTop">
      <el-button type="primary" size="small" round>
        <el-icon><ArrowUp /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getChangeRecordsByMember } from '../store/changeRecords'
import { groupOptions } from '../store/organization'
import { ArrowUp, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const searchKeyword = ref('')
const selectedBranch = ref(null)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('新增党员')

const filterForm = ref({
  name: '',
  joinStartDate: '',
  joinEndDate: '',
  changeType: '',
  position: '',
  termStartDate: '',
  termEndDate: ''
})

const branchList = ref([
  { id: 1, name: '塔拉村党支部' },
  { id: 2, name: '红旗村党支部' },
  { id: 3, name: '红星村党支部' },
  { id: 4, name: '前进村党支部' }
])

const tableData = ref([
  { id: 1, branch: '塔拉村党支部', village: '塔拉北', name: '王赞', gender: '男' },
  { id: 2, branch: '塔拉村党支部', village: '塔拉村', name: '张思思', gender: '男' },
  { id: 3, branch: '塔拉村党支部', village: '塔拉村', name: '张思思', gender: '男' },
  { id: 4, branch: '塔拉村党支部', village: '塔拉村', name: '张强', gender: '男' },
  { id: 5, branch: '塔拉村党支部', village: '塔拉村', name: '何花', gender: '女' },
  { id: 6, branch: '塔拉村党支部', village: '塔拉北', name: '赵倩', gender: '男' },
  { id: 7, branch: '塔拉村党支部', village: '塔拉中', name: '王五', gender: '男' },
  { id: 8, branch: '塔拉村党支部', village: '塔拉北', name: '李华', gender: '女' },
  { id: 9, branch: '塔拉村党支部', village: '塔拉南', name: '张百万', gender: '男' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => tableData.value.length)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const formData = ref({
  branch: '',
  village: '',
  name: '',
  gender: '',
  nation: '',
  education: '',
  phone: '',
  idCard: '',
  joinDate: '',
  applyDate: '',
  introducer1: '',
  introducer2: '',
  isActiveMember: '',
  activeMemberDate: '',
  isDevelopmentObject: '',
  developmentObjectDate: '',
  isProbationary: '',
  probationaryDate: '',
  isFormal: '',
  formalDate: '',
  approver: '',
  approvalDate: '',
  dues: '',
  termDate: '',
  rewards: '',
  remark: ''
})

const dutyList = ref([
  { branch: '', position: '', startDate: '', endDate: '' }
])

const viewData = ref({
  branch: '',
  village: '',
  name: '',
  gender: '',
  nation: '',
  education: '',
  phone: '',
  idCard: '',
  joinDate: '',
  applyDate: '',
  introducer1: '',
  introducer2: '',
  isActiveMember: '',
  activeMemberDate: '',
  isDevelopmentObject: '',
  developmentObjectDate: '',
  isProbationary: '',
  probationaryDate: '',
  isFormal: '',
  formalDate: '',
  approver: '',
  approvalDate: '',
  dues: '',
  rewards: '',
  status: '',
  remark: '',
  photo: ''
})

const viewDutyList = ref([
  { branch: '', position: '', startDate: '', endDate: '' }
])

const viewChangeList = ref([
  { reason: '', date: '', type: '', originalBranch: '', targetBranch: '', remark: '' }
])

const changeTypeMap = {
  'add': '新增',
  'transfer_out': '转出',
  'transfer_in': '转入',
  'retire': '退休'
}

const getChangeTypeLabel = (type) => {
  return changeTypeMap[type] || ''
}

const handleSearch = () => {
  console.log('搜索:', filterForm.value)
}

const handleReset = () => {
  filterForm.value = {
    name: '',
    joinStartDate: '',
    joinEndDate: '',
    changeType: '',
    position: '',
    termStartDate: '',
    termEndDate: ''
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const selectBranch = (branch) => {
  selectedBranch.value = branch
}

const resetFormData = () => {
  formData.value = {
    branch: '',
    village: '',
    name: '',
    gender: '',
    nation: '',
    education: '',
    phone: '',
    idCard: '',
    joinDate: '',
    applyDate: '',
    introducer1: '',
    introducer2: '',
    isActiveMember: '',
    activeMemberDate: '',
    isDevelopmentObject: '',
    developmentObjectDate: '',
    isProbationary: '',
    probationaryDate: '',
    isFormal: '',
    formalDate: '',
    approver: '',
    approvalDate: '',
    dues: '',
    termDate: '',
    rewards: '',
    remark: ''
  }
  dutyList.value = [{ branch: '', position: '', startDate: '', endDate: '' }]
}

const handleAdd = () => {
  dialogTitle.value = '新增党员'
  resetFormData()
  dialogVisible.value = true
}

const handleAddDuty = () => {
  dutyList.value.push({ branch: '', position: '', startDate: '', endDate: '' })
}

const handleDeleteDuty = (index) => {
  if (dutyList.value.length > 1) {
    dutyList.value.splice(index, 1)
  } else {
    ElMessage.info('至少保留一条职务信息')
  }
}

const handleView = (item) => {
  viewData.value = {
    branch: item.branch || '塔拉村党支部',
    village: item.village || '塔拉北',
    name: item.name || '王赞',
    gender: item.gender || '男',
    nation: '汉族',
    education: '大专',
    phone: '15612345678',
    idCard: '150123199812120123',
    joinDate: '2019-07-19',
    applyDate: '',
    introducer1: '李伟',
    introducer2: '张丽',
    isActiveMember: '是',
    activeMemberDate: '',
    isDevelopmentObject: '是',
    developmentObjectDate: '',
    isProbationary: '是',
    probationaryDate: '',
    isFormal: '是',
    formalDate: '',
    approver: '',
    approvalDate: '',
    dues: '600.00',
    rewards: '',
    status: '调出',
    remark: '',
    photo: ''
  }
  
  viewDutyList.value = [
    { branch: '塔拉村党支部', position: '副书记', startDate: '2022-07-13', endDate: '2024-08-22' }
  ]
  
  const records = getChangeRecordsByMember(item.name || '王赞')
  viewChangeList.value = records.map(record => ({
    reason: record.reason,
    date: record.date,
    type: record.type,
    originalBranch: record.originalBranch,
    targetBranch: record.targetBranch,
    remark: record.remark
  }))
  
  viewDialogVisible.value = true
}

const handleCloseView = () => {
  viewDialogVisible.value = false
}

const handleEdit = (item) => {
  dialogTitle.value = '编辑党员'
  formData.value = { ...item }
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

const handleCancel = () => {
  dialogVisible.value = false
}

const handleSubmit = () => {
  dialogVisible.value = false
  ElMessage.success('操作成功')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.member-management {
  display: flex;
  height: 100%;
}

.left-panel {
  width: 240px;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
}

.left-panel.collapsed {
  width: 24px;
}

.left-panel.collapsed .sidebar-content {
  display: none;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.sidebar-toggle:hover {
  background-color: #f5f5f5;
}

.search-box {
  padding: 15px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.branch-tree {
  flex: 1;
  padding: 0 10px;
  overflow-y: auto;
}

.tree-item {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 14px;
}

.tree-item:hover {
  background-color: #e9ecef;
}

.tree-item.active {
  background-color: #007bff;
  color: #fff;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.filter-section {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.date-arrow {
  margin: 0 8px;
  color: #999;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.header-title {
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
}

.btn {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-view,
.btn-edit {
  background-color: #007bff;
  color: #fff;
}

.btn-view:hover,
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

.form-dialog :deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.form-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: bold;
}

.form-content {
  padding: 10px 0;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 3px solid #007bff;
}

.view-dialog :deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.view-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.info-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.photo-upload {
  display: flex;
  align-items: center;
}

.upload-area {
  width: 120px;
  height: 140px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #007bff;
}

.upload-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 5px;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

.section-divider {
  font-size: 14px;
  color: #666;
  padding: 15px 0 10px 0;
  margin: 10px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-arrow {
  color: #999;
}

.duty-row {
  margin-bottom: 15px;
}

.delete-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.add-duty-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.info-table-wrapper {
  margin-bottom: 20px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
}

.info-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
}

.label-cell {
  width: 15%;
  background-color: #f8f9fa;
  font-weight: 500;
  text-align: right;
  color: #666;
}

.value-cell {
  width: 35%;
  color: #333;
}

.photo-cell {
  width: 150px;
  vertical-align: top;
}

.photo-placeholder {
  width: 140px;
  height: 180px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  font-size: 12px;
  color: #999;
}

.duty-section {
  margin-bottom: 20px;
}

.duty-item {
  padding: 12px 15px;
  background-color: #fafafa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.duty-label {
  color: #666;
  margin-right: 5px;
}

.duty-value {
  color: #333;
  margin-right: 20px;
}

.change-section {
  margin-bottom: 10px;
}

.change-item {
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
}

.change-row {
  display: flex;
  margin-bottom: 15px;
}

.change-row:last-child {
  margin-bottom: 0;
}

.change-field {
  flex: 1;
  display: flex;
}

.change-label {
  color: #666;
  margin-right: 8px;
  min-width: 80px;
}

.change-value {
  color: #333;
}

.table-container {
  position: relative;
  overflow-x: auto;
}

.data-table {
  min-width: 100%;
}

.horizontal-scroll-bar {
  height: 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #e8e8e8;
  position: relative;
}

.scroll-track {
  height: 6px;
  background-color: #e8e8e8;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  transform: translateY(-50%);
}

.scroll-thumb {
  height: 100%;
  background-color: #c0c4cc;
  border-radius: 3px;
  cursor: pointer;
}

.scroll-thumb:hover {
  background-color: #909399;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}
</style>