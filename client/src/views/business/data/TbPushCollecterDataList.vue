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
            <a-col :md="8" :sm="8">
              <a-form-item label="采集时间">
                <c-range 
                  dateFormat="YYYY-MM-DD"
                  v-model="createTime_block" 
                  :ranges="dateRanges"
                />
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :md="12" :sm="16">
                <a-form-item label="温度">
                  <a-input placeholder="请输入最小值" class="query-group-cust" v-model="queryParam.tfTemp_begin"></a-input>
                  <span class="query-group-split-cust"></span>
                  <a-input placeholder="请输入最大值" class="query-group-cust" v-model="queryParam.tfTemp_end"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="16">
                <a-form-item label="电量">
                  <a-input placeholder="请输入最小值" class="query-group-cust" v-model="queryParam.tfElectric_begin"></a-input>
                  <span class="query-group-split-cust"></span>
                  <a-input placeholder="请输入最大值" class="query-group-cust" v-model="queryParam.tfElectric_end"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="状态">
                  <a-input placeholder="请输入状态" v-model="queryParam.tfState"></a-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="6" :sm="8">
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
        <a-button type="primary" icon="download" @click="handleExportXls('tb_push_collecter_data')">导出</a-button>
        <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
        </a-dropdown>
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
          :scroll="{ x: true }">
          
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
          <template slot="toolTipSlot" slot-scope="text">
            <a-tooltip v-if="text && text.length > 15" placement="topLeft">
              <template slot="title">
                {{filterMultiDictText(dictOptions['tfProjectFkId'], text+"")}}
              </template>
              {{filterMultiDictText(dictOptions['tfProjectFkId'], text+"")}}
            </a-tooltip>
            <span v-else>{{text}}</span>
          </template>

          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">详情</a>

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

      <tbPushCollecterData-modal ref="modalForm" :columnsData="columnsData" @ok="modalFormOk"></tbPushCollecterData-modal>
    </a-card>
  </div>
  
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbPushCollecterDataModal from './modules/TbPushCollecterDataModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import JDate from '@/components/jeecg/JDate.vue'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'
  import moment from 'moment'
  import CRange from '@/views/business/modules/CRange.vue'
  export default {
    name: "TbPushCollecterDataList",
    mixins:[JeecgListMixin],
    components: {
      JDictSelectTag,
      JDate,
      TbPushCollecterDataModal,
      TbProjectBreadcrumb,
      CRange,
    },
    data () {
      return {
        description: 'tb_push_collecter_data管理页面',
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
          {
            title:'采集时间',
            align:"center",
            dataIndex: 'createTime',
            sorter: (a, b) => {
              return Date.parse(a.createTime) - Date.parse(b.createTime)
            },
          },
          {
            title:'项目',
            align:"center",
            dataIndex: 'tfProjectFkId',
            scopedSlots: {
              customRender: 'toolTipSlot'
            }
          },
          {
            title:'采集器编号',
            align:"center",
            dataIndex: 'tfCollecterProductCode',
            scopedSlots: {
              customRender: 'tfCollecterProductCode'
            },
          },
          {
            title:'状态',
            align:"center",
            dataIndex: 'tfState'
          },
          {
            title:'电量',
            align:"center",
            dataIndex: 'tfElectricity'
          },
          {
            title:'温度',
            align:"center",
            dataIndex: 'tfTemp'
          },
          {
            title:'sim卡',
            align:"center",
            dataIndex: 'tfSim'
          },
          {
            title:'流水号',
            align:"center",
            dataIndex: 'tfNo'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        columnsData: {
          tfProjectFkId: '',
          tfAreaFkId: '',
          tfCollecterPointerFkId: '',
          tfCollecterProductCode: '',
        },
        url: {
          list: "/push_data_manager/tbPushCollecterData/list",
          delete: "/push_data_manager/tbPushCollecterData/delete",
          deleteBatch: "/push_data_manager/tbPushCollecterData/deleteBatch",
          exportXlsUrl: "/push_data_manager/tbPushCollecterData/exportXls",
          importExcelUrl: "push_data_manager/tbPushCollecterData/importExcel",
        },
        dictOptions:{
         tfProjectFkId:[],
         tfAreaFkId:[],
         tfCollecterPointerFkId:[],
         tfCollecterProductCode:[],
        },
        dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
          tfAreaFkId: '',
          tfCollecterProductCode: '', // 采集器
        },
        isImmediatelyGetList: false,
        dateRanges: { 
          '近三天': [moment().subtract(2, 'days'), moment()],
          '近七天': [moment().subtract(6, 'days'), moment()], 
          '近一个月': [moment().subtract(30, 'days'), moment()], 
        },
        createTime_block: [],
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    watch: {
      'queryParam.tfCollecterProductCode': {
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
    },
    methods: {
      filterMultiDictText,
      // 面包屑下拉选择
      selectDropMenuItemChange(data) {
        console.log(data)
        switch(data.dataIndex) {
          case 'tfProjectFkId':
            this.dictCodes.tfAreaFkId = `tb_area,tf_code,id,tf_project_fk_id='${data.value}'`
            this.$set(this.queryParam, 'tfProjectFkId', data.value)
            this.$set(this.columnsData, 'tfProjectFkId', data.text)
            break
          case 'tfAreaFkId':
            this.dictCodes.tfCollecterProductCode = `view_dic_collecter_by_area,tf_collecter_product_code,tf_collecter_product_code,tf_area_fk_id='${data.value}'`
            // this.dictCodes.tfCollecterProductCode = `view_dic_collecter_by_area,tf_collecter_product_code,id`
            this.$set(this.columnsData, 'tfAreaFkId', data.text)
            break
          case 'tfCollecterProductCode':
            this.$set(this.queryParam, 'tfCollecterProductCode', data.text)
            break
        }
      },
      // 重置搜索内容
      searchReset() {
        this.createTime_block = []
        delete this.queryParam.createTime_begin
        delete this.queryParam.createTime_end
        delete this.queryParam.tfState
        delete this.queryParam.tfElectricity
        delete this.queryParam.tfTemp
        this.loadData(1);
      },
      initDictConfig(){
        initDictOptions('tb_project,tf_project_name,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfProjectFkId', res.result)
          }
        })
        // initDictOptions('tb_area,tf_name,id').then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfAreaFkId', res.result)
        //   }
        // })
        // initDictOptions('tb_collecter_pointer,tf_code,id').then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfCollecterPointerFkId', res.result)
        //   }
        // })
        // initDictOptions('tb_collecter,tf_code,tf_code').then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfCollecterProductCode', res.result)
        //   }
        // })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>