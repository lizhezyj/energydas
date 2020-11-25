<template>
  <main>
    <!-- echarts -->
    <div class="content" v-if="data.length>0">
      <my-charts 
        :title="title" 
        :data="echartsType == 1 ? echartsData : echartsData2" 
        :xAxisType="this.xAxisType == 'create_time' ?  'category' : 'value'" 
        :echartsType="echartsType"
        :isShowToolBox="isShowToolBox"
        :tfSensorDataTypeViewUnit="tfSensorDataTypeViewUnit"
        @getEchartDataUrl="getEchartDataUrl"
        />

      <!-- <a-radio-group
        style="margin: 20px 0 0 10px;"
        name="radioGroup" 
        v-model="echartsType"
        v-if="isShowTypeSelectBox"
        >
        <a-radio :value="1">图表1</a-radio>
        <a-radio :value="2">图表2</a-radio>
      </a-radio-group> -->
    </div>

    <div v-else class="ant-empty ant-empty-normal"><div class="ant-empty-image"><img alt="暂无数据" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"></div><p class="ant-empty-description">暂无数据</p></div>
    
  </main>
</template>

<script>
import myCharts from '@/views/business/data/modules/Charts.vue'

export default {
  name: 'ViewDataCheckedCharts',
  components: {
    myCharts
  },
  props: {
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
    },
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    isShowToolBox: {
      type: Boolean,
      default: true,
    },
    isShowTypeSelectBox: {
      type: Boolean,
      default: true,
    },
    echartsType: {
      type: Number,
    },
    tfSensorDataTypeCode:{
      type: String,
    },
    tfSensorDataTypeViewUnit: {
      type: String,
    },
  },
  data() {
    return {
      axisTypes: [{ label: '计算值', value: 'tv' }, { label: '原始值', value: 'td' }, { label: '时间', value: 'create_time' }],
      xAxisType: 'create_time',
      yAxisType: 'tv',
      echartsDataHeader: ['create_time'],
      echartsDataTitle: '采集数据表',
      echartsData: [],
      echartsData2: [],
      // echartsType: 1, //图表类型
    }
  },
  created() {
    this.generateChartsData()
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.echartsData = []
        this.echartsData2 = []
        this.generateChartsData()
      }
    },
    echartsType(val) {
      if (val == 1) {
        this.xAxisType = 'create_time'
        this.yAxisType = 'tv'
      } else if (val == 2) {
        this.xAxisType = 'tv'
        this.yAxisType = 'create_time'
      }
      this.generateChartsData()
    }
  },
  methods: {
    getEchartDataUrl(val) {
      this.$emit('getEchartDataUrl', val)
    },
    xAxisChange() {
      
    },
    createCharts() {
      if (!this.xAxisType || !this.yAxisType) {
        console.log('请选择')
      } else if ((this.xAxisType == 'tv' && this.yAxisType == 'td') || (this.xAxisType == 'td' && this.yAxisType == 'tv')) {
        console.log('x,y轴不能同时为数据')
      }

      this.generateChartsData()
    },
    generateChartsData() {
      if (this.echartsType == 1 && this.echartsData.length > 0 ) {
        return 
      } else if (this.echartsType == 2 && this.echartsData2.length > 0) {
        return
      }

      const xAxis = this.xAxisType
      const yAxis = this.yAxisType

      var startTime = new Date().getTime()
      this.echartsDataHeader = [xAxis]
      // 设置x轴数据
      if (yAxis == 'tv' || yAxis == 'td') { // 默认情况
        for (var i in this.data[0]) {
          if (i.indexOf(yAxis) > -1) this.echartsDataHeader.push(i) 
          this.echartsDataHeader.sort()
        }
      } else if (yAxis == 'create_time') { //
        this.data.forEach(dataItem => {
          this.echartsDataHeader.push(dataItem[yAxis])
        });
        // this.echartsDataHeader.sort()
      }

      
      // 设置y轴数据
      var dataArrs = [this.echartsDataHeader]
      if (yAxis == 'tv' || yAxis == 'td') { // 默认情况
        for (var i = 0; i < this.data.length; i++) {
          var dataArr = []
          var dataItem = this.data[i]
          for (var j = 0; j < this.echartsDataHeader.length; j++) {
            var headerItem = this.echartsDataHeader[j]
            for (var k in dataItem) {
              if (k.indexOf(headerItem) > -1) dataArr.push(dataItem[k])
            }
          }
          dataArrs.push(dataArr)
        }
        console.log(dataArrs)
      } else if (yAxis == 'create_time') { //图表 2
        var columnsTitles = []
        for (var i in this.data[0]) {
          if (i.indexOf(xAxis) > -1) {
            dataArrs.push([i])
            columnsTitles.push(i)
          }
        }
        dataArrs.sort() // 图表 2 y 轴通道号排序
        console.log(columnsTitles)
        for (var j = 0; j < this.data.length; j++) {
          for (var k in this.data[j]) {
            for (var l = 0; l < columnsTitles.length; l++) {
              if (k == columnsTitles[l]) {
                dataArrs[l + 1].push(this.data[j][k])
              }
            }
          }
        }
        console.log(dataArrs)
      }
      
      if (this.echartsType == 1) {
        this.echartsData = dataArrs
      } else {
        this.echartsData2 = dataArrs
      }

      var endTime = new Date().getTime()
      console.log('动态计算数据耗时：' + (endTime - startTime) + 'ms')

    }
  }
}
</script>

<style lang="scss" scoped>
</style>