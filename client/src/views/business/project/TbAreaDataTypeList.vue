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
        <a-form layout="inline" @keyup.enter.native="handleSearchQuery">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="参数">
                <j-dict-select-tag placeholder="请选择参数" v-model="queryParam.tfDataTypeCode" dictCode="tdic_sensor_data_type,tf_name,tf_code"/>
              </a-form-item>
            </a-col>
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
        <a-button type="primary" icon="download" @click="handleExportXls('地块参数')">导出</a-button>
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
          @change="handleTableChange">
          
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

      <tbAreaDataType-modal :queryParam="queryParam" ref="modalForm" @ok="modalFormOk"></tbAreaDataType-modal>
    </a-card>
  </div>
  
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbAreaDataTypeModal from './modules/TbAreaDataTypeModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'
  export default {
    name: "TbAreaDataTypeList",
    mixins:[JeecgListMixin],
    components: {
      JDictSelectTag,
      TbAreaDataTypeModal,
      TbProjectBreadcrumb,
    },
    data () {
      return {
        description: '地块参数管理页面',
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
          //   title:'地块',
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
          {
            title:'参数',
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
            title:'安装数量',
            align:"center",
            dataIndex: 'tfMaxNum'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/area_data_type_manager/tbAreaDataType/list",
          delete: "/area_data_type_manager/tbAreaDataType/delete",
          deleteBatch: "/area_data_type_manager/tbAreaDataType/deleteBatch",
          exportXlsUrl: "/area_data_type_manager/tbAreaDataType/exportXls",
          importExcelUrl: "area_data_type_manager/tbAreaDataType/importExcel",
        },
        dictOptions:{
         tfAreaFkId:[],
         tfDataTypeCode:[],
        },
        dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
          tfAreaFkId: '',
        },
        isImmediatelyGetList: false,
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    watch: {
      'queryParam.tfAreaFkId': {
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.handleSearchQuery()
          } else {
            console.log('请选择必选参数')
          }
        }
      }
    },
    methods: {
      searchReset() {
        delete this.queryParam.tfDataTypeCode
        this.loadData(1);
      },
      handleSearchQuery() {
        if (this.queryParam.tfAreaFkId && this.queryParam.tfProjectFkId) this.searchQuery()
      },
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
        }
      },
      initDictConfig(){
        initDictOptions('tb_area,tf_code,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfAreaFkId', res.result)
          }
        })
        initDictOptions('tdic_sensor_data_type,tf_name,tf_code').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfDataTypeCode', res.result)
          }
        })
      }
       
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>