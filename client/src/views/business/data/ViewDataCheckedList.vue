<template>
  <div>
    <tb-project-breadcrumb 
      style="padding: 0 0 8px 0;"
      :dictCodes="dictCodes" 
      @selectDropMenuItemChange="selectDropMenuItemChange"
    />
    <a-card class="data-main-card" :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="handleSearchQuery">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item label="起始日期">
                <c-range
                  dateFormat="YYYY-MM-DD"
                  v-model="createTime_block" 
                  :ranges="dateRanges"
                />
              </a-form-item>
            </a-col>
            <a-radio-group
              style="margin-top: 5px;"
              name="radioGroup" 
              v-model="dataSourceType"
              >
              <a-radio :value="1">图表类型1</a-radio>
              <a-radio :value="2">图表类型2</a-radio>
            </a-radio-group>
            <a-button type="primary" icon="redo" @click="handleSearchQuery">刷新</a-button>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->
      <a-tabs :defaultActiveKey="isUserViewData ? '2' : '1'" style="margin: 0; background-color: #fff;">
        <a-tab-pane tab="表格数据" key="1">
          <a-card :bordered="false">
            <!-- 操作按钮区域 -->
            <div class="table-operator">
              <a-button type="primary" icon="file-excel" @click="handleExportXlsVisible = true">导出Excel</a-button>
              <a-modal :width="600" title="导出Excel" v-model="handleExportXlsVisible" @ok="handleExportXlsOk">
                <a-radio-group name="radioGroup" v-model="exportXlsDataType" :defaultValue="1">
                  <a-radio :value="1">导出当前查询条件对应的采集器编号数据</a-radio>
                  <a-radio :value="2">导出当前查询条件对应项目数据</a-radio>
                </a-radio-group>
              </a-modal>
              <a-button type="primary" icon="file-word" @click="handleExport">导出Word</a-button>
              <a-button v-if="selectedRowKeys.length > 0" icon="file-excel" @click="handleExportXls(echartsTitle, 'selectedRow')">导出已选项</a-button>
            </div>
            <!-- table区域-begin -->
            <div>
              <div class="ant-alert ant-alert-info" style="padding-left:24px;">
                <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
                <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
                <a style="margin-left: 24px" @click="onClearSelected">清空</a>
              </div>

              <table-header-unit-info :showType="isUserViewData ? 2 : 3" :tfSensorDataTypeCode="queryParam.tfSensorDataTypeCode" />

              <a-table
                ref="table"
                size="middle"
                bordered
                :rowKey="dataSourceType == 1 ? 'id' : 'tdv'"
                :columns="dataSourceType == 1 ? columns : columns2"
                :dataSource="dataSourceType == 1 ? dataSource : dataSource2"
                :pagination="ipagination"
                :loading="loading"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="handleTableChange"
                :scroll="{ x: 'max-content' }"
              >
                <!-- 数据编辑列 -->
                <template
                  v-for="col in editColsName"
                  :slot="col" 
                  slot-scope="text, record">
                  <div :key="col">
                    <a-input
                      v-if="record.editable"
                      style="margin: -5px 0;width: 100px;"
                      :value="text"
                      @change="e => handleTableColChange(e.target.value, record.id, col)"
                    />
                    <template v-else>{{Number(text).toFixed(1)}}</template>
                  </div>
                </template>
                <!-- 操作列 -->
                <span slot="action" slot-scope="text, record"> 
                  <span v-if="record.editable">
                    <a @click="() => handleTableColSave(record)">保存</a>
                    &nbsp;&nbsp;
                    <a-popconfirm title="确定取消吗?" @confirm="() => handleTableColCancel(record)">
                      <a>取消</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a @click="() => handleTableColEdit(record)">编辑</a>
                  </span>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-tab-pane>
        <a-tab-pane tab="图表数据" key="2" forceRender>
          <a-card :bordered="false">
            <viewDataChecked-charts 
              ref="mychart"
              :title="echartsTitle" 
              :data="dataLineSource"
              :echartsType="dataSourceType"
              :tfSensorDataTypeViewUnit="tfSensorDataTypeViewUnit"
              @getEchartDataUrl="getEchartDataUrl"
            />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <export-word
      ref="exportModal"
      :exportWordData="exportWordData"
      :dateRanges="dateRanges"
      :queryParam="queryParam"
      :tfProjectFkName="tfProjectFkName"
      :tfAreaFkName="tfAreaFkName"
      :tfCollecterPointerFkName="tfCollecterPointerFkName"
      @click="loadExportWordData"
      @changeExportDateTime="setTimeBlockToQueryParam"
      :loadExportWordDataComplete="loadExportWordDataComplete"
    /> 
  </div>
</template>

<script>
import { deleteAction, getAction, downFile,httpAction } from '@/api/manage'

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ViewDataCheckedCharts from './modules/ViewDataCheckedCharts.vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import CRange from '@/views/business/modules/CRange.vue'
import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { deteleObject } from '@/utils/util'
import { getDataColumns } from './dataColumns'
import moment from 'moment'
import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'
import ExportWord from './modules/ExportWord.vue'
import TableHeaderUnitInfo from '@/views/business/modules/TableHeaderUnitInfo.vue'

export default {
  name: 'ViewDataCheckedList',
  mixins: [JeecgListMixin],
  components: {
    JDictSelectTag,
    JDate,
    CRange,
    ViewDataCheckedCharts,
    TbProjectBreadcrumb,
    ExportWord,
    TableHeaderUnitInfo,
  },
  props: {
    // 是否用于用户展示
    isUserViewData: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      description: '查验采集数据管理页面',
      // 表头
      columns2: [],
      url: {
        // list: '/view_data_checked/viewDataChecked/list',
        list:  this.isUserViewData ? '/tb_data_checked/tbDataChecked/getListTv' : '/tb_data_checked/tbDataChecked/getList',
        // list: '/tb_data_checked/tbDataChecked/getListTv',
        channelList: '/tb_data_checked/tbDataChecked/getChannelSListTv',
        edit: "/view_data_checked/viewDataChecked/edit",
        delete: '/view_data_checked/viewDataChecked/delete',
        deleteBatch: '/view_data_checked/viewDataChecked/deleteBatch',
        exportXlsUrl: '/view_data_checked/viewDataChecked/exportXls',
        exportXlsAllUrl: this.isUserViewData ? '/tb_data_checked/tbDataChecked/exportXls' : '/tb_data_checked/tbDataChecked/exportTbXls',
        importExcelUrl: 'view_data_checked/viewDataChecked/importExcel'
      },
      dictOptions: {
        tfProjectFkId: [],
        tfAreaFkId: [],
        tfSensorDataTypeCode: [],
        tfCollecterPointerFkId: [],
        tfCollecterProductCode: [],
        tfSensorDataTypeViewUnit: [],
      },
      /* 分页参数 */
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      // 级联选择 start
      createTime_block: [moment().subtract(6, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
      defaultRangesValue: [moment().subtract(2, 'days'), moment()],
      isImmediatelyGetList: false, // 是否立即获取数据列表
      dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
          tfAreaFkId: '',
          tfCollecterPointerFkId: '', // 采集器编号
          tfSensorDataTypeCode: '', // 采集参数
        },
      dateRanges: { 
        '近三天': [moment().subtract(2, 'days'), moment()],
        '近七天': [moment().subtract(6, 'days'), moment()], 
        '近一个月': [moment().subtract(30, 'days'), moment()], 
      },
      dataSourceType: 1,
      dataSource: [],
      dataLineSource: [],
      dataSource2: [],
      exportWordData: {
        ZK: {}, //真空度
        ZX: {}, //孔隙水压力
        SM: {}, //水面
        YW: {}, //液位
        CJ: {}, //沉降
        spwy: {},
      },
      loadExportWordDataComplete: false,
      allowSearchQuery: true, //允许自动查询，
      handleExportXlsVisible: false,
      exportXlsDataType: 1,
      sensorCodeToTdList: [], //td值对应传感器型号列表 -- 用在表头td栏显示
      editColsName: [], //可编辑的列名
    }
  },
  computed: {
    // 用户展示和数据校验不同的列展示(有无操作列)
    columns() {
      const res = [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '日期',
          align: 'center',
          dataIndex: 'create_time',
          sorter: (a, b) => {
            return Date.parse(a.create_time) - Date.parse(b.create_time)
          },
        },
        {
          title: '采集器编号',
          align: 'center',
          dataIndex: 'tf_collecter_product_code',
        },
        // {
        //   title: '查验状态',
        //   align: 'center',
        //   dataIndex: 'tf_checked',
        // },
        // {
        //   title: '补数',
        //   align: 'center',
        //   dataIndex: 'tf_is_virtual_data',
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        }
      ]
      if (this.isUserViewData) {
        res.pop()
      }
      return res
    },
    tfProjectFkName() {
      return filterMultiDictText(this.dictOptions.tfProjectFkId, this.queryParam.tfProjectFkId+'')
    },
    tfAreaFkName() {
      return filterMultiDictText(this.dictOptions.tfAreaFkId, this.queryParam.tfAreaFkId+'')
    },
    tfSenserDataTypeName() {
      return filterMultiDictText(this.dictOptions.tfSensorDataTypeCode, this.queryParam.tfSensorDataTypeCode+'')
    },
    tfCollecterPointerFkName() {
      return filterMultiDictText(this.dictOptions.tfCollecterPointerFkId, this.queryParam.tfCollecterPointerFkId + '')
    },
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    echartsTitle() {
      return `${this.tfProjectFkName}-${this.tfAreaFkName}-${this.tfCollecterPointerFkName}-${this.tfSenserDataTypeName}变化过程曲线`
    },
    // editColsName() {
    //   let res = []
    //   console.log(this.columns)
    //   this.columns.forEach(columnsItem => {
    //     if (columnsItem.dataIndex.indexOf('tv') > -1) {
    //       res.push(columnsItem.dataIndex)
    //     }
    //   })
    //   return res
    // },
    tfSensorDataTypeViewUnit() {
      return filterMultiDictText(this.dictOptions.tfSensorDataTypeViewUnit, this.queryParam.tfSensorDataTypeCode+'')
    },
  },
  watch: {
    createTime_block() {
      this.setTimeBlockToQueryParam()
    },
    queryParam: {
      deep: true,
      handler(data) {
        this.handleSearchQuery()
      }
    },
    'queryParam.tfSensorDataTypeCode': {
        handler() {
          this.getSensorCodeToTdList()
        }
      },
    'queryParam.tfCollecterPointerFkId': {
      handler() {
        this.getSensorCodeToTdList()
      }
    },
  },
  created() {
    this.setTimeBlockToQueryParam()
  },
  methods: {
    handleSearchQuery() {
        if (this.queryParam.tfAreaFkId && this.queryParam.tfSensorDataTypeCode && this.queryParam.tfCollecterPointerFkId && this.allowSearchQuery) {
          this.searchQuery()
        } else {
          this.dataSource = []
          this.dataLineSource = []
        }
      },
    /** 生成可编辑col列 */
    generateEditColsName(columns) {
      let res = []
      columns.forEach(columnsItem => {
        if (columnsItem.dataIndex.indexOf('tv') > -1) {
          res.push(columnsItem.dataIndex)
        }
      })
      this.editColsName = res
    },
    // 获取td值对应传感器型号列表
    getSensorCodeToTdList() {
      if (!this.queryParam.tfCollecterPointerFkId || !this.queryParam.tfSensorDataTypeCode) return
      // 采集器编号id
      initDictOptions(`tb_sensor_pointer,tf_collecter_channel_code,tf_sensor_product_code,tf_collecter_pointer_fk_id='${this.queryParam.tfCollecterPointerFkId}'--and--tf_sensor_data_type_code='${this.queryParam.tfSensorDataTypeCode}'`)
        .then(res => {
          if (res.success) {
            this.sensorCodeToTdList = res.result
          }
        })
    },
    // 导出excel
    handleExportXlsOk() {
      this.handleExportXlsVisible = false
      if (this.exportXlsDataType == 1) {
        this.handleExportXls()
      } else if (this.exportXlsDataType == 2) {
        this.handleExportAllXls()
      }
    },
    //导出所有项目数据
    handleExportAllXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = this.tfProjectFkName + "导出文件"
      }
      let param = {...this.queryParam}
      // param.additem(tfProjectName，value);//取下项目名称加到参数里
      param.tfProjectName = this.tfProjectFkName
      console.log("导出参数",param)
      downFile(this.url.exportXlsAllUrl,param).then((data)=>{
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    // 设置时间选择器的值至查询参数
    setTimeBlockToQueryParam(val) {
      if (val) { //监听子组件
        this.$set(this.queryParam, 'startTime', val[0])
        this.$set(this.queryParam, 'endTime', val[1])
        this.createTime_block = val
        return
      } 
      if (this.createTime_block) {
        this.$set(this.queryParam, 'startTime', this.createTime_block[0])
        this.$set(this.queryParam, 'endTime', this.createTime_block[1])
      }
    },
    // 打开导出word modal
    handleExport() {
      this.$refs.exportModal.open();
    },
    // 同步请求加载导出word的数据
    async loadExportWordData(assignExportDataTypeList) {
      console.log('loadExportWordData')
      console.log(assignExportDataTypeList)
      console.log('同步请求加载导出word的数据--------------------start--------------------')
      this.allowSearchQuery = false
      this.loadExportWordDataComplete = false
      this.exportWordData =  {
        ZK: {}, //真空度
        ZX: {}, //孔隙水压力
        SM: {}, //水面
        YW: {}, //液位
        CJ: {}, //沉降
        spwy: {},
      }
      const oldQueryParam = this.queryParam
      // 获取当前项目工程部位有数据的采集参数
      // let tfSensorDataTypeCode = await initDictOptions(`view_collecter_pointer_list_data_type,tf_sensor_data_type_code,tf_sensor_data_type_name,tf_area_fk_id='${this.queryParam.tfAreaFkId}'`)
      // if (tfSensorDataTypeCode.success) {
      //   tfSensorDataTypeCode = tfSensorDataTypeCode.result
      // } else {
      //   tfSensorDataTypeCode = []
      // }
      let tfSensorDataTypeCode = this.dictOptions.tfSensorDataTypeCode;
      if (tfSensorDataTypeCode.length == 0) {
        this.$message.warning('当前项目工程部位没有可导出的采集参数数据!')
        this.$refs.exportModal.confirmLoading = false
        this.$refs.exportModal.close()
        this.allowSearchQuery = true
        return 
      }
      // 当前项目工程部位有数据的采集参数，过滤指定采集参数
      for (let m = 0; m < tfSensorDataTypeCode.length; m++) {
        for (let n = 0; n < assignExportDataTypeList.length; n++) {
          if (tfSensorDataTypeCode[m].value == assignExportDataTypeList[n].tfDataTypeName) {
            tfSensorDataTypeCode.splice(m, 1)
            m--
            break
          }
        }
      }
      console.log(tfSensorDataTypeCode)
      // return 
      // 获取指定参数指定通道号的数据
      for (let i = 0; i < assignExportDataTypeList.length; i++) {
        this.$set(this.queryParam, 'tfSensorDataTypeCode', assignExportDataTypeList[i].tfDataTypeName)
        await this.loadChannelData(assignExportDataTypeList[i].tfChannelList.split(',').join('-'))
        await new Promise((resolve) => { //解决获取数据后，echart图片还未渲染出来的问题
          setTimeout(resolve, 3000)
        })
      }
      delete this.queryParam.channelList
      for (let i = 0; i < tfSensorDataTypeCode.length; i++) {
        this.$set(this.queryParam, 'tfSensorDataTypeCode', tfSensorDataTypeCode[i].value)
        await this.loadData()
        await new Promise((resolve) => { //解决获取数据后，echart图片还未渲染出来的问题
          setTimeout(resolve, 3000)
        })
      }
      this.allowSearchQuery = true
      this.loadExportWordDataComplete = true
      console.log('同步请求加载导出word的数据--------------------end--------------------')
      this.queryParam = oldQueryParam
    },
    // 生成导出word的数据
    generateExportWordData() {
      console.log('generateExportWordData')
      let columns = {}
      this.columns.forEach(item => {
        if (item.dataIndex) {
          columns[item.dataIndex] = item.title
        }
      })
      try {
        this.exportWordData[this.queryParam.tfSensorDataTypeCode].table_title = this.echartsTitle
        this.exportWordData[this.queryParam.tfSensorDataTypeCode].table_col_title = this.dataSource ? columns : ''
        this.exportWordData[this.queryParam.tfSensorDataTypeCode].table_data = JSON.parse(JSON.stringify(this.dataSource))
        this.exportWordData[this.queryParam.tfSensorDataTypeCode].table_data_unit = this.tfSensorDataTypeViewUnit
        // 导出的数据tv值添加单位
        // this.exportWordData[this.queryParam.tfSensorDataTypeCode].table_data.map(item => {
        //   for (let i in item) {
        //     if (i.indexOf('tv') > -1) {
        //       item[i] = item[i] ? item[i] + this.tfSensorDataTypeViewUnit : ''
        //     }
        //   }
        // })
      } catch (error) {
        console.log('导出数据参数异常', this.queryParam.tfSensorDataTypeCode)
      }
      
    },
    // 获取echart图片base64
    getEchartDataUrl(val) {
      try {
        this.exportWordData[this.queryParam.tfSensorDataTypeCode].img_data = val
      } catch (error) {
        console.log('导出数据参数异常', this.queryParam.tfSensorDataTypeCode)
      }
    },
    // 数据类型改变
    generateDataSourceType2(dataSource) {
      let resDataSource = []
      let tdv = []
      // 获取tv、td列序号
      for (let i in dataSource[0]) {
        if (i.indexOf('tv') > -1 || i.indexOf('td') > -1) {
          tdv.push(i)
        }
      }
      // 对tv、td进行排序
      tdv.sort((a, b) => {
        a = a.split('tv')[1] || a.split('td')[1] 
        b = b.split('tv')[1] || b.split('td')[1] 
        return a - b 
      })
      tdv.map(l => {
        resDataSource.push({
          tdv: l
        })
      })
      dataSource.map(dataItem => {
        resDataSource.map((dataIndexItem, resDataSourceIndex) => {
          for (let d in dataItem) {
            if (d == dataIndexItem.tdv) {
              // 目前时间数据有重复，无法放到列中
              for (let g in resDataSource[resDataSourceIndex]) {
                if (g != dataItem.create_time) resDataSource[resDataSourceIndex][dataItem.create_time] = dataItem[d]
              }
              // resDataSource[resDataSourceIndex][dataItem.create_time] = dataItem[d]
            }
          }
        })
      })

      this.columns2 = []
      for (let j in resDataSource[0]) {
        this.columns2.push({
          title: j == 'tdv' ? '通道数' : j,
          align: 'center',
          dataIndex: j,
          fixed: j == 'tdv' ? 'left': ''
          // customRender: text => {
          //   if (!text) {
          //     return ''
          //   } else {
          //     return j == 'tdv' ? text : text + this.tfSensorDataTypeViewUnit
          //   }
          // },
        })
      }
      this.dataSource2 = resDataSource
      console.log(resDataSource)
    },
    // 面包屑下拉选择
    selectDropMenuItemChange(data) {
      switch(data.dataIndex) {
        case 'tfProjectFkId':
          this.dictCodes.tfAreaFkId = `tb_area,tf_code,id,tf_project_fk_id='${data.value}'`
          this.$set(this.queryParam, 'tfProjectFkId', data.value)
          this.$set(this.queryParam, 'tfAreaFkId', '')
          this.$set(this.queryParam, 'tfCollecterPointerFkId', '')
          this.$set(this.queryParam, 'tfSensorDataTypeCode', '')
          break
        case 'tfAreaFkId':
          this.dictCodes.tfCollecterPointerFkId = `tb_collecter_pointer,tf_code,id,tf_area_fk_id='${data.value}'`
          this.dictCodes.tfSensorDataTypeCode = `st_data_type_by_area_data_type,tf_sensor_data_type_name,tf_sensor_data_type_code,tf_area_fk_id='${data.value}'`
          this.$set(this.queryParam, 'tfAreaFkId', data.value)
          this.$set(this.queryParam, 'tfCollecterPointerFkId', '')
          this.$set(this.queryParam, 'tfSensorDataTypeCode', '')
          break
        case 'tfCollecterPointerFkId':
          this.$set(this.queryParam, 'tfCollecterPointerFkId', data.value)
          break
        case 'tfSensorDataTypeCode':
          this.$set(this.queryParam, 'tfSensorDataTypeCode', data.value)
          break
      }
    },
    // 导出execl
    handleExportXls(echartsTitle, isSelectedRow) {
      if (this.dataSource.length == 0) {
        this.$message.warning('当前没有可导出的数据!')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeader = []
        let filterVal = []
        const columns = this.dataSourceType == 1 ? this.columns : this.columns2
        const dataSource = this.dataSourceType == 1 ? this.dataSource : this.dataSource2
        columns.forEach(column => {
          if (column.dataIndex && column.dataIndex != 'action') {
            tHeader.push(column.title)
            filterVal.push(column.dataIndex)
          }
        })
        const dataList = isSelectedRow ? this.selectionRows : dataSource
        const data = this.formatJson(filterVal, dataList)
        const filename = `${this.queryParam.startTime ? this.queryParam.startTime + '--' : ''}${this.queryParam.endTime ? this.queryParam.endTime : ''}${this.tfProjectFkName}${this.tfAreaFkName}${this.tfCollecterPointerFkName}${this.tfSenserDataTypeName}导出数据`
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: 'xlsx',
        })
        this.downloadLoading = false
      })
    },
    // 格式化导出数据
    formatJson(filterVal, jsonData) {
      var that = this
      return jsonData.map(v => filterVal.map(j => {
        switch (j) {
          case 'tf_project_fk_id':
            return filterMultiDictText(that.dictOptions['tfProjectFkId'], v[j] + '')
            break
          case 'tf_area_fk_id':
            return filterMultiDictText(that.dictOptions['tfAreaFkId'], v[j] + '')
            break
          case 'tf_senser_data_type_code':
            return filterMultiDictText(that.dictOptions['tfSensorDataTypeCode'], v[j] + '')
            break
          case 'tf_collecter_pointer_fk_id':
            return filterMultiDictText(that.dictOptions['tfCollecterPointerFkId'], v[j] + '')
            break
          // case 'tf_collecter_product_code':
          //   return filterMultiDictText(that.dictOptions['tfCollecterProductCode'], v[j] + '')
          //   break
          default:
            return v[j]
        }
      }))
    },
    // 获取指定通道的数据
    async loadChannelData(channelList) {
      if (!this.queryParam.startTime) {
        delete this.queryParam.startTime
        delete this.queryParam.endTime
      }
      var params = this.queryParam //查询条件

      params.channelList = channelList
      // params.channelList = 'tv1-tv2-tv3'
      await getAction(this.url.channelList, params).then(res => {
        console.log(res)
        if (res.success) {
          this.dataSource = res.result

          var startTime = new Date().getTime()
          /**
           * 根据数据动态显示列 start
           * 设置 ecartDataHeader
           */
          var columnsModel = getDataColumns(this.tfSensorDataTypeViewUnit)
          // 清除已有的列
          if (this.isUserViewData) {
            for (var k = this.columns.length; k--; k >= 0) {
              if (this.columns[k].remove) this.columns.splice(k, 1)
            }
          } else {
            for (var k = this.columns.length - 1; k--; k >= 0) {
              if (this.columns[k].remove) this.columns.splice(k, 1)
            }
          }
          
          // 遍历 columnsModel 并赋值
          for (var j = 0; j < columnsModel.length; j++) {
            var modelItem = columnsModel[j]
            for (var i in this.dataSource[0]) {
              var dataItem = i
              if (dataItem == modelItem.dataIndex) {
                // 如果是用户展示页面,tv列直接加在column数组后,
                // 数据校验页面,tv td列加在编辑列前面
                if (this.isUserViewData) {
                  this.columns.splice(this.columns.length, 0, modelItem)
                } else {
                  this.columns.splice(this.columns.length - 1, 0, modelItem)
                }
              }
            }
          }
          var endTime = new Date().getTime()
          console.log('动态显示列耗时：' + (endTime - startTime) + 'ms')
          /**
           * 根据数据动态显示列 end
           */
        }
      })
      // async/await 等待请求数据后，同步进行处理
      this.generateExportWordData()
      return 'ok'
    },
    // 根据获取到的数据动态展示列，替代 JeecgListMixin 中的 loadData
    async loadData(arg) {
      if (!this.isImmediatelyGetList) { //阻止第一次进入页面获取列表
        this.isImmediatelyGetList = !this.isImmediatelyGetList;
        return;
      }
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      // var params = this.getQueryParams() //查询条件
      if (!this.queryParam.startTime) {
        delete this.queryParam.startTime
        delete this.queryParam.endTime
      }
      var params = this.queryParam //查询条件
      this.loading = true
      await getAction(this.url.list, params).then(res => {
        if (res.success) {
          // 降序
          this.dataSource = JSON.parse(JSON.stringify(res.result)).sort((a, b) => {
            return Date.parse(b.create_time) - Date.parse(a.create_time)
          })
          // 升序
          this.dataLineSource = JSON.parse(JSON.stringify(res.result)).sort((a, b) => {
            return Date.parse(a.create_time) - Date.parse(b.create_time)
          })
          this.generateDataSourceType2(this.dataSource)
          // 数据对象的长度超过18组，将操作列设置为右侧固定
          if (!this.isUserViewData && this.dataSource[0] && Object.keys(this.dataSource[0]).length > 18) {
            this.$set(this.columns[this.columns.length - 1], 'fixed', 'right')
            this.$set(this.columns[0], 'fixed', 'left')
            this.$set(this.columns[1], 'fixed', 'left')
          } else {
            for (var c = 0; c < this.columns.length; c++) {
              delete this.columns[c].fixed
            }
          }
          // this.ipagination.total = res.result.total
          var startTime = new Date().getTime()
          /**
           * 根据数据动态显示列 start
           * 设置 ecartDataHeader
           */
          var columnsModel = getDataColumns(this.sensorCodeToTdList)
          // 清除已有的列
          if (this.isUserViewData) {
            for (var k = this.columns.length; k--; k >= 0) {
              if (this.columns[k].remove) this.columns.splice(k, 1)
            }
          } else {
            for (var k = this.columns.length - 1; k--; k >= 0) {
              if (this.columns[k].remove) this.columns.splice(k, 1)
            }
          }
          // 遍历 columnsModel 并赋值
          for (var j = 0; j < columnsModel.length; j++) {
            var modelItem = columnsModel[j]
            for (var i in this.dataSource[0]) {
              var dataItem = i
              if (dataItem == modelItem.dataIndex) {
                // 如果是用户展示页面,tv列直接加在column数组后,
                // 数据校验页面,tv td列加在编辑列前面
                if (this.isUserViewData) {
                  this.columns.splice(this.columns.length, 0, modelItem)
                } else {
                  this.columns.splice(this.columns.length - 1, 0, modelItem)
                }
              }
            }
          }
          this.generateEditColsName(this.columns)
          var endTime = new Date().getTime()
          console.log('动态显示列耗时：' + (endTime - startTime) + 'ms')
          /**
           * 根据数据动态显示列 end
           */
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
      // async/await 等待请求数据后，同步进行处理
      this.generateExportWordData()
      return 'ok'
    },
    initDictConfig() {
      // 所有的项目列表-根据角色过滤
      initDictOptions(
        `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`
      ).then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfProjectFkId', deteleObject(res.result))
        }
      })
      // 工程部位id
      initDictOptions('tb_area,tf_code,id').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfAreaFkId', res.result)
        }
      })
      // 所有的15类采集参数
      initDictOptions('tdic_sensor_data_type,tf_name,tf_code').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfSensorDataTypeCode', res.result)
        }
      })
      // 所有的15类采集参数单位
      initDictOptions('tdic_sensor_data_type,tf_view_unit,tf_code').then(res => {
        if (res.success) {
          // 设置采集参数单位
          this.$set(this.dictOptions, 'tfSensorDataTypeViewUnit', res.result)
        }
      })
      // 采集器编号id
      initDictOptions('tb_collecter_pointer,tf_code,id').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfCollecterPointerFkId', res.result)
        }
      })
    },
    // 分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
    },
    // 表格行编辑
    handleTableColEdit(record) {
      //编辑行，仅 tv 值可编辑
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => record.id === item.id)[0];
      if (target) {
        target.editable = true;
        this.dataSource = newDataSource;
      }
    },
    // 表格行编辑保存
    handleTableColSave(record) {
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => record.id === item.id)[0];
      if (target) {
        delete target.editable;
        this.dataSource = newDataSource;
      }
      var that = this;
      httpAction(that.url.edit,record,'put').then((res)=>{
        if(res.success){
          that.$message.success(res.message);
          that.loadData();
        }else{
          that.$message.warning(res.message);
        }
      })
    },
    // 表格行编辑取消
    handleTableColCancel(record) {
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => record.id === item.id)[0];
      if (target) {
        // Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.dataSource = newDataSource;
      }
      console.log(record)
    },
    // 表格行编辑change
    handleTableColChange(value, id, column) {
      console.log(value)
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => id === item.id)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newDataSource;
      }
    },
  }
}
</script>
<style lang="scss">
@import '~@assets/less/common.less';
.data-main-card>.ant-card-body {
  padding: 0;
}
.data-main-card {
  .ant-card-body {
    padding: 0;
  } 
  .table-page-search-wrapper {
    padding: 16px 22px 0;
    .ant-form-inline .ant-form-item {
      margin-bottom: 0px;
    }
  }
  .table-operator {
    margin-bottom: 12px;
  }

  .ant-tabs-bar {
    margin: 0;
  }
  .ant-card-wider-padding .ant-card-body {
    padding: 16px 22px;
  }
}


</style>