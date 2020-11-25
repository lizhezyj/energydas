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
        <a-row :gutter="24">
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
            <a-form-item label="厂家型号">
              <j-dict-select-tag :showSearch="true" placeholder="请选择厂家型号" v-model="queryParam.tfSensorProductTypeCode" :dictCode="`tdic_sensor_type,tf_product_type_name,tf_product_type_code,tf_data_type_code='${queryParam.tfSensorDataTypeCode}'`" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a> -->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('传感器')">导出</a-button>
      <a-button type="primary" icon="redo" @click="showModal">下发策略</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="2" @click="batchAdd"><a-icon type="plus"/>新增</a-menu-item>
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <a-modal
      title="触发下发策略"
      :visible="ModalVisible"
      @ok="handleSensorPointerProfile"
      :confirmLoading="handleSensorPointerProfileLoading"
      @cancel="modalHandleCancel"
    >
      <p>请确认您的操作？是否触发下发策略？</p>
    </a-modal>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" :class="queryParam.tfSensorDataTypeCode == 'ZX' ? 'mgb4' : 'mgb16'"> -->
      <div class="ant-alert ant-alert-info mgb4">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <table-header-unit-info :tfSensorDataTypeCode="queryParam.tfSensorDataTypeCode" />

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :scroll="{ x: 'max-content' }">
        
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

        <template
          v-for="col in editColsName"
          :slot="col.dataIndex" 
          slot-scope="text, record">
          <div :key="col.dataIndex">
            <sensor-pointer-editable-cell 
              ref="sensorPointerEditableCell"
              v-if="record.editable || record.addable" 
              :col="col"
              :record="record"
              :text="text"
              :dataSource="dataSource"
              :queryParam="queryParam"
              @handleTableColChange="handleTableColChange"
              @handleAddSelectItem="handleAddSelectItem"
            />
            <template v-else-if="col.filterMultiDictData">{{filterMultiDictDataCustomRenderFunc(text, col.dataIndex)}}</template>
            <template v-else>{{text}}</template>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <!-- 修改状态 -->
          <span v-if="record.editable">
            <a @click="() => handleTableColSave(record)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定取消吗?" @confirm="() => handleTableColCancel(record)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <!-- 新增状态 -->
          <span v-else-if="record.addable">
            <a @click="() => handleTableColAdd(record)">新增</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定取消吗?" @confirm="() => handleTableColAddCancel(record)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <!-- 默认状态 -->
          <span v-else>
            <!-- <a @click="handleTableColEdit(record)">编辑</a> -->
            &nbsp;&nbsp;
            <a @click="handleDetail(record)">编辑</a>
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
          
        </span>

      </a-table>
    </div>

    <tbSensorPointer-modal ref="modalForm" @ok="modalFormOk" :queryParam="queryParam"></tbSensorPointer-modal>
    <tdicSensorType-modal ref="tdicSensorTypeModalForm" @ok="tdicSensorTypeModalFormOk"></tdicSensorType-modal>

  </a-card>
   </div>
  
</template>

<script>

  import { getAction, httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbSensorPointerModal from './modules/TbSensorPointerModal'
  import SensorPointerEditableCell from './modules/SensorPointerEditableCell'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {deteleObject,toNonExponential} from '@/utils/util'
  import TbProjectCascader from '@/views/business/modules/TbProjectCascader.vue'
  import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'
  import TableHeaderUnitInfo from '@/views/business/modules/TableHeaderUnitInfo.vue'
  import { getSensorPointerProfile } from '@/api/api'
  import TdicSensorTypeModal from '@/views/business/device/modules/TdicSensorTypeModal'

  export default {
    name: "TbSensorPointerList",
    mixins:[JeecgListMixin],
    components: {
      JDictSelectTag,
      TbSensorPointerModal,
      TbProjectCascader,
      SensorPointerEditableCell,
      TbProjectBreadcrumb,
      TdicSensorTypeModal,
      TableHeaderUnitInfo,
    },
    data () {
      return {
        description: '传感器安装页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            align:"center",
            // fixed: 'left',
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'采集器编号',
            align:"center",
            dataIndex: 'tfCollecterPointerFkId',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfCollecterPointerFkId'], text+"")
              }
            },
          },
          {
            title:'通道号',
            align:"center",
            dataIndex: 'tfCollecterChannelCode',
            editData: true,
            // fixed: 'left',
            scopedSlots: {
              customRender: 'tfCollecterChannelCode'
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          // {
          //   title:'传感器编号',
          //   align:"center",
          //   dataIndex: 'tfSensorProductCode',
          //   editData: true,
          //   fixed: 'left',
          //   scopedSlots: {
          //     customRender: 'tfSensorProductCode'
          //   },
          //   sorter: (a, b) => {
          //     return a - b
          //   },
          // },
          // {
          //   title:'厂家型号',
          //   align:"center",
          //   dataIndex: 'tfSensorProductTypeCode',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfSensorProductTypeCode'
          //   },
          //   sorter: (a, b) => {
          //     return a - b
          //   },
          //   // customRender:(text)=>{
          //   //   if(!text){
          //   //     return ''
          //   //   }else{
          //   //     return filterMultiDictText(this.dictOptions['tfSensorProductTypeCode'], text+"")
          //   //   }
          //   // },
          // },
          {
            title:'传感器类型',
            align:"center",
            dataIndex: 'tfLineCode',
            editData: true,
            filterMultiDictData: true, //字典数据需要在template中过滤下
            scopedSlots: {
              customRender: 'tfLineCode'
            },
          },
          {
            title:'安装位置',
            align:"center",
            dataIndex: 'tfPosition',
            editData: true,
            scopedSlots: {
              customRender: 'tfPosition'
            },
          },
          // {
          //   title:'ζ1',
          //   align:"center",
          //   dataIndex: 'tfP1',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfP1'
          //   },
          // },
          // {
          //   title:'ζ2',
          //   align:"center",
          //   dataIndex: 'tfP2',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfP2'
          //   },
          // },
          // {
          //   title:'ζ3',
          //   align:"center",
          //   dataIndex: 'tfP3',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfP3'
          //   },
          // },
          // {
          //   title:'ζ4',
          //   align:"center",
          //   dataIndex: 'tfP4',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfP4'
          //   },
          // },
          // {
          //   title:'ζ5',
          //   align:"center",
          //   dataIndex: 'tfP5',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfP5'
          //   },
          // },
          // {
          //   title:'ζ6',
          //   align:"center",
          //   dataIndex: 'tfP6',
          //   editData: true,
          //   filterMultiDictData: true, //字典数据需要在template中过滤下
          //   scopedSlots: {
          //     customRender: 'tfP6'
          //   },
          // },
          // {
          //   title:'报警上限',
          //   align:"center",
          //   dataIndex: 'tfUpAlert',
          //   editData: true,
          //   scopedSlots: {
          //     customRender: 'tfUpAlert'
          //   },
          //   sorter: (a, b) => {
          //     return a - b
          //   },
          // },
          // {
          //   title:'报警下限',
          //   align:"center",
          //   dataIndex: 'tfDownAlert',
          //   editData: true,
          //   scopedSlots: {
          //     customRender: 'tfDownAlert'
          //   },
          //   sorter: (a, b) => {
          //     return a - b
          //   },
          // },
          {
            title:'报警斜率',
            align:"center",
            dataIndex: 'tfSlopeAlert',
            editData: true,
            scopedSlots: {
              customRender: 'tfSlopeAlert'
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'报警累计',
            align:"center",
            dataIndex: 'tfTotalAlert',
            editData: true,
            scopedSlots: {
              customRender: 'tfTotalAlert'
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'累计报警初始值',
            align:"center",
            dataIndex: 'tfTotalAlertInitVal',
            editData: true,
            scopedSlots: {
              customRender: 'tfTotalAlertInitVal'
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            // fixed: 'right',
            // width: 100,
          }
        ],
        url: {
          list: "/sensor_pointer_manager/tbSensorPointer/list",
          delete: "/sensor_pointer_manager/tbSensorPointer/delete",
          deleteBatch: "/sensor_pointer_manager/tbSensorPointer/deleteBatch",
          exportXlsUrl: "/sensor_pointer_manager/tbSensorPointer/exportXls",
          importExcelUrl: "sensor_pointer_manager/tbSensorPointer/importExcel",
          add: "/sensor_pointer_manager/tbSensorPointer/add",
          edit: "/sensor_pointer_manager/tbSensorPointer/edit",
          batchAdd: "/sensor_pointer_manager/tbSensorPointer/batchAdd",
        },
        dictOptions:{
         tfAreaFkId:[],
         tfCollecterPointerFkId:[],
         tfSensorDataTypeCode:[],
         tfSensorProductTypeCode:[],
         tfSensorDataTypeName:[],
         tfLineCode:[],
        },
        isImmediatelyGetList: false,
        handleSensorPointerProfileLoading: false,
        dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
          tfAreaFkId: '',
          tfCollecterPointerFkId: '', // 采集器编号
          tfSensorDataTypeCode: '', // 采集参数
        },
        ModalVisible: false,
        oldDataSource: '',
        tableColAddDisabled: false, //是否在新增状态
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      editColsName() {
        let res = []
        this.columns.forEach(columnsItem => {
          if (columnsItem.editData) {
            res.push({
              dataIndex: columnsItem.dataIndex,
              filterMultiDictData: columnsItem.filterMultiDictData,
            })
          }
        })
        return res
      },
    },
    watch: {
      queryParam: {
        deep: true,
        handler() {
          this.handleSearchQuery()
        }
      },
    },
    created() {
      //初始化字典配置 在自己页面定义
      // this.initDictConfig();
    },
    methods: {
      handleSearchQuery() {
        if (this.queryParam.tfAreaFkId && this.queryParam.tfSensorDataTypeCode && this.queryParam.tfCollecterPointerFkId) {
          this.searchQuery()
        } else {
          this.dataSource = []
        }
      },
      // 批量新增同一传感器不同通道
      batchAdd(){
        if (this.selectionRows.length > 1) {
          this.$message.warning('请选择一条数据批量添加');
          return
        }
        const target = this.selectionRows[0]
        httpAction(this.url.batchAdd,target,'put').then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.loadData();
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      // 新增下拉选择项新增（厂家型号下拉新增）
      handleAddSelectItem() {
        const record = {
          tfDataTypeCode: this.queryParam.tfSensorDataTypeCode,
          isLoadDataTypeChangeHandle: true, //触发新增厂家型号modal参数code关联选择
        }
        this.$refs.tdicSensorTypeModalForm.edit(record)
        this.$refs.tdicSensorTypeModalForm.title = "新增"
        this.$refs.tdicSensorTypeModalForm.disableSubmit = false
      },
      // 新增完成后刷新下拉列表
      tdicSensorTypeModalFormOk() {
        this.$refs.sensorPointerEditableCell[0].handleAddSelectItemComplete()
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
            this.dictCodes.tfCollecterPointerFkId = `tb_collecter_pointer,tf_collecter_product_code,id,tf_area_fk_id='${data.value}'`
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
      // 重置搜索内容
      searchReset() {
        delete this.queryParam.tfCollecterChannelCode
        delete this.queryParam.tfSensorProductCode
        delete this.queryParam.tfSensorProductTypeCode
        this.loadData(1);
      },
      // 控制计算参数小数点后十位
      limitDecimals (value) {
        const reg = /^(\-)*(\d+)\.(\d{1,10}).*$/;
        let res = ''
        if(typeof value === 'string') {
          res = !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
          return this.toNonExponential(res)
        } else if (typeof value === 'number') {
          res = !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
          return this.toNonExponential(res)
        } else {
          return ''
        }
      },
      // 避免科学计数法显示 1e-10
      toNonExponential(num) {
        if (num == 0 || !num) return num
        if(typeof num === 'string') {
          num = parseFloat(num)
        }
        var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
        return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
      },
      filterMultiDictDataCustomRenderFunc(text, dictOptionIndex) {
        if(!text){
          return ''
        }else if(dictOptionIndex.indexOf('tfP') > -1 && dictOptionIndex != 'tfPosition'){
          return toNonExponential(text)
        }else{
          return filterMultiDictText(this.dictOptions[dictOptionIndex], text+"")
        }
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
        // 所有的项目列表-根据角色过滤
        // initDictOptions(`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`).then((res) => {
        //   if (res.success) {
        //     // 过滤重复项目
        //     this.$set(this.dictOptions, 'tfProjectFkId', deteleObject(res.result))
        //   }
        // })
        // initDictOptions('view_area,tf_code,id').then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfAreaFkId', res.result)
        //   }
        // })
        initDictOptions('tb_collecter_pointer,tf_collecter_product_code,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfCollecterPointerFkId', res.result)
          }
        })
        // initDictOptions('st_all_sensor_data_type,tf_data_type_name,tf_data_type_code').then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfSensorDataTypeCode', res.result)
        //   }
        // })
        initDictOptions('tdic_sensor_type,tf_product_type_name,tf_product_type_code').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfSensorProductTypeCode', res.result)
          }
        })
        // initDictOptions('st_all_sensor_data_type,tf_data_type_name,tf_data_type_code').then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfSensorDataTypeName', res.result)
        //   }
        // })
        initDictOptions('dic_sensor_type').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfLineCode', res.result)
          }
        })
      },

      // 触发下发策略接口
      handleSensorPointerProfile() {
        this.handleSensorPointerProfileLoading = true
        getSensorPointerProfile()
          .then(res => {
            if(res.success){
              this.$message.success(res.message)
            }else{
              this.$message.warning(res.message)
            }
          })
          .finally(() => {
            this.ModalVisible = false;
            this.handleSensorPointerProfileLoading = false
          })
      },
      showModal() {
        this.ModalVisible = true;
      },
      modalHandleOk(e) {
        this.ModalText = 'The modal will be closed after two seconds';
        this.confirmLoading = true;
        setTimeout(() => {
          this.ModalVisible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      modalHandleCancel(e) {
        console.log('Clicked cancel button');
        this.ModalVisible = false;
      },
      // 新增table行数据按钮
      // handleAdd() {
      //   // if(this.tableColAddDisabled) return
      //   this.tableColAddDisabled = true
      //   const newData = {
      //       "id":new Date().getTime(),
      //       "tfAreaFkId":this.queryParam.tfAreaFkId,
      //       "tfCollecterPointerFkId":this.queryParam.tfCollecterPointerFkId,
      //       "tfSensorDataTypeCode":this.queryParam.tfSensorDataTypeCode,
      //       "tfSensorDataTypeName":null,
      //       "tfSensorProductTypeCode":"",
      //       "tfSensorProductCode":null,
      //       "tfCollecterChannelCode":null,
      //       "tfLineCode":"",
      //       "tfPosition":null,
      //       "tfP1":null,
      //       "tfP2":null,
      //       "tfP3":null,
      //       "tfP4":null,
      //       "tfP5":null,
      //       "tfP6":null,
      //       // "tfAlertType":null,
      //       "tfUpAlert":null,
      //       "tfDownAlert":null,
      //       "tfSlopeAlert":null,
      //       "tfTotalAlert":null,
      //       "tfTotalAlertInitVal":null,
      //       "addable":true,
      //   }
      //   this.dataSource = [newData, ...this.dataSource]
      // },
      // 新增数据保存
      handleTableColAdd(record) {
        console.log('save')
        // 编辑校验
        // if (!record.tfSensorProductTypeCode) {
        //   this.$message.warning('请输入厂家型号！');
        //   return
        // } else 
        if (!record.tfCollecterChannelCode) {
          this.$message.warning('请输入通道号！');
          return
        } 
        // else if (!record.tfSensorProductCode) {
        //   this.$message.warning('请输入传感器编号！');
        //   return
        // } 
        // else if (!record.tfAlertType) {
        //   record.tfAlertType = ''
        //   this.$message.warning('请输入报警类型');
        //   return
        // }
         else if (!record.tfLineCode) {
          this.$message.warning('请输入传感器类型！');
          return
        }

        for (var i in record) {
          if (!record[i]) delete record[i]
          if (i.indexOf('tfP') > -1 && i != 'tfPosition') record[i] = this.toNonExponential(record[i])
        }
        delete record.addable;
        delete record.id;

        var that = this;
        // record.tfAlertType = null        
        httpAction(that.url.add,record,'post').then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            this.tableColAddDisabled = false
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      // 新增取消
      handleTableColAddCancel() {
        this.tableColAddDisabled = false
        this.dataSource.shift()
      },
      // 行数据详情
      handleDetail(record) {
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.title = "详情";
        this.$refs.modalForm.disableSubmit = false;
      },
      // 行数据编辑
      handleTableColEdit(record) {
        this.oldDataSource = JSON.parse(JSON.stringify(this.dataSource))
        console.log(this.oldDataSource)
        //编辑行
        const newDataSource = [...this.dataSource];
        const target = newDataSource.filter(item => record.id === item.id)[0];
        if (target) {

          target.editable = true;
          this.dataSource = newDataSource;
        }
      },
      // 行数据编辑保存
      handleTableColSave(record) {
        console.log('save')
        // 编辑校验
        // if (!record.tfSensorProductTypeCode) {
        //   this.$message.warning('请输入厂家型号！');
        //   return
        // } else 
        if (!record.tfCollecterChannelCode) {
          this.$message.warning('请输入通道号！');
          return
        } 
        // else if (!record.tfSensorProductCode) {
        //   this.$message.warning('请输入传感器编号！');
        //   return
        // } 
        // else if (!record.tfAlertType) {
        //   this.$message.warning('请输入报警类型');
        //   return
        // }
        else if (!record.tfLineCode) {
          this.$message.warning('请输入传感器类型！');
          return
        }
        const newDataSource = [...this.dataSource];
        const target = newDataSource.filter(item => record.id === item.id)[0];
        if (target) {
          delete target.editable;
          for (var i in target) {
            if (i.indexOf('tfP') > -1 && i != 'tfPosition') target[i] = this.toNonExponential(target[i])
          }
          this.dataSource = newDataSource;
        }
        var that = this;
        httpAction(that.url.edit,target,'put').then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      // 行数据编辑取消时，恢复原来数据
      handleTableColCancel(record) {
        this.dataSource = this.oldDataSource
        console.log(record)
      },
      // 行数据变化时保存数据到dataScource实现手动数据双向绑定
      handleTableColChange(val) {
        this.dataSource = val
      }
    }
  }
</script>
<style lang="scss">
@import '~@assets/less/common.less';

.ant-alert.ant-alert-info.mgb4 {
  margin-bottom: 4px;
}
.ant-alert.ant-alert-info.mgb16 {
  margin-bottom: 16px;
}
</style>