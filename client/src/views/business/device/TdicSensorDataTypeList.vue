<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="参数编号">
              <a-input placeholder="请输入参数编号" v-model="queryParam.tfCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="参数名称">
              <a-input placeholder="请输入参数名称" v-model="queryParam.tfName"></a-input>
            </a-form-item>
          </a-col>
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
      <a-button type="primary" icon="download" @click="handleExportXls('参数')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
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

    <tdicSensorDataType-modal ref="modalForm" @ok="modalFormOk"></tdicSensorDataType-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TdicSensorDataTypeModal from './modules/TdicSensorDataTypeModal'
  export default {
    name: "TdicSensorDataTypeList",
    mixins:[JeecgListMixin],
    components: {
      TdicSensorDataTypeModal
    },
    data () {
      return {
        description: '参数管理页面',
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
            title:'参数编号',
            align:"center",
            dataIndex: 'tfCode'
          },
          {
            title:'参数名称',
            align:"center",
            dataIndex: 'tfName'
          },
          {
            title:'展示数据单位',
            align:"center",
            dataIndex: 'tfViewUnit'
          },
          {
            title:'公式',
            align:"center",
            dataIndex: 'tfFormula'
          },
          {
            title:'ζ1单位',
            align:"center",
            dataIndex: 'tfP1Unit'
          },
          {
            title:'ζ2单位',
            align:"center",
            dataIndex: 'tfP2Unit'
          },
          {
            title:'ζ3单位',
            align:"center",
            dataIndex: 'tfP3Unit'
          },
          {
            title:'ζ4单位',
            align:"center",
            dataIndex: 'tfP4Unit'
          },
          {
            title:'ζ5单位',
            align:"center",
            dataIndex: 'tfP5Unit'
          },
          {
            title:'ζ6单位',
            align:"center",
            dataIndex: 'tfP6Unit'
          },
          {
            title:'斜率单位',
            align:"center",
            dataIndex: 'tfSlopeUnit'
          },
          {
            title:'采集数据单位',
            align:"center",
            dataIndex: 'tfTdUnit'
          },
          {
            title:'说明',
            align:"center",
            dataIndex: 'tfDesc'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/sensor_data_type_manager/tdicSensorDataType/list",
          delete: "/sensor_data_type_manager/tdicSensorDataType/delete",
          deleteBatch: "/sensor_data_type_manager/tdicSensorDataType/deleteBatch",
          exportXlsUrl: "/sensor_data_type_manager/tdicSensorDataType/exportXls",
          importExcelUrl: "sensor_data_type_manager/tdicSensorDataType/importExcel",
        },
        dictOptions:{
        } 
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>