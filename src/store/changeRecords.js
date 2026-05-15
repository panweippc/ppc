import { ref } from 'vue'

const changeRecords = ref([
  {
    id: 1,
    memberName: '王赞',
    reason: '工作变动',
    date: '2023-07-08 16:00:00',
    type: '调出',
    originalBranch: '塔拉村党支部',
    targetBranch: '敖包村党支部',
    remark: ''
  },
  {
    id: 2,
    memberName: '王赞',
    reason: '婚入',
    date: '2023-07-08 16:00:00',
    type: '调入',
    originalBranch: '金汇镇党支部',
    targetBranch: '塔拉村党支部',
    remark: ''
  },
  {
    id: 3,
    memberName: '张强',
    reason: '调入',
    date: '2023-07-05',
    type: '调入',
    originalBranch: '敖包村党支部',
    targetBranch: '塔拉村党支部',
    remark: ''
  }
])

const addChangeRecord = (record) => {
  const newRecord = {
    id: Date.now(),
    ...record
  }
  changeRecords.value.unshift(newRecord)
  return newRecord
}

const getChangeRecordsByMember = (memberName) => {
  return changeRecords.value.filter(record => record.memberName === memberName)
}

export {
  changeRecords,
  addChangeRecord,
  getChangeRecordsByMember
}