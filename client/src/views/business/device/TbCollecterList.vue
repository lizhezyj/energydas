<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="项目">
              <j-dict-select-tag :showSearch="true" placeholder="请选择项目" v-model="queryParam.tfProjectFkId" dictCode="tb_project,tf_project_name,id"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.tfState" dictCode="dic_colleter_state"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称" v-model="queryParam.tfName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="编号">
                <a-input placeholder="请输入编号" v-model="queryParam.tfCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="型号">
                <a-input placeholder="请输入型号" v-model="queryParam.tfType"></a-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('采集器')">导出</a-button>
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="2" @click="batchAdd"><a-icon type="plus"/>新增</a-menu-item>
          <!-- <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item> -->
        </a-menu>
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
        <template slot="toolTipSlot" slot-scope="text">
          <a-tooltip v-if="text && text.length > 15" placement="topLeft">
            <template slot="title">
              {{filterMultiDictText(dictOptions['tbProject'], text+"")}}
            </template>
            {{filterMultiDictText(dictOptions['tbProject'], text+"")}}
          </a-tooltip>
          <span v-else>{{text}}</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <tbCollecter-modal ref="modalForm" @ok="modalFormOk" :tfStateSelectOptions="dictOptions.tfState"></tbCollecter-modal>
  </a-card>
</template>

<script>

  import { getAction, httpAction, deleteAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbCollecterModal from './modules/TbCollecterModal'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "TbCollecterList",
    mixins:[JeecgListMixin],
    components: {
      TbCollecterModal
    },
    data () {
      return {
        description: '采集器管理页面',
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
            title:'更新时间',
            align:"center",
            dataIndex: 'updateTime',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'名称',
            align:"center",
            dataIndex: 'tfName',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'编号',
            align:"center",
            dataIndex: 'tfCode',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'型号',
            align:"center",
            dataIndex: 'tfType',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'状态',
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
          {
            title:'项目',
            align:"center",
            dataIndex: 'tfProjectFkId',
            scopedSlots: {
              customRender: 'toolTipSlot'
            },
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'说明',
            align:"center",
            dataIndex: 'tfDesc'
          },
          {
            title:'经手人',
            align:"center",
            dataIndex: 'tfDealMan',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/collecter_manager/tbCollecter/list",
          delete: "/collecter_manager/tbCollecter/delete",
          deleteBatch: "/collecter_manager/tbCollecter/deleteBatch",
          exportXlsUrl: "/collecter_manager/tbCollecter/exportXls",
          importExcelUrl: "collecter_manager/tbCollecter/importExcel",
          batchAdd: "/collecter_manager/tbCollecter/batchAdd",
        },
        dictOptions:{
         tfState:[],
         tbProject: [],
        } 
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      // 删除采集器添加流水记录
      handleDelete: function (item) {
        if(!this.url.delete){
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        deleteAction(that.url.delete, {id: item.id, tfCode: item.tfCode}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      // 批量添加和删除
      batchAdd() {
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
      filterMultiDictText,
      initDictConfig(){
        initDictOptions('dic_colleter_state').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfState', res.result)
          }
        })
        initDictOptions('tb_project,tf_project_name,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tbProject', res.result)
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>