<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="logo-section">
        <h1 class="logo-title">乡村振兴局</h1>
        <p class="logo-subtitle">管理系统</p>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        mode="vertical"
        background-color="#007bff"
        text-color="#fff"
        active-text-color="#fff"
        :collapse="false"
      >
        <template v-for="item in menuItems" :key="item.id">
          <el-sub-menu :index="item.id">
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="child in item.children" :key="child.id">
              <template v-if="child.children && child.children.length > 0">
                <el-sub-menu :index="child.id">
                  <template #title>{{ child.name }}</template>
                  <el-menu-item
                    v-for="grandchild in child.children"
                    :key="grandchild.id"
                    :index="grandchild.id"
                    @click="handleMenuClick(grandchild)"
                  >
                    {{ grandchild.name }}
                  </el-menu-item>
                </el-sub-menu>
              </template>
              <template v-else>
                <el-menu-item :index="child.id" @click="handleMenuClick(child)">
                  {{ child.name }}
                </el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </aside>
    
    <main class="main-content">
      <header class="header">
        <div class="header-title">{{ currentPageTitle }}</div>
        <div class="header-user">
          <span>管理员</span>
          <el-button type="text" size="small">退出登录</el-button>
        </div>
      </header>
      
      <div class="content-area">
        <transition name="fade" mode="out-in">
          <component :is="currentComponent" v-if="currentComponent" />
          <div v-else class="content-placeholder">
            <el-card class="welcome-card">
              <div class="welcome-icon">🏡</div>
              <h2>欢迎使用乡村振兴局管理系统</h2>
              <p>请从左侧菜单选择要操作的功能模块</p>
            </el-card>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import PartyBranchManagement from './components/PartyBranchManagement.vue'
import PartyMemberInfo from './components/PartyMemberInfo.vue'
import PartyMemberChange from './components/PartyMemberChange.vue'
import VillageCommittee from './components/VillageCommittee.vue'
import VillageMemberFile from './components/VillageMemberFile.vue'
import OversightCommittee from './components/OversightCommittee.vue'
import TaskForce from './components/TaskForce.vue'
import WorkLog from './components/WorkLog.vue'
import PartyMeetingRecord from './components/PartyMeetingRecord.vue'
import HouseholdBasicInfo from './components/HouseholdBasicInfo.vue'

const activeMenu = ref('1-1')
const currentPageTitle = ref('欢迎')
const currentComponent = ref(null)

const menuItems = ref([
  {
    id: '1',
    name: '村组织管理',
    children: [
      {
        id: '1-1',
        name: '村支部及党员管理',
        children: [
          { id: '1-1-1', name: '党支部信息管理', component: markRaw(PartyBranchManagement) },
          { id: '1-1-2', name: '党员基础信息', component: markRaw(PartyMemberInfo) },
          { id: '1-1-3', name: '党员组织关系' },
          { id: '1-1-4', name: '党员变动登记', component: markRaw(PartyMemberChange) },
          { id: '1-1-5', name: '党员会议记录', component: markRaw(PartyMeetingRecord) }
        ]
      },
      {
        id: '1-2',
        name: '村委会管理',
        children: [
          { id: '1-2-1', name: '村委会信息维护', component: markRaw(VillageCommittee) },
          { id: '1-2-2', name: '村委成员档案', component: markRaw(VillageMemberFile) },
          { id: '1-2-3', name: '村委分工安排' }
        ]
      },
      { id: '1-3', name: '驻村工作队信息', component: markRaw(TaskForce) },
      { id: '1-4', name: '驻村工作台账' },
      { id: '1-5', name: '工作日志管理', component: markRaw(WorkLog) },
      {
        id: '1-6',
        name: '监督委成员',
        children: [
          { id: '1-6-1', name: '监督委成员', component: markRaw(OversightCommittee) }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '村民信息管理',
    children: [
      { id: '2-1', name: '户基本信息', component: markRaw(HouseholdBasicInfo) },
      { id: '2-2', name: '人员变动' },
      { id: '2-3', name: '公益性岗位' },
      { id: '2-5', name: '入户摸排表' }
    ]
  }
])

const handleMenuClick = (item) => {
  currentPageTitle.value = item.name
  activeMenu.value = item.id
  currentComponent.value = item.component || null
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background-color: #007bff;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.logo-section {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.logo-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-menu :deep(.el-menu-item.is-active),
.sidebar-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  height: 60px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
}

.content-area {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

.content-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.welcome-card {
  text-align: center;
  padding: 60px 80px;
  border-radius: 12px;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.welcome-card h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.welcome-card p {
  color: #666;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>