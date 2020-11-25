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
              <a-form-item label="用户">
                <a-input placeholder="请输入用户" v-model="queryParam.tfUserFkId"></a-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="项目名称">
                <j-dict-select-tag placeholder="请选择项目名称" v-model="queryParam.tfProjectFkId" :dictCode="`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`"/>
              </a-form-item>
            </a-col> -->
            <a-col :md="6" :sm="8">
              <a-form-item label="项目角色">
                <j-dict-select-tag placeholder="请选择项目角色" v-model="queryParam.tfSysRoleCode" dictCode="sys_role,role_name,role_code"/>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              
            </template>
            <a-col :md="6" :sm="8" >
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
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
        <a-button type="primary" icon="download" @click="handleExportXls('tbProjectPerson')">导出</a-button>
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
        <div class="ant-alert ant-alert-info">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>

        <div class="table-header-info">
          <p>{{tfHeaderInfo}}</p>
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
                {{filterMultiDictText(dictOptions['tfProjectFkId'], text+"")}}
              </template>
              {{filterMultiDictText(dictOptions['tfProjectFkId'], text+"")}}
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
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>

        </a-table>
      </div>

      <tbProjectPerson-modal ref="modalForm" @ok="modalFormOk"></tbProjectPerson-modal>
    </a-card>
  </div>
  
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TbProjectPersonModal from './modules/TbProjectPersonModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {initDictOptions, filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { deteleObject } from '@/utils/util'
  import TbProjectBreadcrumb from '@/views/business/modules/TbProjectBreadcrumb.vue'
  export default {
    name: "TbProjectPersonList",
    mixins:[JeecgListMixin],
    components: {
      JDictSelectTag,
      TbProjectPersonModal,
      TbProjectBreadcrumb,
    },
    data () {
      return {
        description: 'tbProjectPerson管理页面',
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
            title:'姓名',
            align:"center",
            dataIndex: 'tfUserFkId',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfSysUser'], text+"")
              }
            }
          },
          {
            title:'证书编号',
            align:"center",
            dataIndex: 'tfCertificateNo'
          },
          {
            title:'职称',
            align:"center",
            dataIndex: 'tfTitle'
          },
          {
            title:'工作内容',
            align:"center",
            dataIndex: 'tfWorkDesc'
          },
          {
            title:'人员角色',
            align:"center",
            dataIndex: 'tfSysRoleCode',
            customRender:(text)=>{
              if(!text){
                return ''
              }else{
                return filterMultiDictText(this.dictOptions['tfSysRoleCode'], text+"")
              }
            }
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'tfMemo'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/project_person_manager/tbProjectPerson/list",
          delete: "/project_person_manager/tbProjectPerson/delete",
          deleteBatch: "/project_person_manager/tbProjectPerson/deleteBatch",
          exportXlsUrl: "/project_person_manager/tbProjectPerson/exportXls",
          importExcelUrl: "project_person_manager/tbProjectPerson/importExcel",
        },
        dictOptions:{
         tfProjectFkId:[],
         tfSysRoleCode:[],
         tfHeaderInfo:[],
         tfSysUser: [],
        },
        tfHeaderInfo: '',
        dictCodes: {
          tfProjectFkId: `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`,
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
      'queryParam.tfProjectFkId': {
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.handleSearchQuery()
            initDictOptions(`st_num_project_person,tf_project_fk_id,v_txt,tf_project_fk_id='${newVal}'`).then((res) => {
              if (res.success) {
                this.tfHeaderInfo = res.result[0].value
              }
            })
          } else {
            console.log('请选择必选参数')
          }
        }
      }
    },
    methods: {
      searchReset() {
        delete this.queryParam.tfUserFkId
        delete this.queryParam.tfSysRoleCode
        this.loadData(1);
      },
      handleSearchQuery() {
        if (this.queryParam.tfProjectFkId) this.searchQuery()
      },
      selectDropMenuItemChange(data) {
        switch(data.dataIndex) {
          case 'tfProjectFkId':
            this.dictCodes.tfAreaFkId = `tb_area,tf_code,id,tf_project_fk_id='${data.value}'`
            this.$set(this.queryParam, 'tfProjectFkId', data.value)
            break
        }
      },
      filterMultiDictText,
      initDictConfig(){
        // initDictOptions('tb_project,tf_project_name,id').then((res) => {
        initDictOptions(
          `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`
        ).then(res => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfProjectFkId', deteleObject(res.result))
          }
        })
        initDictOptions('sys_role,role_name,role_code').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfSysRoleCode', res.result)
          }
        })
        initDictOptions('sys_user,realname,username').then((res) => {
          if (res.success) {
            this.$set(this.dictOptions, 'tfSysUser', res.result)
          }
        })
      }
       
    }
  }
</script>
<style lang="scss"  scoped>
  @import '~@assets/less/common.css';

  .table-header-info {
    text-align: right;
    p {
      margin: 2px 0;
      display: inline-block;
      color:rgba(0,0,0,.45);
      &::after {
        content: ';';
        padding-right: 2px;
      }
      span.comma-partition {
        &::after {
          content: ',';
        }
      }
      span:last-child {
        &::after {
          content: '';
        }
      }
    }
    p:last-child {
      &::after {
        content: '';
      }
    }
    span {
      color:rgba(0,0,0,.45);
    }
  }
</style>