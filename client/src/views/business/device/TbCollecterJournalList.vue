<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="相关项目">
              <j-dict-select-tag :showSearch="true" placeholder="请选择项目" v-model="queryParam.tfProjectFkId" :dictCode="`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="采集器设备编号">
              <j-dict-select-tag :showSearch="true" v-model="queryParam.tfCollecterProductCode" dictCode="tb_collecter,tf_name,tf_code" placeholder="请选择采集器设备编号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="16">
            <a-form-item label="创建日期">
              <!-- <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" class="query-group-cust" v-model="queryParam.createTime_end"></j-date> -->
              <c-range dateFormat="YYYY-MM-DD" v-model="createTime_block" :ranges="dateRanges"></c-range>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="变更前状态">
                <j-dict-select-tag placeholder="请选择变更前状态" v-model="queryParam.tfPrestate" dictCode="dic_colleter_state"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="变更后状态">
                <j-dict-select-tag placeholder="请选择变更后状态" v-model="queryParam.tfState" dictCode="dic_colleter_state"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="创建人">
                <a-input placeholder="请输入创建人" v-model="queryParam.createBy"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('采集器流水')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <!-- <a-button type="primary" icon="import">导入</a-button> -->
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <!-- <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu> -->
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 10px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

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

    <!-- <tbCollecterJournal-modal ref="modalForm" @ok="modalFormOk"></tbCollecterJournal-modal> -->
  </a-card>
</template>

<script>

  /**
   * 采集器日志来源，通过修改采集器状态信息接口，有以下几个地方
   * 1.采集器列表编辑状态
   * 2.采集器编号更换采集设备
   * 3.新增采集器编号
   * 4.删除采集器编号
   */

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import TbCollecterJournalModal from './modules/TbCollecterJournalModal'
  import JDate from '@/components/jeecg/JDate.vue'
  import CRange from '@/views/business/modules/CRange.vue'
  import moment from 'moment'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { deteleObject } from '@/utils/util'

  export default {
    name: "TbCollecterJournalList",
    mixins:[JeecgListMixin],
    components: {
      JDate,
      CRange,
    },
    data () {
      return {
        description: '采集器流水管理页面',
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
            title:'创建人',
            align:"center",
            dataIndex: 'createBy',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'日期',
            align:"center",
            dataIndex: 'createTime',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'采集器编号',
            align:"center",
            dataIndex: 'tfCollecterProductCode',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'变更前状态',
            align:"center",
            dataIndex: 'tfPrestate',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfState'], text+"")
              }
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'变更后状态',
            align:"center",
            dataIndex: 'tfState',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfState'], text+"")
              }
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          // {
          //   title:'相关项目',
          //   align:"center",
          //   dataIndex: 'tfProjectFkId',
          //   customRender:(text)=>{
          //     if(!text){
          //       return ''
          //     }else{
          //       return filterMultiDictText(this.dictOptions['tbProject'], text+"")
          //     }
          //   }
          // },
          {
            title:'经手人',
            align:"center",
            dataIndex: 'tfDealMan',
            sorter: (a, b) => {
              return a - b
            },
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align:"center",
          //   scopedSlots: { customRender: 'action' },
          // }
        ],
        url: {
          list: "/collecter_journal_view/tbCollecterJournal/list",
          delete: "/collecter_journal_view/tbCollecterJournal/delete",
          deleteBatch: "/collecter_journal_view/tbCollecterJournal/deleteBatch",
          exportXlsUrl: "/collecter_journal_view/tbCollecterJournal/exportXls",
          importExcelUrl: "collecter_journal_view/tbCollecterJournal/importExcel",
        },
        dictOptions:{
          tfState: [],
          tbProject: [],
        },
        createTime_block: [],
        dateRanges: { 
          '近三天': [moment().subtract(2, 'days'), moment()],
          '近七天': [moment().subtract(6, 'days'), moment()], 
          '近一个月': [moment().subtract(30, 'days'), moment()], 
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    watch: {
      'queryParam.createTime_end': {
        handler(val) {
          if (!val) this.createTime_block = [] //重置queryParams时，清空时间选择框绑定的值
        }
      },
      createTime_block() {
        if (this.createTime_block) {
          this.$set(this.queryParam, 'createTime_begin', this.createTime_block[0])
          this.$set(this.queryParam, 'createTime_end', this.createTime_block[1])
        }
      },
    },
    methods: {
      initDictConfig(){
        initDictOptions('dic_colleter_state').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfState', res.result)
          }
        })
        initDictOptions(
          `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`
        ).then(res => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfProjectFkId', deteleObject(res.result))
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>