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
            <a-col :md="12" :sm="8">
              <a-form-item label="所属项目工程部位">
                <TbProjectCascader @getPjCascardVal="getPjVal" />              
              </a-form-item>
            </a-col>
          </a-row> -->
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="采集器编号">
                <j-dict-select-tag :showSearch="true" placeholder="请选择采集器设备编号" v-model="queryParam.tfCollecterProductCode" dictCode="tb_collecter,tf_code,tf_code,tf_state='working'"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="安装位置">
                <a-input placeholder="请输入安装位置" v-model="queryParam.tfPosition"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-input placeholder="请输入状态" v-model="queryParam.tfState"></a-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="所属工程部位">
                <a-input placeholder="请选择所属工程部位" v-model="queryParam.tfAreaFkId"></a-input>
              </a-form-item>
            </a-col> -->
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
        <a-button type="primary" icon="download" @click="handleExportXls('采集器编号')">导出</a-button>
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
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>

        </a-table>
      </div>

      <tbCollecterPointer-modal :queryParam="queryParam" :tfCollecterList="dataSourceList.tfCollecterList" ref="modalForm" @ok="modalFormOk"></tbCollecterPointer-modal>
    </a-card>
  </div>
  
</template>

<script>
  import { getAction, httpAction, deleteAction, downFile } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbCollecterPointerModal from './modules/TbCollecterPointerModal'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {deteleObject} from '@/utils/util'
  import TbProjectCascader from '@/views/business/modules/TbProjectCascader.vue'
  import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'

  export default {
    name: "TbCollecterPointerList",
    mixins:[JeecgListMixin],
    components: {
      TbCollecterPointerModal,
      TbProjectCascader,
      TbProjectBreadcrumb
    },
    data () {
      return {
        description: '采集器编号管理页面',
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
            title:'工程部位编号',
            align:"center",
            dataIndex: 'tfAreaFkId',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfAreaFkId'], text+"")
              }
            }
          },
          {
            title:'采集点编号',
            align:"center",
            dataIndex: 'tfCode',
            sorter: (a, b) => {
              return a - b
            },
          },
          {
            title:'安装位置',
            align:"center",
            dataIndex: 'tfPosition',
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
            customRender:(text)=>{
              if (!text) {
                return '无设备'
              } else {
                return text
              }
            }
          },
          {
            title:'采集频率',
            align:"center",
            dataIndex: 'tfRate',
            sorter: (a, b) => {
              return a - b
            },
          },
          // {
          //   title:'状态',
          //   align:"center",
          //   dataIndex: 'tfState',
          //   sorter: (a, b) => {
          //     return a - b
          //   },
          // },
          {
            title:' 说明',
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
          list: "/collecter_pointer_manager/tbCollecterPointer/list",
          delete: "/collecter_pointer_manager/tbCollecterPointer/delete",
          deleteBatch: "/collecter_pointer_manager/tbCollecterPointer/deleteBatch",
          exportXlsUrl: "/collecter_pointer_manager/tbCollecterPointer/exportXls",
          importExcelUrl: "collecter_pointer_manager/tbCollecterPointer/importExcel",
          collecterList: "/collecter_manager/tbCollecter/list", //采集器列表
          collecterEdit: "/collecter_manager/tbCollecter/edit", //修改采集器编号信息时，更新对应的采集设备状态（在用-->在库 、在库-->在用）
        },
        dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
          tfAreaFkId: '',
        },
        dictOptions:{
          tfProjectFkId:[],
          tfAreaFkId:[],
        },
        isImmediatelyGetList: false,
        dataSourceList: {
          tfCollecterList: []
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
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
    created () {
      this.getDataScouceList()
    },
    methods: {
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
      searchReset() {
        delete this.queryParam.tfCollecterProductCode
        delete this.queryParam.tfState
        delete this.queryParam.tfPosition
        this.loadData(1);
      },
      //根据对象数组属性值过滤出唯一对象
      filterArrObj(arr, filterParams, filterParamsVal) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][filterParams] == filterParamsVal) {
            return arr[i]
          }
        } 
      },
      getDataScouceList() {
        // 配置查询采集器参数
        var params = {
          pageNo: 1,
          pageSize: 10000,
        }
        getAction(this.url.collecterList, params).then((res) => {
          if (res.success) {
            this.dataSourceList.tfCollecterList = res.result.records;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
      },
      getPjVal (data) {
        console.log(data)
        this.$set(this.queryParam, 'tfProjectFkId', data[0])
        this.$set(this.queryParam, 'tfAreaFkId', data[1])
      },
      initDictConfig(){
        // 根据人员过滤项目
        // initDictOptions(`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`).then((res) => {
        //   if (res.success) {
        //     this.$set(this.dictOptions, 'tfProjectFkId', res.result)
        //   }
        // })
        // 工程部位id
        initDictOptions('tb_area,tf_code,id').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfAreaFkId', res.result)
          }
        })
      },
      handleDelete: function (record) {
        if(!this.url.delete){
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        // 将该采集器编号的采集设备状态设置为在库
        let oldCollecterData = this.filterArrObj(this.dataSourceList.tfCollecterList, 'tfCode', record.tfCollecterProductCode)
        oldCollecterData.tfState = 'waitstore' //替换下旧的采集设备待入库
        oldCollecterData.tfPrestate = 'working' //日志记录旧的状态
        oldCollecterData.tfDealMan = this.$store.getters.userInfo.username //记录操作人
        httpAction(this.url.collecterEdit,oldCollecterData,'put').then((res)=>{
          if(res.success){
            console.log('采集器--' + oldCollecterData.tfCode + '状态变更为 在库 ')
            // 设备状态变更成功后删除采集器编号数据
            deleteAction(that.url.delete, {id: record.id}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
              } else {
                that.$message.warning(res.message);
              }
            });

          }else{
            console.log('采集器--' + oldCollecterData.tfCode + '状态变更失败')
            that.$message.warning('采集器--' + oldCollecterData.tfCode + '状态变更失败');
          }
        })

        
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>