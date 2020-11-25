<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="项目编号">
              <a-input placeholder="请输入项目编号" v-model="queryParam.tfProjectCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.tfProjectName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目状态">
              <j-dict-select-tag
                placeholder="请选择项目状态"
                v-model="queryParam.tfState"
                dictCode="tdic_pjstate,tf_name,tf_code"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="启动日期">
                <j-date placeholder="请选择启动日期" v-model="queryParam.tfStartdate"></j-date>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="完成日期">
                <j-date placeholder="请选择完成日期" v-model="queryParam.tfFinishdate"></j-date>
              </a-form-item>
            </a-col>-->
            
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="建设单位">
                <a-input placeholder="请输入建设单位" v-model="queryParam.tfCustomer"></a-input>
              </a-form-item>
            </a-col> -->
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="经度">
                <a-input placeholder="请输入经度" v-model="queryParam.tfLng"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="纬度">
                <a-input placeholder="请输入纬度" v-model="queryParam.tfLat"></a-input>
              </a-form-item>
            </a-col>-->
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="采集频率">
                <a-input placeholder="请输入采集频率" v-model="queryParam.tfDatatime"></a-input>
              </a-form-item>
            </a-col> -->
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 地图展示区域 -->
    <div style="margin-bottom: 10px;">
      <map-card
        :showPointCollection="true"
        :width="'100%'"
        :height="'300px'"
        :adress="address"
        @mapReady="mapReadyHandler"
        @getMarkerPoint="getPointAndLocation"
        :points="points"
        :center="mapCenter"
        @pointCollectionClickHandler='goToProject'
      ></map-card>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('项目')">导出</a-button>
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 10px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        :scroll="{ x: 'max-content' }"
      >
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt="图片不存在"
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(text)"
          >下载</a-button>
        </template>

        <template slot="toolTipSlot" slot-scope="text">
          <a-tooltip v-if="text && text.length > 15" placement="topLeft">
            <template slot="title">
              {{text}}
            </template>
            {{text}}
          </a-tooltip>
          <span v-else>{{text}}</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
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


    <tbProject-modal ref="modalForm" @ok="modalFormOk"></tbProject-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TbProjectModal from './modules/TbProjectModal'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import mapCard from '../modules/TbProjectMapCard.vue'

export default {
  name: 'TbProjectList',
  mixins: [JeecgListMixin],
  components: {
    JDictSelectTag,
    JDate,
    TbProjectModal,
    mapCard
  },
  data() {
    return {
      mapState: false, //mapReady状态
      address: '天津市西青区',
      description: '项目管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '项目编号',
          align: 'center',
          dataIndex: 'tfProjectCode'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'tfProjectName',
          scopedSlots: {
            customRender: 'toolTipSlot'
          }
        },
        {
          title: '开工日期',
          align: 'center',
          dataIndex: 'tfStartdate',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          }
        },
        {
          title: '竣工日期',
          align: 'center',
          dataIndex: 'tfFinishdate',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          }
        },
        {
          title: '项目状态',
          align: 'center',
          dataIndex: 'tfState',
          customRender: text => {
            if (!text) {
              return ''
            } else {
              return filterMultiDictText(this.dictOptions['tfState'], text + '')
            }
          }
        },
        {
          title: '工程地点',
          align: 'center',
          dataIndex: 'tfAddr'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          // fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/project_manager/tbProject/list',
        delete: '/project_manager/tbProject/delete',
        deleteBatch: '/project_manager/tbProject/deleteBatch',
        exportXlsUrl: '/project_manager/tbProject/exportXls',
        importExcelUrl: 'project_manager/tbProject/importExcel'
      },
      dictOptions: {
        tfState: []
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    points() {
      var res = []
      if (this.dataSource.length > 0 && this.mapState) {
        this.dataSource.forEach(dataItem => {
          res.push({
            lat: dataItem.tfLat,
            lng: dataItem.tfLng,
            id: dataItem.id,
            projectData: dataItem,
          })
        })
        return res
      }
    },
    mapCenter() {
      if (this.points) return this.points[0]
    }
  },
  methods: {
    initDictConfig() {
      initDictOptions('tdic_pjstate,tf_name,tf_code').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfState', res.result)
        }
      })
    },
    getPointAndLocation(data) {
      console.log(data)
    },
    // 监听map组件ready事件
    mapReadyHandler() {
      this.mapState = true
    },
    goToProject(val) {
      console.log(val)
      // alert(val.point.tfProjectName)
      // console.log('当前点击的项目：' + val.point.projectData.tfProjectName)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>