<template>
  <div>
    <tb-project-breadcrumb 
      style="padding: 0 0 8px 0;"
      :dictCodes="dictCodes" 
      @selectDropMenuItemChange="selectDropMenuItemChange"
    />
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <!-- <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="所属项目工程部位">
                <TbProjectCascader @getPjCascardVal="getPjVal" />              
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="连接采集器设备">
                <j-dict-select-tag placeholder="请选择连接采集器设备" v-model="queryParam.tfCollecterPointerFkId" :dictCode="dictCodes.tfCollecterPointerFkId" @getDictOptionsData="getTfCollecterPointerDictOptions" />
              </a-form-item>
            </a-col>
          </a-row> -->
          <a-row :gutter="24">       
            <a-col :md="8" :sm="8">
              <a-form-item label="采集时间">
                <c-range 
                  dateFormat="YYYY-MM-DD"
                  v-model="createTime_block" 
                  :ranges="dateRanges"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="报警类型">
                <j-dict-select-tag
                  placeholder="请选择报警类型"
                  v-model="queryParam.tfAlarmType"
                  dictCode="dic_alarm_type"
                />
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :md="6" :sm="8">
                <a-form-item label="通道号">
                  <a-input placeholder="请输入通道号" v-model="queryParam.tfCollecterChannelCode"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="传感器编号">
                  <a-input placeholder="请输入传感器编号" v-model="queryParam.tfSensorProductCode"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="采集器线分类">
                  <a-input placeholder="请输入采集器线分类" v-model="queryParam.tfLineCode"></a-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="6" :sm="8" >
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                <a @click="handleToggleSearch" style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->
      
      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
        <a-button type="primary" icon="download" @click="handleExportXls('tb_sensor_data_alarm')">导出</a-button>
        <a-button type="primary" icon="pushpin" @click="handleClearAlarm">清除当前报警</a-button>
        <a-radio-group
          style="margin-top: 5px;"
          name="radioGroup" 
          v-model="dataSourceType"
          >
          <a-radio :value="0">当前报警</a-radio>
          <a-radio :value="1">历史报警</a-radio>
        </a-radio-group>
        <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload> -->
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
        </a-dropdown> -->
      </div>

      <!-- table区域-begin -->
      <div>

        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
          :scroll="{ x: true }"
          >
          
          <template slot="imgSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无此图片</span>
            <img v-else :src="getImgView(text)" height="25px" alt="图片不存在" style="max-width:80px;font-size: 12px;font-style: italic;"/>
          </template>
          <template slot="fileSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无此文件</span>
            <a-button
              v-else
              :ghost="true"
              type="primary"
              icon="download"
              size="small"
              @click="uploadFile(text)">
              下载
            </a-button>
          </template>

          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>

        </a-table>
      </div>

      <tbSensorDataAlarm-modal ref="modalForm" @ok="modalFormOk"></tbSensorDataAlarm-modal>
    </a-card>
  </div>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbSensorDataAlarmModal from './modules/TbSensorDataAlarmModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import TbProjectCascader from '@/views/business/modules/TbProjectCascader.vue'
  import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'
  import { deleteAction, getAction,downFile } from '@/api/manage'
  import moment from 'moment'
  import CRange from '@/views/business/modules/CRange.vue'

  export default {
    name: "TbSensorDataAlarmList",
    mixins:[JeecgListMixin],
    components: {
      JDictSelectTag,
      TbSensorDataAlarmModal,
      TbProjectCascader,
      TbProjectBreadcrumb,
      CRange,
    },
    data () {
      return {
        description: 'tb_sensor_data_alarm管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          // {
          //   title:'从属工程部位',
          //   align:"center",
          //   dataIndex: 'tfAreaFkId',
          //   customRender:(text)=>{
          //     if(!text){
          //       return ''
          //     }else{
          //       return filterMultiDictText(this.dictOptions['tfAreaFkId'], text+"")
          //     }
          //   }
          // },
          // {
          //   title:'采集器编号',
          //   align:"center",
          //   dataIndex: 'tfCollecterPointerFkId',
          //   customRender:(text)=>{
          //     if(!text){
          //       return ''
          //     }else{
          //       return filterMultiDictText(this.dictOptions['tfCollecterPointerFkId'], text+"")
          //     }
          //   }
          // },
          {
            title:'采集时间',
            align:"center",
            dataIndex: 'createTime',
            sorter: (a, b) => {
            return Date.parse(a.create_time) - Date.parse(b.create_time)
          },
          },
          {
            title:'通道号',
            align:"center",
            dataIndex: 'tfCollecterChannelCode',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'传感器编号',
            align:"center",
            dataIndex: 'tfSensorProductCode'
          },
          {
            title:'采集器线分类',
            align:"center",
            dataIndex: 'tfLineCode'
          },
          {
            title:'报警上限',
            align:"center",
            dataIndex: 'tfUpAlert'
          },
          {
            title:'报警下限',
            align:"center",
            dataIndex: 'tfDownAlert'
          },
          {
            title:'报警斜率',
            align:"center",
            dataIndex: 'tfSlopeAlert'
          },
          {
            title:'报警累计',
            align:"center",
            dataIndex: 'tfTotalAlert'
          },
          {
            title:'累计初始值',
            align:"center",
            dataIndex: 'tfTotalAlertInitVal'
          },
          {
            title:'上次数据',
            align:"center",
            dataIndex: 'tfPreVal'
          },
          {
            title:'本次',
            align:"center",
            dataIndex: 'tfVal'
          },
          {
            title:'斜率值',
            align:"center",
            dataIndex: 'tfSlopeVal'
          },
          {
            title:'报警类型',
            align:"center",
            dataIndex: 'tfAlarmType'
          },
          // {
          //   title:'线缆分类通道号',
          //   align:"center",
          //   dataIndex: 'tfLineNumber'
          // },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align:"center",
          //   scopedSlots: { customRender: 'action' },
          // }
        ],
        url: {
          list: "/sensor_data_alarm_manager/tbSensorDataAlarm/list",
          delete: "/sensor_data_alarm_manager/tbSensorDataAlarm/delete",
          deleteBatch: "/sensor_data_alarm_manager/tbSensorDataAlarm/deleteBatch",
          exportXlsUrl: "/sensor_data_alarm_manager/tbSensorDataAlarm/exportXls",
          importExcelUrl: "sensor_data_alarm_manager/tbSensorDataAlarm/importExcel",
          setAllAlarmFlagUrl: "sensor_data_alarm_manager/tbSensorDataAlarm/setAllAlarmFlag",
        },
        dictOptions:{
         tfAreaFkId:[],
         tfCollecterPointerFkId:[],
        },
        dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
          tfAreaFkId: '',
          tfCollecterPointerFkId: '',
        },
        isImmediatelyGetList: false,
        createTime_block: [],
        dateRanges: { 
          '近三天': [moment().subtract(2, 'days'), moment()],
          '近七天': [moment().subtract(6, 'days'), moment()], 
          '近一个月': [moment().subtract(30, 'days'), moment()], 
        },
        dataSourceType: 0,
        queryParam: {
          tf_flag: 0,
        }
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    watch: {
      'queryParam.tfAreaFkId': {
        handler() {
          this.searchQuery()
        }
      },
      'queryParam.tfCollecterPointerFkId': {
        handler() {
          this.searchQuery()
        }
      },
      createTime_block() {
        if (this.createTime_block) {
          this.$set(this.queryParam, 'createTime_begin', this.createTime_block[0])
          this.$set(this.queryParam, 'createTime_end', this.createTime_block[1])
          console.log(this.queryParam)
        }
      },
      dataSourceType(val) {
        this.$set(this.queryParam, 'tf_flag', val)
        this.searchQuery()
      }
    },
    methods: {
      // 清除报警按钮
      handleClearAlarm() {
        getAction(this.url.setAllAlarmFlagUrl, this.queryParam).then((res) => {
          if (res.success) {
            this.$message.success('清除当前报警成功！')
            this.searchQuery()
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
      },
      // 面包屑下拉选择
      selectDropMenuItemChange(data) {
        switch(data.dataIndex) {
          case 'tfProjectFkId':
            this.dictCodes.tfAreaFkId = `tb_area,tf_code,id,tf_project_fk_id='${data.value}'`
            this.$set(this.queryParam, 'tfProjectFkId', data.value)
            break
          case 'tfAreaFkId':
            this.dictCodes.tfCollecterPointerFkId = `tb_collecter_pointer,tf_collecter_product_code,id,tf_area_fk_id='${data.value}'`
            this.$set(this.queryParam, 'tfAreaFkId', data.value)
            break
          case 'tfCollecterPointerFkId':
            this.$set(this.queryParam, 'tfCollecterPointerFkId', data.value)
            break
        }
      },
      searchReset() {
        delete this.queryParam.tfCollecterChannelCode
        delete this.queryParam.tfSensorProductCode
        delete this.queryParam.tfLineCode
        this.loadData(1);
      },
      getPjVal (data) {
        this.$set(this.queryParam, 'tfProjectFkId', data[0])
        this.$set(this.queryParam, 'tfAreaFkId', data[1])
        // 根据工程部位设置对应的采集器编号
        this.$set(this.dictCodes, 'tfCollecterPointerFkId', `tb_collecter_pointer,tf_collecter_product_code,id,tf_area_fk_id="${data[1]}"`)
      },
      getTfCollecterPointerDictOptions(val) {
        // 获取采集器编号下拉列表完成，设置第一个为默认值
        if (val.length > 0) {
          this.$set(this.queryParam, 'tfCollecterPointerFkId', val[0].value)
        } else {
          this.$set(this.queryParam, 'tfCollecterPointerFkId', '')
        }
      },
      initDictConfig(){
        initDictOptions('view_area,tf_code,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfAreaFkId', res.result)
          }
        })
        initDictOptions('tb_collecter_pointer,tf_collecter_product_code,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfCollecterPointerFkId', res.result)
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>