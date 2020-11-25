<template>
  <div>
    <a-tabs defaultActiveKey="1" style="margin: 0; background-color: #fff;">
      <a-tab-pane tab="表格数据" key="1">
        <a-card :bordered="false">
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
              <a-row :gutter="24">
                <!-- <a-col :md="6" :sm="8">
                <a-form-item label="项目">
                  <j-dict-select-tag placeholder="请选择项目" v-model="queryParam.tfProjectFkId" dictCode="tb_project,tf_project_name,id"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="区块">
                  <j-dict-select-tag placeholder="请选择区块" v-model="queryParam.tfAreaFkId" dictCode="tb_area,tf_code,id"/>
                </a-form-item>
                </a-col>-->
                <a-col :md="6" :sm="8">
                  <a-form-item label="所属项目区块">
                    <TbProjectCascader @getPjCascardVal="getPjVal" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="参数类型">
                    <j-dict-select-tag
                      placeholder="请选择参数类型"
                      v-model="queryParam.tfSenserDataTypeCode"
                      dictCode="tdic_sensor_data_type,tf_name,tf_code"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="起始日期">
                    <c-range v-model="createTime_block"></c-range>
                  </a-form-item>
                </a-col>

                <template v-if="toggleSearchStatus">
                  <!-- <a-col :md="6" :sm="8">
                  <a-form-item label="采集点id">
                    <j-dict-select-tag placeholder="请选择采集点id" v-model="queryParam.tfCollecterPointerFkId" dictCode="tb_collecter_pointer,tf_collecter_product_code,id"/>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="采集器硬件编号">
                    <j-dict-select-tag placeholder="请选择采集器硬件编号" v-model="queryParam.tfCollecterProductCode" dictCode="tb_collecter_pointer,tf_collecter_product_code,tf_collecter_product_code"/>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="查验状态">
                    <a-input placeholder="请输入查验状态" v-model="queryParam.tfChecked"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="补数">
                    <a-input placeholder="请输入补数" v-model="queryParam.tfIsVirtualData"></a-input>
                  </a-form-item>
                  </a-col>-->
                </template>
                <a-col :md="6" :sm="8">
                  <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                    <!-- <a-button
                      type="primary"
                      @click="searchReset"
                      icon="reload"
                      style="margin-left: 8px"
                    >重置</a-button> -->
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

          <!-- 操作按钮区域 -->
          <div class="table-operator">
            <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
            <a-button type="primary" icon="download" @click="handleExportXls(echartsTitle)">导出</a-button>
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
            <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="batchDel">
                  <a-icon type="delete" />删除
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                批量操作
                <a-icon type="down" />
              </a-button>
            </a-dropdown> -->
          </div>

          <!-- table区域-begin -->
          <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
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
              :scroll="{ x: true }"
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

          <viewDataChecked-modal ref="modalForm" @ok="modalFormOk"></viewDataChecked-modal>
        </a-card>
      </a-tab-pane>
      <a-tab-pane tab="图表数据" key="2" forceRender>
        <a-card :bordered="false">
          <viewDataChecked-charts :title="echartsTitle" :data="dataSource" />
        </a-card>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>

<script>
import { deleteAction, getAction, downFile } from '@/api/manage'

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ViewDataCheckedModal from './modules/ViewDataCheckedModal'
import ViewDataCheckedCharts from './modules/ViewDataCheckedCharts.vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import CRange from '@/views/business/modules/CRange.vue'
import TbProjectCascader from '@/views/business/modules/TbProjectCascader.vue'
import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { deteleObject } from '@/utils/util'
import { getDataColumns } from './dataColumns'
import moment from 'moment'

export default {
  name: 'ViewDataCheckedList',
  mixins: [JeecgListMixin],
  components: {
    JDictSelectTag,
    JDate,
    CRange,
    ViewDataCheckedModal,
    ViewDataCheckedCharts,
    TbProjectCascader
  },
  data() {
    return {
      description: '查验采集数据管理页面',
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
          title: '项目',
          align: 'center',
          dataIndex: 'tfProjectFkId',
          customRender: text => {
            if (!text) {
              return ''
            } else {
              return filterMultiDictText(this.dictOptions['tfProjectFkId'], text + '')
            }
          }
        },
        {
          title: '区块',
          align: 'center',
          dataIndex: 'tfAreaFkId',
          customRender: text => {
            if (!text) {
              return ''
            } else {
              return filterMultiDictText(this.dictOptions['tfAreaFkId'], text + '')
            }
          }
        },
        {
          title: '参数类型',
          align: 'center',
          dataIndex: 'tfSenserDataTypeCode',
          customRender: text => {
            if (!text) {
              return ''
            } else {
              return filterMultiDictText(this.dictOptions['tfSenserDataTypeCode'], text + '')
            }
          }
        },
        {
          title: '日期',
          align: 'center',
          dataIndex: 'createTime',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
          sorter: (a, b) => a - b
        },
        {
          title: '采集点id',
          align: 'center',
          dataIndex: 'tfCollecterPointerFkId',
          customRender: text => {
            if (!text) {
              return ''
            } else {
              return filterMultiDictText(this.dictOptions['tfCollecterPointerFkId'], text + '')
            }
          }
        },
        {
          title: '采集器硬件编号',
          align: 'center',
          dataIndex: 'tfCollecterProductCode',
          customRender: text => {
            if (!text) {
              return ''
            } else {
              return filterMultiDictText(this.dictOptions['tfCollecterProductCode'], text + '')
            }
          }
        },
        {
          title: '查验状态',
          align: 'center',
          dataIndex: 'tfChecked'
        },
        {
          title: '补数',
          align: 'center',
          dataIndex: 'tfIsVirtualData'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        // list: '/view_data_checked/viewDataChecked/list',
        list: '/tb_data_checked/tbDataChecked/getList',
        delete: '/view_data_checked/viewDataChecked/delete',
        deleteBatch: '/view_data_checked/viewDataChecked/deleteBatch',
        exportXlsUrl: '/view_data_checked/viewDataChecked/exportXls',
        importExcelUrl: 'view_data_checked/viewDataChecked/importExcel'
      },
      dictOptions: {
        tfProjectFkId: [],
        tfAreaFkId: [],
        tfSenserDataTypeCode: [],
        tfCollecterPointerFkId: [],
        tfCollecterProductCode: []
      },
      /* 分页参数 */
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      // 级联选择 start
      isRequiedSearchQueryParamsNum: 2, //必填查询参数梳理哪个
      createTime_block: [],
      isImmediatelyGetList: false, // 是否立即获取数据列表
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    echartsTitle() {
      let tfProjectFk = filterMultiDictText(this.dictOptions.tfProjectFkId, this.queryParam.tfProjectFkId+'')
      let tfAreaFk = filterMultiDictText(this.dictOptions.tfAreaFkId, this.queryParam.tfAreaFkId+'')
      let tfSenserDataType = filterMultiDictText(this.dictOptions.tfSenserDataTypeCode, this.queryParam.tfSenserDataTypeCode+'')
      return `采集数据表（${tfProjectFk}-${tfAreaFk}-${tfSenserDataType}）`
    }
  },
  watch: {
    createTime_block() {
      if (this.createTime_block) {
        // this.$set(this.queryParam, 'createTime_begin', this.createTime_block[0])
        // this.$set(this.queryParam, 'createTime_end', this.createTime_block[1])
        this.$set(this.queryParam, 'startTime', this.createTime_block[0])
        this.$set(this.queryParam, 'endTime', this.createTime_block[1])

      }
    },
    queryParam: {
      deep: true,
      handler(data) {
        if (data.tfAreaFkId && data.tfProjectFkId && data.tfSenserDataTypeCode) {
          this.searchQuery()
        } else {
          console.log('请选择必选参数')
        }
      }
    }
  },
  methods: {
    moment,
    // 级联默认设置第一个项目，第一个区块
    getPjVal (data) {
      console.log(data)
      this.$set(this.queryParam, 'tfProjectFkId', data[0])
      this.$set(this.queryParam, 'tfAreaFkId', data[1])
    },
    // 根据获取到的数据动态展示列，替代 JeecgListMixin 中的 loadData
    loadData(arg) {
      if (!this.isImmediatelyGetList) { //阻止第一次进入页面获取列表
        this.isImmediatelyGetList = !this.isImmediatelyGetList;
        return;
      }
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      // var params = this.getQueryParams() //查询条件
      var params = this.queryParam //查询条件
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          // this.dataSource = res.result.records
          this.dataSource = res.result
          // this.ipagination.total = res.result.total

          /**
           * 根据数据动态显示列 start
           * 设置 ecartDataHeader
           */

          var startTime = new Date().getTime()
          var columnsModel = getDataColumns()
          // 清除已有的列
          for (var k = this.columns.length - 1; k--; k >= 0) {
            if (this.columns[k].remove) this.columns.splice(k, 1)
          }
          // 清除已有的 echartsDataHeader
          // this.echartsDataHeader = ['createTime']
          // 遍历 columnsModel 并赋值
          for (var j = 0; j < columnsModel.length; j++) {
            var modelItem = columnsModel[j]
            for (var i in this.dataSource[0]) {
              var dataItem = i
              if (dataItem == modelItem.dataIndex) {
                this.columns.splice(this.columns.length - 1, 0, modelItem)
                // if (dataItem.indexOf('tv') > -1) this.echartsDataHeader.push(dataItem)
              }
            }
          }
          var endTime = new Date().getTime()
          console.log('动态显示列耗时：' + (endTime - startTime) + 'ms')
          /**
           * 根据数据动态显示列 end
           */
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    initDictConfig() {
      // 所有的项目列表-根据角色过滤
      initDictOptions(
        `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`
      ).then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfProjectFkId', deteleObject(res.result))
        }
      })
      // 区块id
      initDictOptions('tb_area,tf_code,id').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfAreaFkId', res.result)
        }
      })
      // 所有的15类采集参数
      initDictOptions('tdic_sensor_data_type,tf_name,tf_code').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfSenserDataTypeCode', res.result)
          // 设置采集参数默认值
          this.$set(this.queryParam, 'tfSenserDataTypeCode', this.dictOptions.tfSenserDataTypeCode[0].value)
        }
      })
      // 采集点id
      initDictOptions('tb_collecter_pointer,tf_collecter_product_code,id').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfCollecterPointerFkId', res.result)
        }
      })
      // 采集设备id
      initDictOptions('tb_collecter_pointer,tf_collecter_product_code,tf_collecter_product_code').then(res => {
        if (res.success) {
          this.$set(this.dictOptions, 'tfCollecterProductCode', res.result)
        }
      })
    },
  }
}
</script>
<style>
@import '~@assets/less/common.less';
.ant-table td,
.ant-table th { white-space: nowrap; }
</style>