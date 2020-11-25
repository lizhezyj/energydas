<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('传感器参数类型')">导出</a-button>
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

    <tdicSensorType-modal ref="modalForm" @ok="modalFormOk"></tdicSensorType-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TdicSensorTypeModal from './modules/TdicSensorTypeModal'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "TdicSensorTypeList",
    mixins:[JeecgListMixin],
    components: {
      TdicSensorTypeModal
    },
    data () {
      return {
        description: '传感器参数类型管理页面',
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
            title:'参数类型编号',
            align:"center",
            dataIndex: 'tfDataTypeCode',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfDataTypeCode'], text+"")
              }
            }
          },
          {
            title:'参数类型名称',
            align:"center",
            dataIndex: 'tfDataTypeName',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfDataTypeName'], text+"")
              }
            }
          },
          {
            title:'设备型号名称',
            align:"center",
            dataIndex: 'tfProductTypeName'
          },
          {
            title:'数据公式',
            align:"center",
            dataIndex: 'tfFormula'
          },
          {
            title:'计算参数1名称',
            align:"center",
            dataIndex: 'tfP1Name'
          },
          {
            title:'计算参数2名称',
            align:"center",
            dataIndex: 'tfP2Name'
          },
          {
            title:'计算参数3名称',
            align:"center",
            dataIndex: 'tfP3Name'
          },
          {
            title:'计算参数4名称',
            align:"center",
            dataIndex: 'tfP4Name'
          },
          {
            title:'计算参数5名称',
            align:"center",
            dataIndex: 'tfP5Name'
          },
          {
            title:'计算参数6名称',
            align:"center",
            dataIndex: 'tfP6Name'
          },
          {
            title:'设备型号编码',
            align:"center",
            dataIndex: 'tfProductTypeCode'
          },
          {
            title:'系数1',
            align:"center",
            dataIndex: 'tfP1'
          },
          {
            title:'系数2',
            align:"center",
            dataIndex: 'tfP2'
          },
          {
            title:'系数3',
            align:"center",
            dataIndex: 'tfP3'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/tdic_sensor_type/tdicSensorType/list",
          delete: "/tdic_sensor_type/tdicSensorType/delete",
          deleteBatch: "/tdic_sensor_type/tdicSensorType/deleteBatch",
          exportXlsUrl: "/tdic_sensor_type/tdicSensorType/exportXls",
          importExcelUrl: "tdic_sensor_type/tdicSensorType/importExcel",
        },
        dictOptions:{
         tfDataTypeCode:[],
         tfDataTypeName:[],
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
        initDictOptions('tdic_sensor_data_type,tf_code,tf_code').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfDataTypeCode', res.result)
          }
        })
        initDictOptions('tdic_sensor_data_type,tf_name,tf_name').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfDataTypeName', res.result)
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>