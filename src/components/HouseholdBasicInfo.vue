<template>
  <div class="household-container">
    <div class="main-layout">
      <div class="left-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-content">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索" 
              class="search-input"
            />
            <button class="search-btn">
              <span class="search-icon">🔍</span>
            </button>
          </div>
          <div class="tree-container">
            <div class="tree-item parent" @click="toggleTree('county')">
              <span class="tree-icon">{{ countyExpanded ? '▼' : '▶' }}</span>
              <span>灏明县</span>
            </div>
            <div v-show="countyExpanded" class="tree-children">
              <div 
                v-for="village in villages" 
                :key="village.id" 
                class="tree-item child"
                :class="{ active: selectedVillage === village.id }"
                @click="selectVillage(village.id)"
              >
                {{ village.name }}
              </div>
            </div>
          </div>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <el-icon v-if="sidebarCollapsed"><ArrowRight /></el-icon>
          <el-icon v-else><ArrowLeft /></el-icon>
        </button>
      </div>

      <div class="right-content">
        <div class="stats-cards">
          <div class="stat-card">
            <span class="stat-label">户数</span>
            <span class="stat-value">{{ statistics.households }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">人口数</span>
            <span class="stat-value">{{ statistics.population }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">残疾人数</span>
            <span class="stat-value">{{ statistics.disabled }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">劳动力数</span>
            <span class="stat-value">{{ statistics.workforce }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">家庭年收入</span>
            <span class="stat-value">{{ statistics.annualIncome }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">家庭年支出</span>
            <span class="stat-value">{{ statistics.annualExpense }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">人均纯收入</span>
            <span class="stat-value">{{ statistics.perCapitaIncome }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">耕地面积</span>
            <span class="stat-value">{{ statistics.cultivatedArea }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">林地面积</span>
            <span class="stat-value">{{ statistics.forestArea }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">草牧场面积</span>
            <span class="stat-value">{{ statistics.pastureArea }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">车辆数量</span>
            <span class="stat-value">{{ statistics.vehicles }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">现有帮扶干部</span>
            <span class="stat-value">{{ statistics.helpers }}</span>
          </div>
        </div>

        <div class="search-panel">
          <div class="search-header">
            <button class="collapse-btn" @click="toggleSearchPanel">
              <el-icon v-if="searchPanelExpanded"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
            </button>
          </div>
          <div v-show="searchPanelExpanded" class="search-content">
            <div class="search-row">
              <div class="search-item">
                <label class="search-label">户号</label>
                <el-input v-model="searchForm.householdNo" placeholder="请输入户号" class="form-input" />
              </div>
              <div class="search-item">
                <label class="search-label">姓名</label>
                <el-input v-model="searchForm.name" placeholder="请输入姓名" class="form-input" />
              </div>
              <div class="search-item">
                <label class="search-label">身份证号</label>
                <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" class="form-input" />
              </div>
              <div class="search-item">
                <label class="search-label">联系方式</label>
                <el-input v-model="searchForm.phone" placeholder="请输入联系方式" class="form-input" />
              </div>
            </div>
            <div class="search-row">
              <div class="search-item">
                <label class="search-label">是否为重点人群</label>
                <el-select v-model="searchForm.isKeyPerson" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="search-item">
                <label class="search-label">是否低于监测参考人均收入</label>
                <el-select v-model="searchForm.isBelowIncome" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="search-item">
                <label class="search-label">是否低于上年度监测参考人均收入</label>
                <el-select v-model="searchForm.isBelowLastYearIncome" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="search-item">
                <label class="search-label">是否发生突发事件</label>
                <el-select v-model="searchForm.hasEmergency" placeholder="请选择" class="form-select">
                  <el-option label="请选择" value="" />
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
            </div>
          </div>
          <div class="search-row last-row">
            <div class="search-item">
              <label class="search-label">帮扶干部姓名</label>
              <el-input v-model="searchForm.helperName" placeholder="请输入帮扶干部姓名" class="form-input" />
            </div>
            <div class="search-item">
              <label class="search-label">户类型</label>
              <el-select v-model="searchForm.householdType" placeholder="请选择" class="form-select">
                <el-option label="请选择" value="" />
                <el-option label="一般农户" value="general" />
                <el-option label="脱贫户" value="poverty" />
                <el-option label="监测户" value="monitor" />
              </el-select>
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
        </div>

        <div class="table-panel">
          <div class="table-header">
            <div class="add-button-wrapper">
              <el-button type="primary" @click="showYearSelector = !showYearSelector">
                <el-icon><Plus /></el-icon>
                增加
              </el-button>
              <div v-show="showYearSelector" class="year-dropdown">
                <div 
                  v-for="year in availableYears" 
                  :key="year" 
                  class="year-item"
                  @click="selectYear(year)"
                >
                  {{ year }}年
                </div>
              </div>
            </div>
          </div>
          <el-table :data="paginatedData" border>
            <el-table-column prop="village" label="行政村" />
            <el-table-column prop="naturalGroup" label="自然组" />
            <el-table-column prop="householdNo" label="户号" />
            <el-table-column label="操作" width="300">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button type="primary" size="small" icon="edit" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="primary" size="small" icon="eye" @click="handleView(scope.row)">查看</el-button>
                  <el-button type="primary" size="small" @click="handleSubsidy(scope.row)">补贴</el-button>
                  <el-button type="primary" size="small" @click="handleHelp(scope.row)">帮扶</el-button>
                  <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>
        </div>

        <div class="back-to-top" @click="scrollToTop">
          <el-button type="primary" size="small" round>
            <el-icon><ArrowUp /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="showYearSelector" title="选择年度" width="200px" class="year-select-dialog">
      <div class="year-select-container">
        <div 
          v-for="year in availableYears" 
          :key="year" 
          class="year-option"
          @click="selectYear(year)"
        >
          {{ year }}年
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" :title="`数据信息 - (${selectedYear}年)`" width="90%" class="dialog-container">
      <div class="form-container">
        <div class="tabs-wrapper">
          <div 
            v-for="tab in tabs" 
            :key="tab.key" 
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </div>
        </div>
        
        <div class="tab-content">
          <div v-show="activeTab === 'basic'" class="basic-info-form">
            <div class="form-row">
              <div class="form-item required">
                <label class="form-label">*所在村</label>
                <el-select v-model="formData.village" placeholder="请选择" class="form-select">
                  <el-option v-for="village in villages" :key="village.id" :label="village.name" :value="village.name" />
                </el-select>
              </div>
              <div class="form-item required">
                <label class="form-label">*户号</label>
                <el-input v-model="formData.householdNo" placeholder="请输入户号" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">户主姓名</label>
                <el-input v-model="formData.name" placeholder="请输入户主姓名" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">家庭人口数</label>
                <el-select v-model="formData.familyMembers" placeholder="请选择" class="form-select">
                  <el-option v-for="n in 20" :key="n" :label="n" :value="n" />
                </el-select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">家庭劳动力数</label>
                <el-select v-model="formData.workforce" placeholder="请选择" class="form-select">
                  <el-option v-for="n in 10" :key="n" :label="n" :value="n" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否整户无劳动力</label>
                <el-select v-model="formData.isWholeFamilyUnemployed" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">户类型</label>
                <el-select v-model="formData.householdType" placeholder="请选择" class="form-select">
                  <el-option label="一般户" value="general" />
                  <el-option label="脱贫户" value="poverty" />
                  <el-option label="监测户" value="monitor" />
                  <el-option label="边缘户" value="edge" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">户联系电话</label>
                <el-input v-model="formData.phone" placeholder="请输入联系电话" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">是否享受兜底政策</label>
                <el-select v-model="formData.hasSocialSecurity" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">兜底等级</label>
                <el-select v-model="formData.socialSecurityLevel" placeholder="请选择" class="form-select">
                  <el-option label="无" value="none" />
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="C" value="C" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">主要燃料类型</label>
                <el-select v-model="formData.fuelType" placeholder="请选择" class="form-select">
                  <el-option label="柴草" value="firewood" />
                  <el-option label="煤炭" value="coal" />
                  <el-option label="液化气" value="gas" />
                  <el-option label="电" value="electric" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否解决安全饮用水</label>
                <el-select v-model="formData.hasSafeWater" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">是否有创业致富带头人带动</label>
                <el-select v-model="formData.hasLeader带动" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否有龙头企业带动</label>
                <el-select v-model="formData.hasEnterprise" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">入户路类型</label>
                <el-select v-model="formData.roadType" placeholder="请选择" class="form-select">
                  <el-option label="硬化路" value="paved" />
                  <el-option label="土路" value="dirt" />
                  <el-option label="砂石路" value="gravel" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">与村主干路距离（m）</label>
                <el-input v-model="formData.roadDistance" placeholder="请输入距离" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">是否通广播电视</label>
                <el-select v-model="formData.hasTV" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否通生活用电</label>
                <el-select v-model="formData.hasElectricity" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否通生产用电</label>
                <el-select v-model="formData.hasProductionElectricity" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否参与合作社</label>
                <el-select v-model="formData.inCooperative" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">是否有项目需求</label>
                <el-select v-model="formData.hasProjectDemand" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">风险是否已消除</label>
                <el-select v-model="formData.riskEliminated" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">识别监测时间</label>
                <el-date-picker v-model="formData.monitorDate" type="date" placeholder="请选择日期" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">消除监测时间</label>
                <el-date-picker v-model="formData.eliminateDate" type="date" placeholder="请选择日期" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">银行卡卡号</label>
                <el-input v-model="formData.bankCard" placeholder="请输入银行卡号" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">开户银行</label>
                <el-input v-model="formData.bankName" placeholder="请输入开户银行" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">备注</label>
                <el-input v-model="formData.remark" placeholder="暂无" class="form-input" />
              </div>
            </div>
            <div class="section-divider">产权信息</div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">房屋结构</label>
                <el-select v-model="formData.houseStructure" placeholder="请选择" class="form-select">
                  <el-option label="土木结构" value="earth" />
                  <el-option label="砖木结构" value="brick" />
                  <el-option label="砖混结构" value="concrete" />
                  <el-option label="木结构" value="wood" />
                  <el-option label="混木结构" value="mixed" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">住房面积（㎡）</label>
                <el-input v-model="formData.houseArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">安全等级</label>
                <el-select v-model="formData.safetyLevel" placeholder="请选择" class="form-select">
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="C" value="C" />
                  <el-option label="D" value="D" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否享受危房改造</label>
                <el-select v-model="formData.hasHouseRenovation" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">是否危房户</label>
                <el-select v-model="formData.isDangerousHouse" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">是否有卫生厕所</label>
                <el-select v-model="formData.hasToilet" placeholder="请选择" class="form-select">
                  <el-option label="是" value="yes" />
                  <el-option label="否" value="no" />
                </el-select>
              </div>
              <div class="form-item">
                <label class="form-label">耕地面积（亩）</label>
                <el-input v-model="formData.cultivatedArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">林地面积（亩）</label>
                <el-input v-model="formData.forestArea" placeholder="请输入面积" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">草牧场面积（亩）</label>
                <el-input v-model="formData.pastureArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">水面面积（亩）</label>
                <el-input v-model="formData.waterArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">林果面积（亩）</label>
                <el-input v-model="formData.fruitArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">退耕还林面积（亩）</label>
                <el-input v-model="formData.returnFarmlandArea" placeholder="请输入面积" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <label class="form-label">青贮窖面积（m³）</label>
                <el-input v-model="formData.siloArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">储草棚面积（㎡）</label>
                <el-input v-model="formData.grassShedArea" placeholder="请输入面积" class="form-input" />
              </div>
              <div class="form-item">
                <label class="form-label">保鲜库面积（㎡）</label>
                <el-input v-model="formData.coldStorageArea" placeholder="请输入面积" class="form-input" />
              </div>
            </div>
            <div class="section-divider">车辆信息</div>
            <div class="vehicle-table">
              <el-table :data="vehicleList" border :show-header="true" class="vehicle-table-inner">
                <el-table-column label="车辆类型">
                  <template #default="scope">
                    <el-select v-model="scope.row.type" placeholder="请选择" class="form-select-small">
                      <el-option label="轿车" value="car" />
                      <el-option label="货车" value="truck" />
                      <el-option label="摩托车" value="motorcycle" />
                      <el-option label="拖拉机" value="tractor" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="车辆数量">
                  <template #default="scope">
                    <el-input v-model="scope.row.quantity" placeholder="数量" class="form-input-small" />
                  </template>
                </el-table-column>
                <el-table-column label="车辆来源">
                  <template #default="scope">
                    <el-select v-model="scope.row.source" placeholder="请选择" class="form-select-small">
                      <el-option label="购买" value="purchase" />
                      <el-option label="捐赠" value="donation" />
                      <el-option label="帮扶" value="support" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="text" @click="removeVehicle(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="vehicle-add-btn">
                <el-button type="primary" @click="addVehicle">+ 添加</el-button>
              </div>
            </div>
            <div class="section-divider">愿景目标与其他产业需求</div>
            <div class="vision-section">
              <RichTextEditor v-model="formData.vision" />
            </div>
          </div>
          
          <div v-show="activeTab === 'members'" class="members-form">
            <div v-if="memberList.length === 0" class="member-add-btn">
              <el-button type="primary" @click="addMember">+ 添加</el-button>
            </div>
            <template v-for="(member, index) in memberList" :key="member.id">
              <div class="member-card">
                <div class="member-header">
                  <span class="member-title">成员{{ index + 1 }}</span>
                  <el-button 
                    type="text" 
                    class="member-delete-btn"
                    @click="removeMember(index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
                <div class="member-form">
                  <div class="member-item required">
                    <label class="form-label">*姓名</label>
                    <el-input v-model="member.name" placeholder="请输入姓名" class="form-input" />
                  </div>
                  <div class="member-item required">
                    <label class="form-label">*性别</label>
                    <el-select v-model="member.gender" placeholder="请选择" class="form-select">
                      <el-option label="男" value="male" />
                      <el-option label="女" value="female" />
                    </el-select>
                  </div>
                  <div class="member-item required">
                    <label class="form-label">*民族</label>
                    <el-select v-model="member.ethnicity" placeholder="请选择" class="form-select">
                      <el-option label="汉族" value="han" />
                      <el-option label="蒙古族" value="mongolian" />
                      <el-option label="回族" value="hui" />
                      <el-option label="藏族" value="tibetan" />
                      <el-option label="维吾尔族" value="uyghur" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </div>
                  <div class="member-item required">
                    <label class="form-label">*政治面貌</label>
                    <el-select v-model="member.politicalStatus" placeholder="请选择" class="form-select">
                      <el-option label="中共党员" value="party_member" />
                      <el-option label="共青团员" value="league_member" />
                      <el-option label="群众" value="mass" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </div>
                  <div class="member-item required">
                    <label class="form-label">*身份证号</label>
                    <el-input v-model="member.idCard" placeholder="请输入身份证号" class="form-input" />
                  </div>
                  <div class="member-item">
                    <label class="form-label">联系方式</label>
                    <el-input v-model="member.phone" placeholder="请输入联系方式" class="form-input" />
                  </div>
                  <div class="member-item required">
                    <label class="form-label">*与户主关系</label>
                    <el-select v-model="member.relation" placeholder="请选择" class="form-select">
                      <el-option label="户主" value="head" />
                      <el-option label="配偶" value="spouse" />
                      <el-option label="子女" value="child" />
                      <el-option label="父母" value="parent" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">兵役状况</label>
                    <el-select v-model="member.militaryStatus" placeholder="请选择" class="form-select">
                      <el-option label="未服兵役" value="not_served" />
                      <el-option label="服现役" value="active" />
                      <el-option label="退役军人" value="veteran" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">健康状况</label>
                    <el-select v-model="member.healthStatus" placeholder="请选择" class="form-select">
                      <el-option label="健康" value="healthy" />
                      <el-option label="一般" value="normal" />
                      <el-option label="残疾" value="disabled" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">文化程度</label>
                    <el-select v-model="member.educationLevel" placeholder="请选择" class="form-select">
                      <el-option label="未上学" value="none" />
                      <el-option label="小学" value="primary" />
                      <el-option label="初中" value="junior" />
                      <el-option label="高中/中专" value="senior" />
                      <el-option label="大专" value="college" />
                      <el-option label="本科" value="bachelor" />
                      <el-option label="研究生及以上" value="graduate" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">在校生状况</label>
                    <el-select v-model="member.studentStatus" placeholder="请选择" class="form-select">
                      <el-option label="否" value="no" />
                      <el-option label="小学生" value="primary_student" />
                      <el-option label="初中生" value="junior_student" />
                      <el-option label="高中生" value="senior_student" />
                      <el-option label="大学生" value="college_student" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">就读学校</label>
                    <el-input v-model="member.school" placeholder="请输入就读学校" class="form-input" />
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否享受教育补贴</label>
                    <el-select v-model="member.hasEducationSubsidy" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">教育补贴类型</label>
                    <el-input v-model="member.subsidyType" placeholder="请输入补贴类型" class="form-input" />
                  </div>
                  <div class="member-item">
                    <label class="form-label">义务教育阶段未上学原因</label>
                    <el-input v-model="member.notAttendReason" placeholder="请输入原因" class="form-input" />
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否会讲普通话</label>
                    <el-select v-model="member.speakMandarin" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否国外务工</label>
                    <el-select v-model="member.overseasWorker" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">劳动技能</label>
                    <el-select v-model="member.laborSkill" placeholder="请选择" class="form-select">
                      <el-option label="普通劳动力" value="general" />
                      <el-option label="专业技能" value="professional" />
                      <el-option label="无劳动能力" value="none" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">技能类型</label>
                    <el-select v-model="member.skillType" placeholder="请选择" class="form-select">
                      <el-option label="农业" value="agriculture" />
                      <el-option label="工业" value="industry" />
                      <el-option label="服务业" value="service" />
                      <el-option label="其他" value="other" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否外出务工</label>
                    <el-select v-model="member.migrantWorker" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">外出区域</label>
                    <el-select v-model="member.migrantArea" placeholder="请选择" class="form-select">
                      <el-option label="请选择" value="" />
                      <el-option label="省内" value="province" />
                      <el-option label="省外" value="out_province" />
                      <el-option label="国外" value="abroad" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否参加城乡居民（职工）基本养老保险</label>
                    <el-select v-model="member.basicPension" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否参加城乡居民（职工）基本医疗保险</label>
                    <el-select v-model="member.basicMedical" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否参加大病保险</label>
                    <el-select v-model="member.criticalIllnessInsurance" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否为重点人群</label>
                    <el-select v-model="member.keyPerson" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否享受城乡居民最低生活保障</label>
                    <el-select v-model="member.urbanMinimumLiving" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否特困供养人员</label>
                    <el-select v-model="member.specialSupport" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否异地扶贫搬迁（同步搬迁）人口</label>
                    <el-select v-model="member.povertyRelocation" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否享受农村居民最低生活保障</label>
                    <el-select v-model="member.ruralMinimumLiving" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否享受人身意外保险补贴</label>
                    <el-select v-model="member.accidentInsuranceSubsidy" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否接受医疗救助</label>
                    <el-select v-model="member.medicalAssistance" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否参加商业补充医疗保险</label>
                    <el-select v-model="member.commercialMedical" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">是否接受其他健康扶贫</label>
                    <el-select v-model="member.healthPoverty" placeholder="请选择" class="form-select">
                      <el-option label="是" value="yes" />
                      <el-option label="否" value="no" />
                    </el-select>
                  </div>
                  <div class="member-item">
                    <label class="form-label">银行卡号</label>
                    <el-input v-model="member.bankCard" placeholder="请输入银行卡号" class="form-input" />
                  </div>
                  <div class="member-item">
                    <label class="form-label">开户银行</label>
                    <el-input v-model="member.bankName" placeholder="请输入开户银行" class="form-input" />
                  </div>
                  <div class="member-item">
                    <label class="form-label">备注</label>
                    <el-input v-model="member.remark" placeholder="暂无" class="form-input" />
                  </div>
                </div>
              </div>
              <div class="member-add-btn">
                <el-button type="primary" @click="addMember">+ 添加</el-button>
              </div>
            </template>
          </div>
          
          <div v-show="activeTab === 'farming'" class="farming-form">
            <div class="agriculture-section">
              <div class="section-divider">现有农业</div>
              <template v-for="(item, index) in existingAgricultureList" :key="item.id">
                <div class="agriculture-row">
                  <div class="agriculture-item required">
                    <label class="form-label">*类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in cropTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*名称</label>
                    <el-select v-model="item.name" placeholder="请选择" class="form-select">
                      <el-option v-for="name in cropNames" :key="name.value" :label="name.label" :value="name.value" />
                    </el-select>
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*面积</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="agriculture-item delete-col">
                    <el-button 
                      type="text" 
                      class="delete-btn"
                      @click="removeExistingAgriculture(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="agriculture-add-btn" v-if="existingAgricultureList.length === 0 || existingAgricultureList.length > 0">
                <el-button type="primary" @click="addExistingAgriculture">+ 添加</el-button>
              </div>
            </div>

            <div class="agriculture-section">
              <div class="section-divider">规划农业</div>
              <template v-for="(item, index) in plannedAgricultureList" :key="item.id">
                <div class="agriculture-row">
                  <div class="agriculture-item required">
                    <label class="form-label">*类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in cropTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*名称</label>
                    <el-select v-model="item.name" placeholder="请选择" class="form-select">
                      <el-option v-for="name in cropNames" :key="name.value" :label="name.label" :value="name.value" />
                    </el-select>
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*面积</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*预计单价</label>
                    <el-input v-model="item.estimatedPrice" placeholder="请输入单价" class="form-input" />
                  </div>
                  <div class="agriculture-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="agriculture-item delete-col">
                    <el-button 
                      type="text" 
                      class="delete-btn"
                      @click="removePlannedAgriculture(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="agriculture-add-btn" v-if="plannedAgricultureList.length === 0 || plannedAgricultureList.length > 0">
                <el-button type="primary" @click="addPlannedAgriculture">+ 添加</el-button>
              </div>
            </div>
          </div>
          
          <div v-show="activeTab === 'breeding'" class="breeding-form">
            <div class="breeding-section">
              <div class="section-divider">养殖设施(现有)</div>
              <template v-for="(item, index) in existingBreedingFacilityList" :key="item.id">
                <div class="breeding-facility-row">
                  <div class="breeding-facility-item required">
                    <label class="form-label">*棚圈结构</label>
                    <el-select v-model="item.structure" placeholder="请选择" class="form-select">
                      <el-option v-for="structure in shedStructures" :key="structure.value" :label="structure.label" :value="structure.value" />
                    </el-select>
                  </div>
                  <div class="breeding-facility-item required">
                    <label class="form-label">*棚圈面积（㎡）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="breeding-facility-item delete-col">
                    <el-button 
                      type="text" 
                      class="delete-btn"
                      @click="removeExistingBreedingFacility(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="breeding-add-btn">
                <el-button type="primary" @click="addExistingBreedingFacility">+ 添加</el-button>
              </div>
            </div>

            <div class="breeding-section">
              <div class="section-divider">现有养殖</div>
              <template v-for="(item, index) in existingBreedingList" :key="item.id">
                <div class="breeding-row">
                  <div class="breeding-item">
                    <label class="form-label">类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in breedingTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item">
                    <label class="form-label">名称</label>
                    <el-select v-model="item.name" placeholder="请选择" class="form-select">
                      <el-option v-for="name in breedingNames" :key="name.value" :label="name.label" :value="name.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*繁育信息</label>
                    <el-select v-model="item.breedingInfo" placeholder="请选择" class="form-select">
                      <el-option v-for="info in breedingInfo" :key="info.value" :label="info.label" :value="info.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*数量</label>
                    <el-input v-model="item.quantity" placeholder="请输入数量" class="form-input" />
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in breedingUnits" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="breeding-item delete-col">
                    <el-button 
                      type="text" 
                      class="delete-btn"
                      @click="removeExistingBreeding(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="breeding-add-btn">
                <el-button type="primary" @click="addExistingBreeding">+ 添加</el-button>
              </div>
            </div>

            <div class="breeding-section">
              <div class="section-divider">养殖设施(规划)</div>
              <template v-for="(item, index) in plannedBreedingFacilityList" :key="item.id">
                <div class="breeding-facility-row">
                  <div class="breeding-facility-item required">
                    <label class="form-label">*棚圈结构</label>
                    <el-select v-model="item.structure" placeholder="请选择" class="form-select">
                      <el-option v-for="structure in shedStructures" :key="structure.value" :label="structure.label" :value="structure.value" />
                    </el-select>
                  </div>
                  <div class="breeding-facility-item required">
                    <label class="form-label">*棚圈面积（㎡）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="breeding-facility-item delete-col">
                    <el-button 
                      type="text" 
                      class="delete-btn"
                      @click="removePlannedBreedingFacility(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="breeding-add-btn">
                <el-button type="primary" @click="addPlannedBreedingFacility">+ 添加</el-button>
              </div>
            </div>

            <div class="breeding-section">
              <div class="section-divider">规划养殖</div>
              <template v-for="(item, index) in plannedBreedingList" :key="item.id">
                <div class="breeding-row">
                  <div class="breeding-item">
                    <label class="form-label">类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in breedingTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item">
                    <label class="form-label">名称</label>
                    <el-select v-model="item.name" placeholder="请选择" class="form-select">
                      <el-option v-for="name in breedingNames" :key="name.value" :label="name.label" :value="name.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item">
                    <label class="form-label">繁育信息</label>
                    <el-select v-model="item.breedingInfo" placeholder="请选择" class="form-select">
                      <el-option v-for="info in breedingInfo" :key="info.value" :label="info.label" :value="info.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*数量</label>
                    <el-input v-model="item.quantity" placeholder="请输入数量" class="form-input" />
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in breedingUnits" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*预计单价</label>
                    <el-input v-model="item.estimatedPrice" placeholder="请输入单价" class="form-input" />
                  </div>
                  <div class="breeding-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="breeding-item delete-col">
                    <el-button 
                      type="text" 
                      class="delete-btn"
                      @click="removePlannedBreeding(index)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="breeding-add-btn">
                <el-button type="primary" @click="addPlannedBreeding">+ 添加</el-button>
              </div>
            </div>
          </div>
          
          <div v-show="activeTab === 'specialty'" class="specialty-form">
            <div class="section-divider">现有特色产业</div>
            
            <div class="specialty-section">
              <div class="specialty-subtitle">现有特色产业（农/牧家乐）</div>
              <template v-for="(item, index) in existingFarmhouseList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in farmhouseTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*住宿可容纳人数</label>
                    <el-input v-model="item.accommodationCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*餐饮可容纳人数</label>
                    <el-input v-model="item.cateringCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*特色菜品</label>
                    <el-input v-model="item.specialDishes" placeholder="请输入特色菜品" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">特色采摘</label>
                    <el-input v-model="item.specialPicking" placeholder="请输入特色采摘" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingFarmhouse(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addExistingFarmhouse">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">现有特色产业（采摘园）</div>
              <template v-for="(item, index) in existingPickingGardenList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">采摘园名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘项占地（亩）</label>
                    <el-input v-model="item.pickingArea" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘项目</label>
                    <el-input v-model="item.pickingItems" placeholder="请输入采摘项目" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘季节</label>
                    <el-select v-model="item.pickingSeason" placeholder="请选择" class="form-select">
                      <el-option v-for="season in pickingSeasons" :key="season.value" :label="season.label" :value="season.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘价格</label>
                    <el-input v-model="item.pickingPrice" placeholder="请输入价格" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingPickingGarden(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addExistingPickingGarden">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">田园综合体（现有）</div>
              <template v-for="(item, index) in existingPastoralComplexList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">田园综合体名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">住宿可容纳人数</label>
                    <el-input v-model="item.accommodationCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">餐饮可容纳人数</label>
                    <el-input v-model="item.cateringCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">特色菜品</label>
                    <el-input v-model="item.specialDishes" placeholder="请输入特色菜品" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingPastoralComplex(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addExistingPastoralComplex">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">游乐设施（现有）</div>
              <template v-for="(item, index) in existingAmusementList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">游乐设施名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">可接待游客数量</label>
                    <el-input v-model="item.visitorCapacity" placeholder="请输入数量" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingAmusement(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addExistingAmusement">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">特色农副产品（现有）</div>
              <template v-for="(item, index) in existingAgriculturalList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">农副产种类</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in agriculturalTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">产量</label>
                    <el-input v-model="item.output" placeholder="请输入产量" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingAgricultural(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addExistingAgricultural">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">大棚经济（现有）</div>
              <template v-for="(item, index) in existingGreenhouseList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">大棚类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in greenhouseTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">可接待游客数</label>
                    <el-input v-model="item.visitorCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingGreenhouse(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addExistingGreenhouse">+ 添加</el-button>
              </div>
            </div>

            <div class="section-divider">规划特色产业</div>
            
            <div class="specialty-section">
              <div class="specialty-subtitle">规划特色产业（农/牧家乐）</div>
              <template v-for="(item, index) in plannedFarmhouseList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in farmhouseTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*住宿可容纳人数</label>
                    <el-input v-model="item.accommodationCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*餐饮可容纳人数</label>
                    <el-input v-model="item.cateringCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*特色菜品</label>
                    <el-input v-model="item.specialDishes" placeholder="请输入特色菜品" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">特色采摘</label>
                    <el-input v-model="item.specialPicking" placeholder="请输入特色采摘" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedFarmhouse(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addPlannedFarmhouse">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">规划特色产业（采摘园）</div>
              <template v-for="(item, index) in plannedPickingGardenList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">采摘园名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘项占地（亩）</label>
                    <el-input v-model="item.pickingArea" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘项目</label>
                    <el-input v-model="item.pickingItems" placeholder="请输入采摘项目" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘季节</label>
                    <el-select v-model="item.pickingSeason" placeholder="请选择" class="form-select">
                      <el-option v-for="season in pickingSeasons" :key="season.value" :label="season.label" :value="season.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">采摘价格</label>
                    <el-input v-model="item.pickingPrice" placeholder="请输入价格" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedPickingGarden(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addPlannedPickingGarden">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">田园综合体（规划）</div>
              <template v-for="(item, index) in plannedPastoralComplexList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">田园综合体名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">住宿可容纳人数</label>
                    <el-input v-model="item.accommodationCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">餐饮可容纳人数</label>
                    <el-input v-model="item.cateringCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">特色菜品</label>
                    <el-input v-model="item.specialDishes" placeholder="请输入特色菜品" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedPastoralComplex(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addPlannedPastoralComplex">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">游乐设施（规划）</div>
              <template v-for="(item, index) in plannedAmusementList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">游乐设施名称</label>
                    <el-input v-model="item.name" placeholder="请输入名称" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">可接待游客数量</label>
                    <el-input v-model="item.visitorCapacity" placeholder="请输入数量" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedAmusement(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addPlannedAmusement">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">特色农副产品（规划）</div>
              <template v-for="(item, index) in plannedAgriculturalList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">农副产种类</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in agriculturalTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">产量</label>
                    <el-input v-model="item.output" placeholder="请输入产量" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedAgricultural(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addPlannedAgricultural">+ 添加</el-button>
              </div>
            </div>

            <div class="specialty-section">
              <div class="specialty-subtitle">大棚经济（规划）</div>
              <template v-for="(item, index) in plannedGreenhouseList" :key="item.id">
                <div class="specialty-row">
                  <div class="specialty-item">
                    <label class="form-label">大棚类型</label>
                    <el-select v-model="item.type" placeholder="请选择" class="form-select">
                      <el-option v-for="type in greenhouseTypes" :key="type.value" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">占地（亩）</label>
                    <el-input v-model="item.area" placeholder="请输入面积" class="form-input" />
                  </div>
                  <div class="specialty-item">
                    <label class="form-label">可接待游客数</label>
                    <el-input v-model="item.visitorCapacity" placeholder="请输入人数" class="form-input" />
                  </div>
                  <div class="specialty-item required">
                    <label class="form-label">*预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="specialty-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedGreenhouse(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="specialty-add-btn">
                <el-button type="primary" @click="addPlannedGreenhouse">+ 添加</el-button>
              </div>
            </div>
          </div>
          
          <div v-show="activeTab === 'yard'" class="yard-form">
            <div class="yard-section">
              <div class="section-divider">现有庭院经济</div>
              <template v-for="(item, index) in existingYardList" :key="item.id">
                <div class="yard-row">
                  <div class="yard-item required">
                    <label class="form-label">*庭院经济大类</label>
                    <el-select v-model="item.category" placeholder="请选择" class="form-select">
                      <el-option v-for="cat in yardCategories" :key="cat.value" :label="cat.label" :value="cat.value" />
                    </el-select>
                  </div>
                  <div class="yard-item">
                    <label class="form-label">名称</label>
                    <el-select v-model="item.name" placeholder="请选择" class="form-select">
                      <el-option v-for="name in yardNames" :key="name.value" :label="name.label" :value="name.value" />
                    </el-select>
                  </div>
                  <div class="yard-item">
                    <label class="form-label">面积/数量</label>
                    <el-input v-model="item.amount" placeholder="请输入面积/数量" class="form-input" />
                  </div>
                  <div class="yard-item">
                    <label class="form-label">单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in yardUnits" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="yard-item">
                    <label class="form-label">实际收入</label>
                    <el-input v-model="item.actualIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="yard-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removeExistingYard(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="yard-add-btn">
                <el-button type="primary" @click="addExistingYard">+ 添加</el-button>
              </div>
            </div>

            <div class="yard-section">
              <div class="section-divider">规划庭院经济</div>
              <template v-for="(item, index) in plannedYardList" :key="item.id">
                <div class="yard-row">
                  <div class="yard-item">
                    <label class="form-label">庭院经济大类</label>
                    <el-select v-model="item.category" placeholder="请选择" class="form-select">
                      <el-option v-for="cat in yardCategories" :key="cat.value" :label="cat.label" :value="cat.value" />
                    </el-select>
                  </div>
                  <div class="yard-item">
                    <label class="form-label">名称</label>
                    <el-select v-model="item.name" placeholder="请选择" class="form-select">
                      <el-option v-for="name in yardNames" :key="name.value" :label="name.label" :value="name.value" />
                    </el-select>
                  </div>
                  <div class="yard-item">
                    <label class="form-label">面积/数量</label>
                    <el-input v-model="item.amount" placeholder="请输入面积/数量" class="form-input" />
                  </div>
                  <div class="yard-item">
                    <label class="form-label">单位</label>
                    <el-select v-model="item.unit" placeholder="请选择" class="form-select">
                      <el-option v-for="unit in yardUnits" :key="unit.value" :label="unit.label" :value="unit.value" />
                    </el-select>
                  </div>
                  <div class="yard-item">
                    <label class="form-label">预计收入</label>
                    <el-input v-model="item.estimatedIncome" placeholder="请输入收入" class="form-input" />
                  </div>
                  <div class="yard-item delete-col">
                    <el-button type="text" class="delete-btn" @click="removePlannedYard(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </template>
              <div class="yard-add-btn">
                <el-button type="primary" @click="addPlannedYard">+ 添加</el-button>
              </div>
            </div>
          </div>
          
          <div v-show="activeTab === 'finance'" class="finance-form">
            <div class="finance-section">
              <div class="finance-row">
                <div class="finance-item computed">
                  <label class="form-label">家庭年收入</label>
                  <el-input :value="computedFinance.annualIncome" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">工资性收入</label>
                  <el-input v-model="financeForm.wageIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">生产经营性收入</label>
                  <el-input v-model="financeForm.productionIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">财产性收入</label>
                  <el-input :value="computedFinance.propertyIncome" disabled class="form-input computed-input" />
                </div>
              </div>
              
              <div class="finance-row">
                <div class="finance-item">
                  <label class="form-label">资产收益扶贫分红收入</label>
                  <el-input v-model="financeForm.assetIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">其他财产性收入</label>
                  <el-input v-model="financeForm.otherPropertyIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">转移性收入</label>
                  <el-input :value="computedFinance.transferIncome" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">计划生育金</label>
                  <el-input v-model="financeForm.birthBonus" placeholder="请输入" class="form-input" />
                </div>
              </div>
              
              <div class="finance-row">
                <div class="finance-item">
                  <label class="form-label">低保金</label>
                  <el-input v-model="financeForm.lowIncomeAllowance" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">特困供养金</label>
                  <el-input v-model="financeForm.specialSupportFund" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">养老保险金</label>
                  <el-input :value="computedFinance.pension" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">生态补偿金</label>
                  <el-input v-model="financeForm.ecologicalCompensation" placeholder="请输入" class="form-input" />
                </div>
              </div>
              
              <div class="finance-row">
                <div class="finance-item">
                  <label class="form-label">其他转移性收入</label>
                  <el-input v-model="financeForm.otherTransferIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">其他收入</label>
                  <el-input v-model="financeForm.otherIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">家庭年支出</label>
                  <el-input :value="computedFinance.annualExpense" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">种植业支出</label>
                  <el-input v-model="financeForm.plantingExpense" placeholder="请输入" class="form-input" />
                </div>
              </div>
              
              <div class="finance-row">
                <div class="finance-item">
                  <label class="form-label">养殖业支出</label>
                  <el-input v-model="financeForm.breedingExpense" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">家庭经营性支出</label>
                  <el-input v-model="financeForm.operatingExpense" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">其他支出</label>
                  <el-input v-model="financeForm.otherExpense" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">家庭纯收入</label>
                  <el-input :value="computedFinance.netIncome" disabled class="form-input computed-input" />
                </div>
              </div>
              
              <div class="finance-row">
                <div class="finance-item computed">
                  <label class="form-label">家庭人均纯收入</label>
                  <el-input :value="computedFinance.perCapitaIncome" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">理赔收入</label>
                  <el-input v-model="financeForm.claimIncome" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">合规自付刚性支出</label>
                  <el-input v-model="financeForm.rigidExpense" placeholder="请输入" class="form-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">监测参考收入</label>
                  <el-input :value="computedFinance.monitoringIncome" disabled class="form-input computed-input" />
                </div>
              </div>
              
              <div class="finance-row">
                <div class="finance-item computed">
                  <label class="form-label">监测参考人均纯收入</label>
                  <el-input :value="computedFinance.monitoringPerCapitaIncome" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">产业规划总收入</label>
                  <el-input :value="computedFinance.industryPlanIncome" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item computed">
                  <label class="form-label">产业规划人均收入</label>
                  <el-input :value="computedFinance.industryPlanPerCapitaIncome" disabled class="form-input computed-input" />
                </div>
                <div class="finance-item">
                  <label class="form-label">备注</label>
                  <el-input v-model="financeForm.remark" placeholder="请输入备注" class="form-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="户基本信息详情" v-model="viewDialogVisible" width="80%" class="dialog-container">
      <div class="view-container">
        <div class="view-row">
          <span class="view-label">行政村：</span>
          <span class="view-value">{{ viewData.village }}</span>
          <span class="view-label">自然组：</span>
          <span class="view-value">{{ viewData.naturalGroup }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">户号：</span>
          <span class="view-value">{{ viewData.householdNo }}</span>
          <span class="view-label">姓名：</span>
          <span class="view-value">{{ viewData.name }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">身份证号：</span>
          <span class="view-value">{{ viewData.idCard }}</span>
          <span class="view-label">联系方式：</span>
          <span class="view-value">{{ viewData.phone }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">是否为重点人群：</span>
          <span class="view-value">{{ viewData.isKeyPerson === 'yes' ? '是' : '否' }}</span>
          <span class="view-label">是否低于监测参考人均收入：</span>
          <span class="view-value">{{ viewData.isBelowIncome === 'yes' ? '是' : '否' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">是否低于上年度监测参考人均收入：</span>
          <span class="view-value">{{ viewData.isBelowLastYearIncome === 'yes' ? '是' : '否' }}</span>
          <span class="view-label">是否发生突发事件：</span>
          <span class="view-value">{{ viewData.hasEmergency === 'yes' ? '是' : '否' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">帮扶干部姓名：</span>
          <span class="view-value">{{ viewData.helperName }}</span>
          <span class="view-label">户类型：</span>
          <span class="view-value">{{ getHouseholdTypeName(viewData.householdType) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Plus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Delete } from '@element-plus/icons-vue'
import RichTextEditor from './RichTextEditor.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const searchKeyword = ref('')
const countyExpanded = ref(true)
const selectedVillage = ref(null)
const searchPanelExpanded = ref(true)
const sidebarCollapsed = ref(false)

const villages = ref([
  { id: 1, name: '塔拉村' },
  { id: 2, name: '城东村' },
  { id: 3, name: '光明新村' }
])

const statistics = ref({
  households: 156,
  population: 589,
  disabled: 23,
  workforce: 321,
  annualIncome: '285.6万',
  annualExpense: '168.3万',
  perCapitaIncome: '4849元',
  cultivatedArea: '2345亩',
  forestArea: '1890亩',
  pastureArea: '3560亩',
  vehicles: 89,
  helpers: 45
})

const searchForm = reactive({
  householdNo: '',
  name: '',
  idCard: '',
  phone: '',
  isKeyPerson: '',
  isBelowIncome: '',
  isBelowLastYearIncome: '',
  hasEmergency: '',
  helperName: '',
  householdType: ''
})

const tableData = ref([
  { id: 1, village: '塔拉村', naturalGroup: '塔拉村', householdNo: '68678' },
  { id: 2, village: '城东村', naturalGroup: '城东村二组', householdNo: '345536' },
  { id: 3, village: '城东村', naturalGroup: '城东村二组', householdNo: '345536' },
  { id: 4, village: '城东村', naturalGroup: '城东村一组', householdNo: '01' },
  { id: 5, village: '塔拉村', naturalGroup: '塔拉南', householdNo: 'S3371131' },
  { id: 6, village: '光明新村', naturalGroup: '光明新村三组', householdNo: '23420010' },
  { id: 7, village: '光明新村', naturalGroup: '光明新村一组', householdNo: '231312009' },
  { id: 8, village: '光明新村', naturalGroup: '光明新村三组', householdNo: '2342001' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => tableData.value.length)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const showYearSelector = ref(false)
const selectedYear = ref(new Date().getFullYear())
const activeTab = ref('basic')

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => currentYear - i)
})

const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'members', label: '成员信息' },
  { key: 'farming', label: '种植业' },
  { key: 'breeding', label: '养殖业' },
  { key: 'specialty', label: '特色产业' },
  { key: 'yard', label: '庭院经济' },
  { key: 'finance', label: '家庭收支情况' }
]

const formData = reactive({
  village: '',
  naturalGroup: '',
  householdNo: '',
  name: '',
  familyMembers: '',
  workforce: '',
  isWholeFamilyUnemployed: '',
  householdType: '',
  phone: '',
  hasSocialSecurity: '',
  socialSecurityLevel: '',
  fuelType: '',
  hasSafeWater: '',
  hasLeader带动: '',
  hasEnterprise: '',
  roadType: '',
  roadDistance: '',
  hasTV: '',
  hasElectricity: '',
  hasProductionElectricity: '',
  inCooperative: '',
  hasProjectDemand: '',
  riskEliminated: '',
  monitorDate: '',
  eliminateDate: '',
  bankCard: '',
  bankName: '',
  remark: '',
  houseStructure: '',
  houseArea: '',
  safetyLevel: '',
  hasHouseRenovation: '',
  isDangerousHouse: '',
  hasToilet: '',
  cultivatedArea: '',
  forestArea: '',
  pastureArea: '',
  waterArea: '',
  fruitArea: '',
  returnFarmlandArea: '',
  siloArea: '',
  grassShedArea: '',
  coldStorageArea: '',
  vision: ''
})

const memberList = ref([])

const createEmptyMember = () => ({
  id: Date.now(),
  name: '',
  gender: '',
  ethnicity: '',
  politicalStatus: '',
  idCard: '',
  phone: '',
  relation: '',
  militaryStatus: '',
  healthStatus: '',
  educationLevel: '',
  studentStatus: '',
  school: '',
  hasEducationSubsidy: '',
  subsidyType: '',
  notAttendReason: '',
  speakMandarin: '',
  overseasWorker: '',
  laborSkill: '',
  skillType: '',
  migrantWorker: '',
  migrantArea: '',
  basicPension: '',
  basicMedical: '',
  criticalIllnessInsurance: '',
  keyPerson: '',
  urbanMinimumLiving: '',
  specialSupport: '',
  povertyRelocation: '',
  ruralMinimumLiving: '',
  accidentInsuranceSubsidy: '',
  medicalAssistance: '',
  commercialMedical: '',
  healthPoverty: '',
  bankCard: '',
  bankName: '',
  remark: ''
})

const addMember = () => {
  memberList.value.push(createEmptyMember())
}

const removeMember = (index) => {
  memberList.value.splice(index, 1)
}

const existingAgricultureList = ref([])
const plannedAgricultureList = ref([])

const cropTypes = [
  { label: '粮食作物', value: 'grain' },
  { label: '经济作物', value: 'economic' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '水果', value: 'fruit' },
  { label: '其他', value: 'other' }
]

const cropNames = [
  { label: '小麦', value: 'wheat' },
  { label: '玉米', value: 'corn' },
  { label: '水稻', value: 'rice' },
  { label: '大豆', value: 'soybean' },
  { label: '棉花', value: 'cotton' },
  { label: '油菜', value: 'rape' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '水果', value: 'fruit' },
  { label: '其他', value: 'other' }
]

const units = [
  { label: '亩', value: 'mu' },
  { label: '公顷', value: 'hectare' },
  { label: '平方米', value: 'square_meter' }
]

const createExistingAgriculture = () => ({
  id: Date.now(),
  type: '',
  name: '',
  area: '',
  unit: '',
  actualIncome: ''
})

const createPlannedAgriculture = () => ({
  id: Date.now(),
  type: '',
  name: '',
  area: '',
  unit: '',
  estimatedPrice: '',
  estimatedIncome: ''
})

const addExistingAgriculture = () => {
  existingAgricultureList.value.push(createExistingAgriculture())
}

const removeExistingAgriculture = (index) => {
  existingAgricultureList.value.splice(index, 1)
}

const addPlannedAgriculture = () => {
  plannedAgricultureList.value.push(createPlannedAgriculture())
}

const removePlannedAgriculture = (index) => {
  plannedAgricultureList.value.splice(index, 1)
}

const existingBreedingFacilityList = ref([])
const existingBreedingList = ref([])
const plannedBreedingFacilityList = ref([])
const plannedBreedingList = ref([])

const shedStructures = [
  { label: '砖混结构', value: 'brick_concrete' },
  { label: '钢结构', value: 'steel' },
  { label: '木结构', value: 'wood' },
  { label: '其他', value: 'other' }
]

const breedingTypes = [
  { label: '畜牧', value: 'livestock' },
  { label: '家禽', value: 'poultry' },
  { label: '水产', value: 'aquatic' },
  { label: '其他', value: 'other' }
]

const breedingNames = [
  { label: '牛', value: 'cattle' },
  { label: '羊', value: 'sheep' },
  { label: '猪', value: 'pig' },
  { label: '鸡', value: 'chicken' },
  { label: '鸭', value: 'duck' },
  { label: '鹅', value: 'goose' },
  { label: '鱼', value: 'fish' },
  { label: '其他', value: 'other' }
]

const breedingUnits = [
  { label: '头', value: 'head' },
  { label: '只', value: 'piece' },
  { label: '羽', value: 'feather' },
  { label: '尾', value: 'tail' },
  { label: '头/只', value: 'head_piece' }
]

const breedingInfo = [
  { label: '能繁', value: 'breeding' },
  { label: '育肥', value: 'fattening' },
  { label: '种畜', value: 'breeding_stock' },
  { label: '其他', value: 'other' }
]

const createBreedingFacility = () => ({
  id: Date.now(),
  structure: '',
  area: ''
})

const createExistingBreeding = () => ({
  id: Date.now(),
  type: '',
  name: '',
  breedingInfo: '',
  quantity: '',
  unit: '',
  actualIncome: ''
})

const createPlannedBreeding = () => ({
  id: Date.now(),
  type: '',
  name: '',
  breedingInfo: '',
  quantity: '',
  unit: '',
  estimatedPrice: '',
  estimatedIncome: ''
})

const addExistingBreedingFacility = () => {
  existingBreedingFacilityList.value.push(createBreedingFacility())
}

const removeExistingBreedingFacility = (index) => {
  existingBreedingFacilityList.value.splice(index, 1)
}

const addExistingBreeding = () => {
  existingBreedingList.value.push(createExistingBreeding())
}

const removeExistingBreeding = (index) => {
  existingBreedingList.value.splice(index, 1)
}

const addPlannedBreedingFacility = () => {
  plannedBreedingFacilityList.value.push(createBreedingFacility())
}

const removePlannedBreedingFacility = (index) => {
  plannedBreedingFacilityList.value.splice(index, 1)
}

const addPlannedBreeding = () => {
  plannedBreedingList.value.push(createPlannedBreeding())
}

const removePlannedBreeding = (index) => {
  plannedBreedingList.value.splice(index, 1)
}

const existingFarmhouseList = ref([])
const existingPickingGardenList = ref([])
const existingPastoralComplexList = ref([])
const existingAmusementList = ref([])
const existingAgriculturalList = ref([])
const existingGreenhouseList = ref([])

const plannedFarmhouseList = ref([])
const plannedPickingGardenList = ref([])
const plannedPastoralComplexList = ref([])
const plannedAmusementList = ref([])
const plannedAgriculturalList = ref([])
const plannedGreenhouseList = ref([])

const farmhouseTypes = [
  { label: '农家乐', value: 'farmhouse' },
  { label: '牧家乐', value: 'pastoral' }
]

const agriculturalTypes = [
  { label: '蔬菜', value: 'vegetable' },
  { label: '水果', value: 'fruit' },
  { label: '杂粮', value: 'grain' },
  { label: '畜禽', value: 'livestock' },
  { label: '水产', value: 'aquatic' },
  { label: '其他', value: 'other' }
]

const greenhouseTypes = [
  { label: '日光温室', value: 'solar' },
  { label: '塑料大棚', value: 'plastic' },
  { label: '智能温室', value: 'smart' },
  { label: '其他', value: 'other' }
]

const pickingSeasons = [
  { label: '春季', value: 'spring' },
  { label: '夏季', value: 'summer' },
  { label: '秋季', value: 'autumn' },
  { label: '冬季', value: 'winter' },
  { label: '全年', value: 'all' }
]

const createFarmhouse = () => ({
  id: Date.now(),
  type: '',
  name: '',
  accommodationCapacity: '',
  cateringCapacity: '',
  specialDishes: '',
  specialPicking: '',
  area: '',
  actualIncome: ''
})

const createPickingGarden = () => ({
  id: Date.now(),
  name: '',
  pickingArea: '',
  pickingItems: '',
  pickingSeason: '',
  pickingPrice: '',
  actualIncome: ''
})

const createPastoralComplex = () => ({
  id: Date.now(),
  name: '',
  area: '',
  accommodationCapacity: '',
  cateringCapacity: '',
  specialDishes: '',
  actualIncome: ''
})

const createAmusement = () => ({
  id: Date.now(),
  name: '',
  area: '',
  visitorCapacity: '',
  actualIncome: ''
})

const createAgricultural = () => ({
  id: Date.now(),
  type: '',
  output: '',
  unit: '',
  actualIncome: ''
})

const createGreenhouse = () => ({
  id: Date.now(),
  type: '',
  area: '',
  visitorCapacity: '',
  actualIncome: ''
})

const createPlannedFarmhouse = () => ({
  id: Date.now(),
  type: '',
  name: '',
  accommodationCapacity: '',
  cateringCapacity: '',
  specialDishes: '',
  specialPicking: '',
  area: '',
  estimatedIncome: ''
})

const createPlannedPickingGarden = () => ({
  id: Date.now(),
  name: '',
  pickingArea: '',
  pickingItems: '',
  pickingSeason: '',
  pickingPrice: '',
  estimatedIncome: ''
})

const createPlannedPastoralComplex = () => ({
  id: Date.now(),
  name: '',
  area: '',
  accommodationCapacity: '',
  cateringCapacity: '',
  specialDishes: '',
  estimatedIncome: ''
})

const createPlannedAmusement = () => ({
  id: Date.now(),
  name: '',
  area: '',
  visitorCapacity: '',
  estimatedIncome: ''
})

const createPlannedAgricultural = () => ({
  id: Date.now(),
  type: '',
  output: '',
  unit: '',
  estimatedIncome: ''
})

const createPlannedGreenhouse = () => ({
  id: Date.now(),
  type: '',
  area: '',
  visitorCapacity: '',
  estimatedIncome: ''
})

const addExistingFarmhouse = () => existingFarmhouseList.value.push(createFarmhouse())
const removeExistingFarmhouse = (index) => existingFarmhouseList.value.splice(index, 1)
const addExistingPickingGarden = () => existingPickingGardenList.value.push(createPickingGarden())
const removeExistingPickingGarden = (index) => existingPickingGardenList.value.splice(index, 1)
const addExistingPastoralComplex = () => existingPastoralComplexList.value.push(createPastoralComplex())
const removeExistingPastoralComplex = (index) => existingPastoralComplexList.value.splice(index, 1)
const addExistingAmusement = () => existingAmusementList.value.push(createAmusement())
const removeExistingAmusement = (index) => existingAmusementList.value.splice(index, 1)
const addExistingAgricultural = () => existingAgriculturalList.value.push(createAgricultural())
const removeExistingAgricultural = (index) => existingAgriculturalList.value.splice(index, 1)
const addExistingGreenhouse = () => existingGreenhouseList.value.push(createGreenhouse())
const removeExistingGreenhouse = (index) => existingGreenhouseList.value.splice(index, 1)

const addPlannedFarmhouse = () => plannedFarmhouseList.value.push(createPlannedFarmhouse())
const removePlannedFarmhouse = (index) => plannedFarmhouseList.value.splice(index, 1)
const addPlannedPickingGarden = () => plannedPickingGardenList.value.push(createPlannedPickingGarden())
const removePlannedPickingGarden = (index) => plannedPickingGardenList.value.splice(index, 1)
const addPlannedPastoralComplex = () => plannedPastoralComplexList.value.push(createPlannedPastoralComplex())
const removePlannedPastoralComplex = (index) => plannedPastoralComplexList.value.splice(index, 1)
const addPlannedAmusement = () => plannedAmusementList.value.push(createPlannedAmusement())
const removePlannedAmusement = (index) => plannedAmusementList.value.splice(index, 1)
const addPlannedAgricultural = () => plannedAgriculturalList.value.push(createPlannedAgricultural())
const removePlannedAgricultural = (index) => plannedAgriculturalList.value.splice(index, 1)
const addPlannedGreenhouse = () => plannedGreenhouseList.value.push(createPlannedGreenhouse())
const removePlannedGreenhouse = (index) => plannedGreenhouseList.value.splice(index, 1)

const existingYardList = ref([])
const plannedYardList = ref([])

const yardCategories = [
  { label: '小养殖', value: 'small_breeding' },
  { label: '小种植', value: 'small_planting' },
  { label: '小手工业', value: 'small_industry' },
  { label: '其他', value: 'other' }
]

const yardNames = [
  { label: '鸡', value: 'chicken' },
  { label: '鸭', value: 'duck' },
  { label: '鹅', value: 'goose' },
  { label: '猪', value: 'pig' },
  { label: '羊', value: 'sheep' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '水果', value: 'fruit' },
  { label: '花卉', value: 'flower' },
  { label: '其他', value: 'other' }
]

const yardUnits = [
  { label: '头', value: 'head' },
  { label: '只', value: 'piece' },
  { label: '羽', value: 'feather' },
  { label: '尾', value: 'tail' },
  { label: '株', value: 'plant' },
  { label: '平方米', value: 'square_meter' },
  { label: '亩', value: 'mu' }
]

const createExistingYard = () => ({
  id: Date.now(),
  category: '',
  name: '',
  amount: '',
  unit: '',
  actualIncome: ''
})

const createPlannedYard = () => ({
  id: Date.now(),
  category: '',
  name: '',
  amount: '',
  unit: '',
  estimatedIncome: ''
})

const addExistingYard = () => existingYardList.value.push(createExistingYard())
const removeExistingYard = (index) => existingYardList.value.splice(index, 1)
const addPlannedYard = () => plannedYardList.value.push(createPlannedYard())
const removePlannedYard = (index) => plannedYardList.value.splice(index, 1)

const financeForm = reactive({
  wageIncome: '',
  productionIncome: '',
  assetIncome: '',
  otherPropertyIncome: '',
  birthBonus: '',
  lowIncomeAllowance: '',
  specialSupportFund: '',
  pension: '',
  ecologicalCompensation: '',
  otherTransferIncome: '',
  otherIncome: '',
  plantingExpense: '',
  breedingExpense: '',
  operatingExpense: '',
  otherExpense: '',
  claimIncome: '',
  rigidExpense: '',
  remark: '暂无'
})

const computedFinance = computed(() => {
  const num = (val) => parseFloat(val) || 0
  const propertyIncome = num(financeForm.assetIncome) + num(financeForm.otherPropertyIncome)
  const transferIncome = num(financeForm.birthBonus) + num(financeForm.lowIncomeAllowance) + num(financeForm.specialSupportFund) + num(financeForm.pension) + num(financeForm.ecologicalCompensation) + num(financeForm.otherTransferIncome)
  const annualIncome = num(financeForm.wageIncome) + num(financeForm.productionIncome) + propertyIncome + transferIncome + num(financeForm.otherIncome)
  const annualExpense = num(financeForm.plantingExpense) + num(financeForm.breedingExpense) + num(financeForm.operatingExpense) + num(financeForm.otherExpense)
  const netIncome = annualIncome - annualExpense
  const householdSize = memberList.value.length || 1
  const perCapitaIncome = householdSize > 0 ? (netIncome / householdSize).toFixed(2) : '0'
  const monitoringIncome = '0'
  const monitoringPerCapitaIncome = '0'
  const industryPlanIncome = '0'
  const industryPlanPerCapitaIncome = '0'
  
  return {
    propertyIncome: propertyIncome.toFixed(2),
    transferIncome: transferIncome.toFixed(2),
    pension: num(financeForm.pension).toFixed(2),
    annualIncome: annualIncome.toFixed(2),
    annualExpense: annualExpense.toFixed(2),
    netIncome: netIncome.toFixed(2),
    perCapitaIncome,
    monitoringIncome,
    monitoringPerCapitaIncome,
    industryPlanIncome,
    industryPlanPerCapitaIncome
  }
})

const vehicleList = ref([
  { type: '', quantity: '', source: '' }
])

const addVehicle = () => {
  vehicleList.value.push({ type: '', quantity: '', source: '' })
}

const removeVehicle = (index) => {
  if (vehicleList.value.length > 1) {
    vehicleList.value.splice(index, 1)
  }
}

const viewData = reactive({
  village: '',
  naturalGroup: '',
  householdNo: '',
  name: '',
  idCard: '',
  phone: '',
  isKeyPerson: '',
  isBelowIncome: '',
  isBelowLastYearIncome: '',
  hasEmergency: '',
  helperName: '',
  householdType: ''
})

const toggleTree = (node) => {
  if (node === 'county') {
    countyExpanded.value = !countyExpanded.value
  }
}

const toggleSearchPanel = () => {
  searchPanelExpanded.value = !searchPanelExpanded.value
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const selectVillage = (villageId) => {
  selectedVillage.value = villageId
}

const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const handleReset = () => {
  searchForm.householdNo = ''
  searchForm.name = ''
  searchForm.idCard = ''
  searchForm.phone = ''
  searchForm.isKeyPerson = ''
  searchForm.isBelowIncome = ''
  searchForm.isBelowLastYearIncome = ''
  searchForm.hasEmergency = ''
  searchForm.helperName = ''
  searchForm.householdType = ''
}

const selectYear = (year) => {
  selectedYear.value = year
  showYearSelector.value = false
  isEdit.value = false
  editId.value = null
  resetFormData()
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleAdd = () => {
  showYearSelector.value = true
}

const handleView = (row) => {
  Object.assign(viewData, row)
  viewDialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubsidy = (row) => {
  ElMessage.info(`为 ${row.householdNo} 申请补贴`)
}

const handleHelp = (row) => {
  ElMessage.info(`为 ${row.householdNo} 安排帮扶`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '您确定要删除吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const resetFormData = () => {
  formData.village = ''
  formData.naturalGroup = ''
  formData.householdNo = ''
  formData.name = ''
  formData.idCard = ''
  formData.phone = ''
  formData.isKeyPerson = ''
  formData.isBelowIncome = ''
  formData.isBelowLastYearIncome = ''
  formData.hasEmergency = ''
  formData.helperName = ''
  formData.householdType = ''
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getHouseholdTypeName = (type) => {
  const types = {
    'general': '一般农户',
    'poverty': '脱贫户',
    'monitor': '监测户'
  }
  return types[type] || type
}

const handleSubmit = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(item => item.id === editId.value)
    if (index > -1) {
      tableData.value[index] = { ...formData, id: editId.value }
    }
    ElMessage.success('修改成功')
  } else {
    tableData.value.push({
      ...formData,
      id: Date.now()
    })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.household-container {
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.main-layout {
  display: flex;
  width: 100%;
}

.left-sidebar {
  width: 220px;
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: relative;
  transition: width 0.3s ease;
}

.left-sidebar.collapsed {
  width: 24px;
  padding: 0;
  overflow: hidden;
  border-right: none;
}

.left-sidebar.collapsed .sidebar-content {
  display: none;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 10;
}

.sidebar-toggle:hover {
  background-color: #f5f7fa;
}

.search-box {
  display: flex;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  font-size: 13px;
}

.search-btn {
  padding: 0 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
}

.tree-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
}

.tree-item:hover {
  background-color: #f5f7fa;
}

.tree-item.active {
  background-color: #e8f4fd;
  color: #1989fa;
}

.tree-item.parent {
  font-weight: 500;
  color: #333;
}

.tree-icon {
  margin-right: 6px;
  font-size: 10px;
}

.tree-children {
  padding-left: 16px;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.search-panel {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.search-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.collapse-btn {
  background: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.collapse-btn:hover {
  background-color: #f5f7fa;
}

.search-content {
  padding: 16px;
}

.last-row {
  padding: 0 16px 16px;
  margin-bottom: 0;
}

.search-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label {
  width: 140px;
  text-align: right;
  font-size: 13px;
  color: #666;
}

.form-input,
.form-select {
  width: 180px;
}

.search-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.table-panel {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.table-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
}

.table-panel :deep(.el-table) {
  width: 100%;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-wrap: nowrap;
}

.action-buttons .divider {
  color: #999;
  margin: 0 1px;
  font-size: 12px;
}

.action-buttons :deep(.el-button) {
  padding: 3px 6px;
  font-size: 11px;
  border-radius: 2px;
  margin: 0;
}

.pagination-wrapper {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: center;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}

.dialog-container :deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}

.form-container {
  padding: 10px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-item {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
}

.view-container {
  padding: 10px;
}

.view-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.view-label {
  width: 180px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.view-value {
  flex: 1;
  margin-right: 20px;
}

.add-button-wrapper {
  position: relative;
}

.year-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 100px;
}

.year-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.year-item:hover {
  background-color: #f5f7fa;
}

.year-select-dialog {
  .el-dialog__body {
    padding: 0;
  }
}

.year-select-container {
  padding: 10px 0;
}

.year-option {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.year-option:hover {
  background-color: #f5f7fa;
}

.tabs-wrapper {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
  padding-left: 10px;
  overflow-x: auto;
}

.tab-item {
  padding: 12px 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  margin-right: 20px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-item.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  font-weight: 500;
}

.tab-item:hover {
  color: #1890ff;
}

.tab-content {
  min-height: 300px;
}

.section-divider {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin: 20px 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
  text-align: center;
}

.form-item.required .form-label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.form-input-small,
.form-select-small {
  width: 120px;
}

.vehicle-table {
  margin-bottom: 20px;
}

.vehicle-table-inner {
  margin-bottom: 15px;
}

.vehicle-add-btn {
  display: flex;
  justify-content: center;
}

.vision-section {
  margin-bottom: 20px;
}

.vision-textarea {
  width: 100%;
  resize: none;
}

.member-add-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.member-card {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e8e8e8;
}

.member-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex: 1;
  margin-right: 20px;
}

.member-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.member-item {
  flex: 0 0 calc(25% - 12px);
  min-width: 150px;
}

.member-delete-btn {
  color: #f56c6c;
}

.member-delete-btn:hover {
  color: #ef4444;
}

.agriculture-section {
  margin-bottom: 20px;
}

.agriculture-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 10px;
}

.agriculture-item {
  flex: 0 0 calc(16.666% - 12px);
  min-width: 120px;
}

.agriculture-item.delete-col {
  flex: none;
  width: auto;
}

.agriculture-add-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.delete-btn {
  color: #f56c6c;
  font-size: 20px;
}

.delete-btn:hover {
  color: #ef4444;
}

.breeding-section {
  margin-bottom: 20px;
}

.breeding-facility-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 10px;
}

.breeding-facility-item {
  flex: 0 0 calc(50% - 7px);
  min-width: 150px;
}

.breeding-facility-item.delete-col {
  flex: none;
  width: auto;
}

.breeding-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 10px;
}

.breeding-item {
  flex: 0 0 calc(14.285% - 13px);
  min-width: 100px;
}

.breeding-item.delete-col {
  flex: none;
  width: auto;
}

.breeding-add-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.specialty-section {
  margin-bottom: 20px;
}

.specialty-subtitle {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e8e8e8;
  text-align: center;
}

.specialty-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 10px;
}

.specialty-item {
  flex: 0 0 calc(16.666% - 12px);
  min-width: 120px;
}

.specialty-item.delete-col {
  flex: none;
  width: auto;
}

.specialty-add-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.yard-section {
  margin-bottom: 20px;
}

.yard-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 10px;
}

.yard-item {
  flex: 0 0 calc(16.666% - 12px);
  min-width: 120px;
}

.yard-item.delete-col {
  flex: none;
  width: auto;
}

.yard-add-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.finance-section {
  margin-bottom: 20px;
}

.finance-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  margin-bottom: 10px;
}

.finance-item {
  flex: 1;
  min-width: 150px;
}

.finance-item.computed {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.computed-input {
  background-color: #e8e8e8 !important;
  color: #666 !important;
}
</style>