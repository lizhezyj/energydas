<template>
<a-card :bordered="false">
  <!-- 操作按钮区域 -->
  <div class="table-operator">
    <a-button type="primary" icon="download" @click="handleExportXls(echartsTitle)">导出</a-button>
    <a-button v-if="selectedRowKeys.length > 0" icon="download" @click="handleExportXls(echartsTitle, 'selectedRow')">导出已选项</a-button>
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
      :rowKey="dataSourceType == 1 ? 'id' : 'tdv'"
      :columns="dataSourceType == 1 ? columns : columns2"
      :dataSource="dataSourceType == 1 ? dataSource : dataSource2"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
      :scroll="{ x: true }"
    >
      <!-- 数据编辑列 -->
      <template
        v-for="col in editColsName"
        :slot="col" 
        slot-scope="text, record">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0;width: 100px;"
            :value="text"
            @change="e => handleTableColChange(e.target.value, record.id, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <!-- 操作列 -->
      <span slot="action" slot-scope="text, record">
        <span v-if="record.editable">
          <a @click="() => handleTableColSave(record)">保存</a>
          &nbsp;&nbsp;
          <a-popconfirm title="确定取消吗?" @confirm="() => handleTableColCancel(record)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a @click="() => handleTableColEdit(record)">编辑</a>
        </span>
      </span>
    </a-table>
  </div>
</a-card>
</template>

<script>
import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'ViewDataCheckedTable',
  props: {
    dataSourceType: {
      type: Number,
    },
    preDataSource: {
      type: Array,
    },
    dataSource2: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    columns2: {
      type: Array,
    },
    editColsName: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
    echartsTitle: {
      type: String
    },
    dictOptions: {
      type: Object
    },
  },
  data() {
    return {
      // dataSource: this.preDataSource,
      /* 分页参数 */
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
    }
  },
  computed: {
    dataSource: {
      set: function (newVal) {
        // console.log(newVal)
        return newVal
      },
      get: function () {
        return JSON.parse(JSON.stringify(this.preDataSource))
      }
    }
  },
  methods: {
    // 导出execl
    handleExportXls(echartsTitle, isSelectedRow) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        let tHeader = []
        let filterVal = []
        const columns = this.dataSourceType == 1 ? this.columns : this.columns2
        const dataSource = this.dataSourceType == 1 ? this.dataSource : this.dataSource2
        columns.forEach(column => {
          if (column.dataIndex && column.dataIndex != 'action') {
            tHeader.push(column.title)
            filterVal.push(column.dataIndex)
          }
        })
        const dataList = isSelectedRow ? this.selectionRows : dataSource
        const data = this.formatJson(filterVal, dataList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: echartsTitle,
          autoWidth: true,
          bookType: 'xlsx',
        })
        this.downloadLoading = false
      })
    },
    // 格式化导出数据
    formatJson(filterVal, jsonData) {
      var that = this
      return jsonData.map(v => filterVal.map(j => {
        switch (j) {
          case 'tf_project_fk_id':
            return filterMultiDictText(that.dictOptions['tfProjectFkId'], v[j] + '')
            break
          case 'tf_area_fk_id':
            return filterMultiDictText(that.dictOptions['tfAreaFkId'], v[j] + '')
            break
          case 'tf_senser_data_type_code':
            return filterMultiDictText(that.dictOptions['tfSensorDataTypeCode'], v[j] + '')
            break
          case 'tf_collecter_pointer_fk_id':
            return filterMultiDictText(that.dictOptions['tfCollecterPointerFkId'], v[j] + '')
            break
          case 'tf_collecter_product_code':
            return filterMultiDictText(that.dictOptions['tfCollecterProductCode'], v[j] + '')
            break
          default:
            return v[j]
        }
      }))
    },
    // 分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
    },
    // 表格行编辑
    handleTableColEdit(record) {
      console.log(record)
      //编辑行，仅 tv 值可编辑
      const newDataSource = [...this.dataSource];

      // const target = newDataSource.filter(item => record.id === item.id)[0];
      // if (target) {
      //   target.editable = true;
      //   this.dataSource = newDataSource
      // }
      
      newDataSource.forEach((item, index) => {
        if (item.id == record.id) {
          item.editable = true
          // this.$set(this.dataSource[index], 'editable', true)
          this.dataSource.splice(index, 1, item)
        }
      })
    },
    // 表格行编辑保存
    handleTableColSave(record) {
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => record.id === item.id)[0];
      if (target) {
        delete target.editable;
        this.dataSource = newDataSource;
      }
      var that = this;
      httpAction(that.url.edit,record,'put').then((res)=>{
        if(res.success){
          that.$message.success(res.message);
          that.loadData();
        }else{
          that.$message.warning(res.message);
        }
      })
    },
    // 表格行编辑取消
    handleTableColCancel(record) {
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => record.id === item.id)[0];
      if (target) {
        // Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.dataSource = newDataSource;
      }
      console.log(record)
    },
    // 表格行编辑change
    handleTableColChange(value, id, column) {
      console.log(value)
      const newDataSource = [...this.dataSource];
      const target = newDataSource.filter(item => id === item.id)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newDataSource;
      }
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
  }
}
</script>

<style lang="scss" scoped>

</style>