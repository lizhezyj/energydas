<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- <a-col :md="12" :sm="16">
            <a-form-item label="采集时间">
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
            </a-form-item>
          </a-col> -->
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
            <a-form-item label="采集器编号">
              <a-input placeholder="请输入采集器编号" v-model="queryParam.tfCollecterProductCode"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="通道号">
                <a-input placeholder="请输入通道号" v-model="queryParam.tfLineNumber"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="采集器接线分类">
                <j-dict-select-tag
                  placeholder="请输入采集器接线分类"
                  v-model="queryParam.tfLineCode"
                  dictCode="dic_sensor_type"
                />
              </a-form-item>
            </a-col>
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

      <a-button type="primary" icon="download" @click="handleExportXls('tb_push_sensor_data')">导出</a-button>

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



      </a-table>
    </div>

    <!-- <tbPushSensorData-modal ref="modalForm" @ok="modalFormOk"></tbPushSensorData-modal> -->
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import TbPushSensorDataModal from './modules/TbPushSensorDataModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import moment from 'moment'
  import CRange from '@/views/business/modules/CRange.vue'
  import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: "TbPushSensorDataList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      CRange,
    },
    data () {
      return {
        description: 'tb_push_sensor_data管理页面',
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
            return Date.parse(a.create_time) - Date.parse(b.create_time)
          },
          },
          {
            title:'采集器编号',
            align:"center",
            dataIndex: 'tfCollecterProductCode'
          },
          {
            title:'传感器编号',
            align:"center",
            dataIndex: 'tfSensorProductCode'
          },
          {
            title:'采集器接线分类',
            align:"center",
            dataIndex: 'tfLineCode',
            customRender: text => {
              if (!text) {
                return ''
              } else {
                return filterMultiDictText(this.dictOptions['tfLineCode'], text + '')
              }
            }
          },
          {
            title:'通道号',
            align:"center",
            dataIndex: 'tfLineNumber',
            sorter: (a, b) => {
              return a - b
            },
          },
          // {
          //   title:'温度',
          //   align:"center",
          //   dataIndex: 'tfTemp'
          // },
          // {
          //   title:'电量',
          //   align:"center",
          //   dataIndex: 'tfElectric'
          // },
          // {
          //   title:'状态',
          //   align:"center",
          //   dataIndex: 'tfState'
          // },
          {
            title:'pv1',
            align:"center",
            dataIndex: 'pv1'
          },
          {
            title:'pv2',
            align:"center",
            dataIndex: 'pv2'
          },
          {
            title:'pv3',
            align:"center",
            dataIndex: 'pv3'
          },
          {
            title:'pv4',
            align:"center",
            dataIndex: 'pv4'
          },
          {
            title:'pv5',
            align:"center",
            dataIndex: 'pv5'
          }
        ],
        url: {
          list: "/sensor_push_data_manager/tbPushSensorData/list",
          delete: "/sensor_push_data_manager/tbPushSensorData/delete",
          deleteBatch: "/sensor_push_data_manager/tbPushSensorData/deleteBatch",
          exportXlsUrl: "/sensor_push_data_manager/tbPushSensorData/exportXls",
          importExcelUrl: "sensor_push_data_manager/tbPushSensorData/importExcel",
        },
        dictOptions:{
          tfLineCode: []
        },
        dateRanges: { 
          '近三天': [moment().subtract(2, 'days'), moment()],
          '近七天': [moment().subtract(6, 'days'), moment()], 
          '近一个月': [moment().subtract(30, 'days'), moment()], 
        },
        createTime_block: [],
      }
    },
    watch: {
      createTime_block() {
        if (this.createTime_block) {
          this.$set(this.queryParam, 'createTime_begin', this.createTime_block[0])
          this.$set(this.queryParam, 'createTime_end', this.createTime_block[1])
        }
      },
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
        initDictOptions('dic_sensor_type').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfLineCode', res.result)
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>