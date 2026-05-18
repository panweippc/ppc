<template>
  <div class="reminder-settings">
    <div class="setting-section">
      <div class="section-header">
        <h3>⏰ 超时提醒设置</h3>
        <span class="section-desc">设置任务超时前的提醒规则</span>
      </div>
      <div class="setting-card">
        <div class="setting-item">
          <label class="setting-label">启用超时提醒</label>
          <el-switch v-model="reminderSettings.enableTimeoutReminder" />
        </div>
        <div class="setting-item">
          <label class="setting-label">即将超时提醒（提前天数）</label>
          <el-input-number v-model="reminderSettings.timeoutWarningDays" :min="1" :max="30" />
          <span class="setting-hint">天</span>
        </div>
        <div class="setting-item">
          <label class="setting-label">超时后提醒间隔（小时）</label>
          <el-input-number v-model="reminderSettings.timeoutIntervalHours" :min="1" :max="24" />
          <span class="setting-hint">小时</span>
        </div>
        <div class="setting-item">
          <label class="setting-label">超时提醒对象</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" v-model="reminderSettings.timeoutNotifyTargets" value="assignee" />
              <span>任务负责人</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="reminderSettings.timeoutNotifyTargets" value="creator" />
              <span>任务创建人</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-section">
      <div class="section-header">
        <h3>🔔 验收提醒设置</h3>
        <span class="section-desc">设置待验收任务的提醒规则</span>
      </div>
      <div class="setting-card">
        <div class="setting-item">
          <label class="setting-label">启用验收提醒</label>
          <el-switch v-model="reminderSettings.enableReviewReminder" />
        </div>
        <div class="setting-item">
          <label class="setting-label">验收提醒间隔（小时）</label>
          <el-input-number v-model="reminderSettings.reviewIntervalHours" :min="1" :max="72" />
          <span class="setting-hint">小时</span>
        </div>
        <div class="setting-item">
          <label class="setting-label">验收提醒对象</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" v-model="reminderSettings.reviewNotifyTargets" value="reviewer" />
              <span>验收人</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="reminderSettings.reviewNotifyTargets" value="assignee" />
              <span>任务负责人</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-section">
      <div class="section-header">
        <h3>📧 通知方式设置</h3>
        <span class="section-desc">设置提醒通知的发送方式</span>
      </div>
      <div class="setting-card">
        <div class="setting-item">
          <label class="setting-label">系统消息通知</label>
          <el-switch v-model="reminderSettings.notifySystem" />
        </div>
        <div class="setting-item">
          <label class="setting-label">邮件通知</label>
          <el-switch v-model="reminderSettings.notifyEmail" />
        </div>
        <div class="setting-item">
          <label class="setting-label">短信通知</label>
          <el-switch v-model="reminderSettings.notifySms" />
          <span class="setting-hint">仅用于紧急提醒</span>
        </div>
      </div>
    </div>

    <div class="setting-section">
      <div class="section-header">
        <h3>📅 定时任务设置</h3>
        <span class="section-desc">设置提醒任务的执行时间</span>
      </div>
      <div class="setting-card">
        <div class="setting-item">
          <label class="setting-label">每日检查时间</label>
          <el-time-picker v-model="reminderSettings.dailyCheckTime" format="HH:mm" />
        </div>
        <div class="setting-item">
          <label class="setting-label">周末是否执行</label>
          <el-switch v-model="reminderSettings.runOnWeekends" />
        </div>
      </div>
    </div>

    <div class="action-section">
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
      <el-button @click="resetSettings">恢复默认</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const reminderSettings = reactive({
  enableTimeoutReminder: true,
  timeoutWarningDays: 3,
  timeoutIntervalHours: 6,
  timeoutNotifyTargets: ['assignee', 'creator'],
  
  enableReviewReminder: true,
  reviewIntervalHours: 24,
  reviewNotifyTargets: ['reviewer'],
  
  notifySystem: true,
  notifyEmail: true,
  notifySms: false,
  
  dailyCheckTime: '09:00',
  runOnWeekends: false
})

const defaultSettings = {
  enableTimeoutReminder: true,
  timeoutWarningDays: 3,
  timeoutIntervalHours: 6,
  timeoutNotifyTargets: ['assignee', 'creator'],
  enableReviewReminder: true,
  reviewIntervalHours: 24,
  reviewNotifyTargets: ['reviewer'],
  notifySystem: true,
  notifyEmail: true,
  notifySms: false,
  dailyCheckTime: '09:00',
  runOnWeekends: false
}

const saveSettings = () => {
  ElMessage.success('设置已保存')
}

const resetSettings = () => {
  Object.assign(reminderSettings, defaultSettings)
  ElMessage.info('已恢复默认设置')
}
</script>

<style scoped>
.reminder-settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.setting-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.section-desc {
  font-size: 14px;
  color: #999;
}

.setting-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.setting-hint {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.action-section {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}
</style>