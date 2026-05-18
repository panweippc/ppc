<template>
  <div class="user-management">
    <div class="layout-container">
      <div class="left-panel">
        <el-tree
          :data="organizationTree"
          :props="treeProps"
          default-expand-all
          @node-click="handleTreeClick"
          class="org-tree"
        />
      </div>
      
      <div class="right-panel">
        <div class="search-section">
          <div class="search-row">
            <div class="search-item">
              <label class="search-label">姓名</label>
              <el-input v-model="searchForm.name" placeholder="请输入姓名" class="form-input" />
            </div>
            <div class="search-item">
              <label class="search-label">归属部门</label>
              <el-input v-model="searchForm.department" placeholder="请输入归属部门" class="form-input" />
            </div>
            <div class="search-item">
              <label class="search-label">登录名</label>
              <el-input v-model="searchForm.username" placeholder="请输入登录名" class="form-input" />
            </div>
            <div class="search-actions">
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button @click="handleReset">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </div>
          </div>
        </div>

        <div class="table-section">
          <div class="table-header">
            <el-button type="primary">导入</el-button>
            <el-button type="primary">导出</el-button>
            <el-button type="primary" @click="openAddUserDialog">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
          </div>
          <el-table :data="filteredUsers" border class="user-table">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="department" label="归属部门" />
            <el-table-column prop="username" label="登录名" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="电话" />
            <el-table-column prop="mobile" label="手机" />
            <el-table-column label="操作" width="280">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>
                  <el-button type="primary" size="small" @click="setVisibleRange(scope.row)">可见范围</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="filteredUsers.length"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="新增用户" v-model="addUserDialog" width="600px">
      <div class="form-section">
        <div class="section-title">基本信息</div>
        <div class="avatar-upload">
          <div class="avatar-preview">
            <img :src="addUserForm.avatar" alt="用户头像" class="avatar-img" />
          </div>
          <el-button size="small" type="primary">上传头像</el-button>
        </div>
        <div class="form-row">
          <el-form-item label="*用户姓名" class="form-item">
            <el-input v-model="addUserForm.name" placeholder="请输入用户姓名" style="width: 250px;" />
          </el-form-item>
          <el-form-item label="*用户工号" class="form-item">
            <el-input v-model="addUserForm.employeeId" placeholder="请输入用户工号" style="width: 250px;" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*登录账号" class="form-item">
            <el-input v-model="addUserForm.username" placeholder="请输入登录账号" style="width: 250px;" />
          </el-form-item>
          <el-form-item label="*登录密码" class="form-item">
            <el-input v-model="addUserForm.password" type="password" placeholder="请输入登录密码" style="width: 250px;" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*确认密码" class="form-item">
            <el-input v-model="addUserForm.confirmPassword" type="password" placeholder="请再次输入密码" style="width: 520px;" />
          </el-form-item>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">组织关系</div>
        <div class="form-row">
          <el-form-item label="*归属部门" class="form-item">
            <el-select v-model="addUserForm.department" style="width: 300px;">
              <el-option label="灏明县" value="灏明县" />
              <el-option label="光明镇" value="光明镇" />
              <el-option label="塔拉村" value="塔拉村" />
              <el-option label="敖包村" value="敖包村" />
              <el-option label="北山村" value="北山村" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="*用户角色" class="form-item">
            <div class="role-checkboxes">
              <label v-for="role in availableRoles" :key="role.value" class="role-checkbox">
                <input type="checkbox" v-model="addUserForm.roles" :value="role.value" />
                <span>{{ role.label }}</span>
              </label>
            </div>
          </el-form-item>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">联系方式</div>
        <div class="form-row">
          <el-form-item label="电话" class="form-item">
            <el-input v-model="addUserForm.phone" placeholder="请输入电话" style="width: 250px;" />
          </el-form-item>
          <el-form-item label="手机" class="form-item">
            <el-input v-model="addUserForm.mobile" placeholder="请输入手机" style="width: 250px;" />
          </el-form-item>
        </div>
      </div>

      <template #footer>
        <el-button @click="addUserDialog = false">返回</el-button>
        <el-button type="primary" @click="confirmAddUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  name: '',
  department: '',
  username: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const selectedOrg = ref('')

const treeProps = {
  label: 'label',
  children: 'children'
}

const organizationTree = ref([
  {
    id: '1',
    label: '灏明县',
    children: [
      {
        id: '1-1',
        label: '光明镇',
        children: [
          { id: '1-1-1', label: '塔拉村' },
          { id: '1-1-2', label: '塔拉北' },
          { id: '1-1-3', label: '塔拉中' },
          { id: '1-1-4', label: '塔拉南' }
        ]
      },
      {
        id: '1-2',
        label: '敖包村',
        children: [
          { id: '1-2-1', label: '敖包北' },
          { id: '1-2-2', label: '敖包中' },
          { id: '1-2-3', label: '敖包南' }
        ]
      },
      { id: '1-3', label: '北山村' }
    ]
  }
])

const availableRoles = [
  { label: 'L', value: 'L' },
  { label: 'N', value: 'N' },
  { label: 'SL', value: 'SL' },
  { label: 'app-工作红', value: 'app-工作红' },
  { label: 'app工作蓝', value: 'app工作蓝' }
]

const users = ref([
  { id: 1, name: 'N村管理员', username: '111', employeeId: '001', department: '灏明县', phone: '13256789012', mobile: '13256789012', roles: ['L'], avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20of%20a%20village%20administrator&image_size=square' },
  { id: 2, name: '张一具', username: 'zyx', employeeId: '002', department: '灏明县', phone: '12331345678', mobile: '12331345678', roles: ['N'], avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20of%20a%20government%20official&image_size=square' },
  { id: 3, name: '张小小(测试)', username: '123456', employeeId: '003', department: '灏明县', phone: '15391112345', mobile: '15391112345', roles: ['SL'], avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20of%20a%20young%20professional&image_size=square' },
  { id: 4, name: '测试', username: 'testll', employeeId: '004', department: '灏明县', phone: '0471-1234567', mobile: '15888812345', roles: ['app-工作红'], avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20of%20a%20test%20user&image_size=square' },
  { id: 5, name: '测试管理员', username: 'testln', employeeId: '005', department: '灏明县', phone: '0471-2345678', mobile: '15888823456', roles: ['app工作蓝'], avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20of%20an%20admin&image_size=square' },
  { id: 6, name: '系统管理员', username: 'admin', employeeId: '006', department: '灏明县', phone: '0471-3456789', mobile: '15888834567', roles: ['L', 'N'], avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20portrait%20of%20a%20system%20administrator&image_size=square' }
])

const addUserDialog = ref(false)
const addUserForm = reactive({
  name: '',
  employeeId: '',
  username: '',
  password: '',
  confirmPassword: '',
  department: '',
  roles: [],
  phone: '',
  mobile: '',
  avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=default%20user%20avatar%20portrait&image_size=square'
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    if (searchForm.name && !user.name.includes(searchForm.name)) return false
    if (searchForm.department && !user.department.includes(searchForm.department)) return false
    if (searchForm.username && !user.username.includes(searchForm.username)) return false
    if (selectedOrg.value && !user.department.includes(selectedOrg.value)) return false
    return true
  })
})

const handleTreeClick = (data) => {
  selectedOrg.value = data.label
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.department = ''
  searchForm.username = ''
  selectedOrg.value = ''
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const openAddUserDialog = () => {
  Object.assign(addUserForm, {
    name: '',
    employeeId: '',
    username: '',
    password: '',
    confirmPassword: '',
    department: '',
    roles: [],
    phone: '',
    mobile: '',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=default%20user%20avatar%20portrait&image_size=square'
  })
  addUserDialog.value = true
}

const confirmAddUser = () => {
  if (!addUserForm.name) {
    ElMessage.error('请输入用户姓名')
    return
  }
  if (!addUserForm.username) {
    ElMessage.error('请输入登录账号')
    return
  }
  if (!addUserForm.password) {
    ElMessage.error('请输入登录密码')
    return
  }
  if (addUserForm.password !== addUserForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (!addUserForm.department) {
    ElMessage.error('请选择归属部门')
    return
  }
  if (addUserForm.roles.length === 0) {
    ElMessage.error('请选择用户角色')
    return
  }

  users.value.push({
    id: Date.now(),
    ...addUserForm
  })
  addUserDialog.value = false
  ElMessage.success('用户添加成功')
}

const editUser = (user) => {
  ElMessage.info(`编辑用户: ${user.name}`)
}

const deleteUser = (user) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index > -1) {
    users.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const setVisibleRange = (user) => {
  ElMessage.info(`设置可见范围: ${user.name}`)
}
</script>

<style scoped>
.user-management {
  padding: 20px;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.layout-container {
  display: flex;
  height: 100%;
  gap: 20px;
}

.left-panel {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
}

.org-tree {
  max-height: calc(100vh - 150px);
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
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

.search-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.table-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.user-table {
  flex: 1;
  overflow-y: auto;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-left: 5px;
  border-left: 3px solid #007bff;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed #ddd;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.role-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.role-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.role-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
</style>