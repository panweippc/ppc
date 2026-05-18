<template>
  <div class="role-management">
    <div class="table-section">
      <div class="table-header">
        <h3>角色列表</h3>
        <el-button type="primary" @click="openAddRoleDialog">
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="roles" border class="role-table">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleNameEn" label="英文名称" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="editRole(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteRole(scope.row)">删除</el-button>
              <el-button type="primary" size="small" @click="assignPermission(scope.row)">分配</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="roles.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog title="新增角色" v-model="addRoleDialog" width="450px">
      <el-form :model="addRoleForm" label-width="100px">
        <el-form-item label="*角色名称">
          <el-input v-model="addRoleForm.roleName" placeholder="请输入角色名称" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="*英文名称">
          <el-input v-model="addRoleForm.roleNameEn" placeholder="请输入英文名称" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.description" type="textarea" placeholder="请输入角色描述" style="width: 300px; height: 80px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addRoleDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddRole">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="分配权限" v-model="permissionDialog" width="600px">
      <div class="permission-tree">
        <el-tree
          :data="permissionTree"
          :props="treeProps"
          show-checkbox
          :default-checked-keys="selectedPermissions"
          node-key="id"
          ref="permissionTreeRef"
          class="permission-tree-el"
        />
      </div>
      <template #footer>
        <el-button @click="permissionDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAssignPermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const currentPage = ref(1)
const pageSize = ref(10)

const treeProps = {
  label: 'label',
  children: 'children'
}

const roles = ref([
  { id: 1, roleName: 'L', roleNameEn: 'L', description: '管理员角色' },
  { id: 2, roleName: 'N', roleNameEn: 'N', description: '普通用户角色' },
  { id: 3, roleName: 'SL', roleNameEn: 'SL', description: '超级管理员角色' },
  { id: 4, roleName: 'app-工作红', roleNameEn: 'app-hong', description: '工作红角色' },
  { id: 5, roleName: 'app工作蓝', roleNameEn: 'app-lan', description: '工作蓝角色' },
  { id: 6, roleName: 'ceshicun', roleNameEn: 'ceshi2', description: '测试村角色' }
])

const permissionTree = ref([
  {
    id: '1',
    label: '村组织管理',
    children: [
      { id: '1-1', label: '党支部信息管理', children: [
        { id: '1-1-1', label: '查看' },
        { id: '1-1-2', label: '新增' },
        { id: '1-1-3', label: '编辑' },
        { id: '1-1-4', label: '删除' }
      ]},
      { id: '1-2', label: '党员基础信息', children: [
        { id: '1-2-1', label: '查看' },
        { id: '1-2-2', label: '新增' },
        { id: '1-2-3', label: '编辑' },
        { id: '1-2-4', label: '删除' }
      ]},
      { id: '1-3', label: '村委会信息维护', children: [
        { id: '1-3-1', label: '查看' },
        { id: '1-3-2', label: '新增' },
        { id: '1-3-3', label: '编辑' },
        { id: '1-3-4', label: '删除' }
      ]}
    ]
  },
  {
    id: '2',
    label: '村民信息管理',
    children: [
      { id: '2-1', label: '户基本信息', children: [
        { id: '2-1-1', label: '查看' },
        { id: '2-1-2', label: '新增' },
        { id: '2-1-3', label: '编辑' },
        { id: '2-1-4', label: '删除' },
        { id: '2-1-5', label: '补贴' },
        { id: '2-1-6', label: '帮扶' }
      ]},
      { id: '2-2', label: '人员变动', children: [
        { id: '2-2-1', label: '查看' },
        { id: '2-2-2', label: '新增' },
        { id: '2-2-3', label: '编辑' },
        { id: '2-2-4', label: '删除' }
      ]}
    ]
  },
  {
    id: '3',
    label: '协同任务管理',
    children: [
      { id: '3-1', label: '任务管理', children: [
        { id: '3-1-1', label: '查看' },
        { id: '3-1-2', label: '新增' },
        { id: '3-1-3', label: '编辑' },
        { id: '3-1-4', label: '删除' },
        { id: '3-1-5', label: '指派' },
        { id: '3-1-6', label: '验收' }
      ]},
      { id: '3-2', label: '任务统计报表', children: [
        { id: '3-2-1', label: '查看' }
      ]},
      { id: '3-3', label: '任务提醒设置', children: [
        { id: '3-3-1', label: '查看' },
        { id: '3-3-2', label: '编辑' }
      ]}
    ]
  },
  {
    id: '4',
    label: '系统设置',
    children: [
      { id: '4-1', label: '用户管理', children: [
        { id: '4-1-1', label: '查看' },
        { id: '4-1-2', label: '新增' },
        { id: '4-1-3', label: '编辑' },
        { id: '4-1-4', label: '删除' }
      ]},
      { id: '4-2', label: '角色管理', children: [
        { id: '4-2-1', label: '查看' },
        { id: '4-2-2', label: '新增' },
        { id: '4-2-3', label: '编辑' },
        { id: '4-2-4', label: '删除' },
        { id: '4-2-5', label: '权限分配' }
      ]}
    ]
  }
])

const addRoleDialog = ref(false)
const addRoleForm = reactive({
  roleName: '',
  roleNameEn: '',
  description: ''
})

const permissionDialog = ref(false)
const selectedRole = ref(null)
const selectedPermissions = ref([])
const permissionTreeRef = ref(null)

const handlePageChange = (page) => {
  currentPage.value = page
}

const openAddRoleDialog = () => {
  addRoleForm.roleName = ''
  addRoleForm.roleNameEn = ''
  addRoleForm.description = ''
  addRoleDialog.value = true
}

const confirmAddRole = () => {
  if (!addRoleForm.roleName) {
    ElMessage.error('请输入角色名称')
    return
  }
  if (!addRoleForm.roleNameEn) {
    ElMessage.error('请输入英文名称')
    return
  }

  roles.value.push({
    id: Date.now(),
    roleName: addRoleForm.roleName,
    roleNameEn: addRoleForm.roleNameEn,
    description: addRoleForm.description
  })
  addRoleDialog.value = false
  ElMessage.success('角色添加成功')
}

const editRole = (role) => {
  addRoleForm.roleName = role.roleName
  addRoleForm.roleNameEn = role.roleNameEn
  addRoleForm.description = role.description
  addRoleDialog.value = true
}

const deleteRole = (role) => {
  const index = roles.value.findIndex(r => r.id === role.id)
  if (index > -1) {
    roles.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const assignPermission = (role) => {
  selectedRole.value = role
  selectedPermissions.value = []
  permissionDialog.value = true
}

const confirmAssignPermission = () => {
  if (permissionTreeRef.value) {
    selectedPermissions.value = permissionTreeRef.value.getCheckedKeys()
  }
  permissionDialog.value = false
  ElMessage.success('权限分配成功')
}
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.table-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.role-table {
  width: 100%;
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

.permission-tree {
  max-height: 400px;
  overflow-y: auto;
}

.permission-tree-el {
  max-height: 400px;
}
</style>