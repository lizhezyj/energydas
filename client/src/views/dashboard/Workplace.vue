<template>
  <!-- <page-layout :avatar="avatar"> -->
  <page-layout>

    <div class="dashboard-container">
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <!-- 项目地图展示 -->
          <a-card
            class="project-list"
            :loading="loadingList.projectList"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="项目GIS图"
            :body-style="{ padding: 0 }">
            <a @click="gotoPath('/business/TbProjectList')" slot="extra">全部项目</a>
          
            <map-card
              :showPointCollection="true"
              :width="'100%'"
              :height="'300px'"
              @mapReady="mapReadyHandler"
              :points="mapPoints"
              :center="{lng: 117.632, lat:  39.304}"
              :zoom="7"
            />
          </a-card>
          <!-- 采集数据表 -->
          <!-- <TbProjectCascader style="display: none;" @getPjCascardVal="getPjVal" />

          <a-card :loading="loadingList.viewDataCheckedList" title="数据采集" :bordered="false">
            <a @click="gotoPath('/data/TbDataCheckedList')" slot="extra">查看全部</a>
            <viewDataChecked-charts 
              :title="echartsTitle" 
              :data="dataList.viewDataCheckedList.records" 
              :isShowToolBox="false"
              :isShowTypeSelectBox="false"
              />
          </a-card> -->
          <a-card :loading="loadingList.sensorDataAlarmList" title="报警动态" :bordered="false">
            <!-- <a @click="gotoPath('/alarm/TbSensorDataAlarmList')" slot="extra">当前报警({{dataList.sensorDataAlarmList.total}})</a> -->
            <a @click="gotoPath('/alarm/TbSensorDataAlarmList')" slot="extra">全部报警</a>

            <a-list>
              <!-- <a-list-item :key="index" v-for="(item, index) in  dataList.sensorDataAlarmList.records.slice(0, 5)"> -->
              <a-list-item :key="index" v-for="(item, index) in  dictOptions.tfSensorDataAlarm.slice(0, 5)">
                <a-list-item-meta>
                  <!-- <a-avatar slot="avatar" :src="item.user.avatar" /> -->
                  <div slot="title">
                    <span>{{ item.value }}</span>
                    <!-- 项目 -->
                    <!-- <span>{{ filterMultiDictText(dictOptions['tfProjectFkId'], item.tfProjectFkId+"") }}</span>&nbsp;
                    <span>{{ filterMultiDictText(dictOptions['tfAreaFkId'], item.tfAreaFkId+"") }}</span>&nbsp;
                    在&nbsp; -->
                    <!-- 工程部位 -->
                    <!-- <a href="javascript:;">{{ filterMultiDictText(dictOptions['tfCollecterPointerFkId'], item.tfCollecterPointerFkId+"") }}</a>&nbsp;
                    
                    <span>通道号</span>
                    <a href="javascript:;">{{ item.tfCollecterChannelCode }}</a>&nbsp;
                    <span>上次数据</span>
                    <a href="javascript:;">{{ item.tfPreVal }}</a>&nbsp;
                    <span>本次</span>
                    <a href="javascript:;">{{ item.tfVal }}</a>&nbsp;
                    <span>报警类型</span>
                    <a href="javascript:;">{{ item.tfAlarmType }}</a>&nbsp; -->

                    
                  </div>
                  <!-- 报警时间 -->
                  <div slot="description">{{ item.createTime }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>


        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card 
            :loading="loadingList.projectList && loadingList.tbProjectPersonList && loadingList.tbCollecterPointerList"
            title="设备状态"
            :bordered="false" 
            style="margin-bottom: 24px">
              <div class="members">
                <a-row>
                  <a-col :span="24" v-for="(item, i) in dictOptions.tfAreaSensorByProjectCount.slice(0, 5)" :key="i">
                    <a-tooltip>
                      <template slot="title" v-if="item.value.split('&&&')[1] != item.value.split('&&&')[0]">
                        {{item.value.split('&&&')[1]}}
                      </template>
                      <a :class="{ active: isActiveArr[i] }" @click="projectDataItemHandle(item.title, i)">
                        <p><span class="member" >{{ item.value.split('&&&')[0] }}</span></p>
                      </a>
                    </a-tooltip>
                  </a-col>
                  <a-col :span="24">
                    <bar style="padding: 0;margin-top: 10px;" yaxisText="传感器数量"  :dataSource="projectPieDataSource" />
                  </a-col>
                </a-row>
              </div>
          </a-card>
          
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'
import PageLayout from '@/components/page/PageLayout'
import HeadInfo from '@/components/tools/HeadInfo'
import Radar from '@/components/chart/Radar'
import { getRoleList, getServiceList, getAction } from '@/api/manage'
import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
import { deteleObject } from '@/utils/util'
import ViewDataCheckedCharts from '@/views/business/data/modules/ViewDataCheckedCharts.vue'
import mapCard from '@views/business/modules/TbProjectMapCard.vue'
import TbProjectCascader from '@/views/business/modules/TbProjectCascader.vue'
import pie from '@/components/chart/Pie.vue'
import Bar from '@/components/chart/Bar.vue'
import {addUser,editUser,queryUserRole,queryall } from '@/api/api'

export default {
  name: 'Workplace',
  components: {
    PageLayout,
    HeadInfo,
    Radar,
    ViewDataCheckedCharts,
    mapCard,
    TbProjectCascader,
    pie,
    Bar,
  },
  data() {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      selectedRole: '',
      roleList: '',
      // 首页数据 start
      loadingList: {
        sensorDataAlarmList: true,
        projectList: true,
        tbProjectPersonList: true,
        tbCollecterPointerList: true,
        viewDataCheckedList: true,
        tdicSensorDataTypeList: true,
      },
      dictOptions: {
        tfProjectFkId: [],
        tfAreaFkId: [],
        tfCollecterPointerFkId: [],
        tfSenserDataTypeCode: [],
        tfAreaSensorByProjectCount: [], //工程部位采集器数量
        tfSensorDataAlarm: [], //报警动态
      },
      queryParamList: {
        viewDataCheckedList: {
          tfProjectFkId: '',
          tfAreaFkId: '',
          tfSenserDataTypeCode: '',
          pageNo: 1,
          pageSize: 15,
        }
      },
      dataList: {
        sensorDataAlarmList: {records: []},
        projectList: '',
        tbProjectPersonList: '',
        tbCollecterPointerList: '',
        viewDataCheckedList: '',
        tdicSensorDataTypeList: '',
      },
      url: {
        // sensorDataAlarmList: '/sensor_data_alarm_manager/tbSensorDataAlarm/list?tf_flag=0', //传感器报警列表
        projectList: '/project_manager/tbProject/list', //项目列表
        // tbProjectPersonList: '/project_person_manager/tbProjectPerson/list', //项目人员
        // tbCollecterPointerList: "/collecter_pointer_manager/tbCollecterPointer/list", //采集器编号列表
        // viewDataCheckedList: "/view_data_checked/viewDataChecked/list", //采集数据列表
        // tdicSensorDataTypeList: "/sensor_data_type_manager/tdicSensorDataType/list", //参数列表

      },
      mapState: false,
      pieDataSource: {

      },
      projectPieDataSource: [],
      isActiveArr: []
      // 首页数据 end
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    mapPoints() {
      let res = []
      if (this.dataList.projectList && this.dataList.projectList.records.length > 0 && this.mapState ) {
        this.dataList.projectList.records.forEach(dataItem => {
          res.push({
            lat: dataItem.tfLat,
            lng: dataItem.tfLng,
            id: dataItem.id,
            projectData: dataItem,
          })
        })
        return res
      }
    },
    mapCenter() {
      if (this.points) return this.points[0]
    },
    viewDataCheckedListQueryParam() {
      return this.queryParamList.viewDataCheckedList
    },
  },
  created() {
    this.user = this.userInfo
    this.avatar = window._CONFIG['imgDomainURL'] + '/' + this.userInfo.avatar
    console.log('this.avatar :' + this.avatar)

    getRoleList().then(res => {
      console.log('workplace -> call getRoleList()', res)
    })

    getServiceList().then(res => {
      console.log('workplace -> call getServiceList()', res)
    })
  },
  mounted() {
    this.initDictConfig()
    this.getInit()
    // this.loadUserRoles()
  },
  watch: {
    viewDataCheckedListQueryParam: {
      deep: true,
      handler(data) {
        if (data.tfAreaFkId && data.tfProjectFkId && data.tfSenserDataTypeCode) {
          this.loadData('viewDataCheckedList', this.queryParamList.viewDataCheckedList)
        } else {
          console.log('请选择必选参数')
        }
      }
    }
  },
  methods: {
    // 获取用户角色
    async loadUserRoles(){
      // 获取当前用户角色
      await queryUserRole({userid:this.$store.getters.userInfo.id}).then((res)=>{
        if(res.success){
          this.selectedRole = res.result;
        }else{
          console.log(res.message);
        }
      });
      // 获取所有用户角色
      await queryall().then((res)=>{
        if(res.success){
          this.roleList = res.result;
        }else{
          console.log(res.message);
        }
      });
      // 判断当前用户是否为管理员角色
      let res = false
      for (var i = 0; i < this.roleList.length; i++) {
        for (var j = 0; j < this.selectedRole.length; j++) {
          if (this.roleList[i].roleName == '系统管理员' && this.roleList[i].id == this.selectedRole[j]) {
            res = true
          }
        }
      }
      return res
    },
    // 点击项目列表切换饼图数据
    async projectDataItemHandle(projectId, index) {
      this.isActiveArr = [...this.isActiveArr].fill(false)
      console.log(this.isActiveArr)
      this.isActiveArr[index] = true
      await this.getAndGeneratePieDataSource(projectId)
      this.projectPieDataSource = this.pieDataSource[projectId]
    },
    // 首页展示数据 start
    async initDictConfig(){
      // const isAdminRole = this.loadUserRoles()
      const initDictConfigUrl = {
        tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`,
        // tfAreaSensorByProjectCount: `view_txt_count_area_sensor_by_project,tf_project_fk_id,v_txt_area_sensor_count,tf_user_fk_id='${this.$store.getters.userInfo.username}'--and--tf_project_state='run'`,
        tfAreaSensorByProjectCount: `view_txt_count_area_sensor_by_project,tf_project_fk_id,v_txt_area_sensor_count,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
        tfSensorDataAlarm: `view_count_sensor_data_alarm_by_collecter_point,tf_user_fk_id,v_txt_sensor_alarm_count,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
      }
      // const AllInitDictConfigUrl = {
      //   tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id`,
      //   tfAreaSensorByProjectCount: `view_txt_count_area_sensor_by_project,tf_project_fk_id,v_txt_area_sensor_count,tf_project_state='run'`,
      //   tfSensorDataAlarm: `view_count_sensor_data_alarm_by_collecter_point,tf_user_fk_id,v_txt_sensor_alarm_count`,
      // }
      // const initDictConfigUrl = isAdminRole ? AllInitDictConfigUrl : filterInitDictConfigUrl
      // 所有的项目列表-根据角色过滤
      initDictOptions(
        initDictConfigUrl.tfProjectFkId
      ).then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfProjectFkId', deteleObject(res.result))
        }
      })
      // // 工程部位 
      // initDictOptions('view_area,tf_code,id').then((res) => {
      //   if (res.success) {
      //     this.$set(this.dictOptions, 'tfAreaFkId', res.result)
      //   }
      // })
      // // 采集器编号
      // initDictOptions('tb_collecter_pointer,tf_collecter_product_code,id').then((res) => {
      //   if (res.success) {
      //     this.$set(this.dictOptions, 'tfCollecterPointerFkId', res.result)
      //   }
      // })
      // 所有的15类采集参数
      initDictOptions('tdic_sensor_data_type,tf_name,tf_code').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfSenserDataTypeCode', res.result)
          // 设置采集参数默认值
          this.queryParamList.viewDataCheckedList.tfSenserDataTypeCode = this.dictOptions.tfSenserDataTypeCode[0].value
        }
      })
      // 项目参数
      initDictOptions(
        initDictConfigUrl.tfAreaSensorByProjectCount
      ).then(res => {
        console.log(res)
        if (res.success) {
          this.$set(this.dictOptions, 'tfAreaSensorByProjectCount', res.result)
          this.isActiveArr = [...this.dictOptions.tfAreaSensorByProjectCount].fill(false)
          const tf_project_fk_id = res.result[0].text
          this.projectDataItemHandle(tf_project_fk_id, 0) 
        }
      })
      // 报警动态
      initDictOptions(
        initDictConfigUrl.tfSensorDataAlarm
      ).then(res => {
        console.log(res)
        if (res.success) {
          this.$set(this.dictOptions, 'tfSensorDataAlarm', res.result)
          this.$set(this.loadingList, 'sensorDataAlarmList', false)

        }
      })
      
    },
    // 获取并设置项目饼图数据
    async getAndGeneratePieDataSource(tf_project_fk_id) {
      if (this.pieDataSource[tf_project_fk_id] && this.pieDataSource[tf_project_fk_id].length > 0) return
      await initDictOptions(`view_count_sensor_by_data_type_project,tf_sensor_data_type_code,
      v_sensor_count,tf_project_fk_id='${tf_project_fk_id}'`)
      .then(res => {
        if (res.success) {
          let resultArr = []
          res.result.forEach(res => {
            let resItem = {}
            resItem.x = filterMultiDictText(this.dictOptions.tfSenserDataTypeCode, res.title)
            resItem.y = parseInt(res.value)
            resultArr.push(resItem)
          })
          this.$set(this.pieDataSource, tf_project_fk_id, resultArr)
        }
      })
    },
    filterMultiDictText, //字典文本替换
    loadData(arg, params) {
      // var params = ;//查询条件
      getAction(this.url[arg], params)
        .then((res) => {
          if (res.success) {
            // 对项目列表数据进行处理，只要run和finshed状态
            if (arg == 'projectList') {
              try {
                let records = res.result.records
                res.result.records = records.filter(item => {
                  return item.tfState == 'run'
                } )
              } catch(err) {
                console.log(err)
              }
            }
            if (arg == 'sensorDataAlarmList') {
              let records = res.result.records
              records.sort((a, b) => {
                return Date.parse(b.createTime) - Date.parse(a.createTime)
              })
            }
            this.$set(this.dataList, arg, res.result)
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.$set(this.loadingList, arg, false)
        })
        .catch(err => {
          this.$set(this.loadingList, arg, false)
        })
    },
    getInit() {
      for (let urlItem in this.url) {
        if (urlItem != 'viewDataCheckedList') this.loadData(urlItem)
      }
    },
    gotoPath(path) {
      this.$router.push(path).catch(err => err)
    },

    mapReadyHandler() {
      this.mapState = true
    },
    
    getPjVal(data) {
      //获取第一个项目第一个工程部位
      console.log(data)
      this.queryParamList.viewDataCheckedList.tfProjectFkId = data[0]
      this.queryParamList.viewDataCheckedList.tfAreaFkId = data[1]
    },
    // 首页展示数据 end 
    ...mapGetters(['nickname', 'welcome']),
  }
}
</script>

<style lang="scss">
.dashboard-container {
  .ant-card-head {
    padding: 0 18px;
  }
  .ant-card-body {
    padding: 18px 12px;
  }
  .ant-card-head-title,
  .ant-card-extra {
    padding: 12px 0;
  }
  .project-list {
    .page-header {
      padding: 32px;
    }
    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        // margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      line-height: 24px;
      // height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 24px;
        // max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
      &.active {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {
    .project-list {
      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }
}

</style>