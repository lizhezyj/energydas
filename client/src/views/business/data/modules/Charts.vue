<template>
  <main>
    <e-charts 
      :class="echartsType == 1 ? 'echartsType1' : 'echartsType2'" 
      :options="opt" 
      theme="ovilia-green" 
      ref="echart" 
      autoresize 
      @finished="renderFinished"
    />
  </main>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
// import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/map'
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip' //提示框
import 'echarts/lib/component/toolbox' //右上角工具栏
// import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend' //图例
import 'echarts/lib/component/legend/scrollableLegendAction' //图例
import 'echarts/lib/component/legend/ScrollableLegendModel' //图例
import 'echarts/lib/component/legend/ScrollableLegendView' //图例
import 'echarts/lib/component/title' //标题
// import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'
// import 'echarts/map/js/world'
// import 'zrender/lib/svg/svg'

import 'echarts/lib/component/dataZoom/DataZoomView'
import 'echarts/lib/component/dataZoom/SliderZoomView'
import 'echarts/lib/component/dataZoom/SliderZoomModel'
import 'echarts/lib/component/dataZoom/InsideZoomView'
import 'echarts/lib/component/dataZoom/InsideZoomModel'

// import 'echarts/lib/component/brush/BrushView'
// import 'echarts/lib/component/brush/brushAction'
// import 'echarts/lib/component/brush/BrushModel'
// import 'echarts/lib/component/brush/preprocessor'
// import 'echarts/lib/component/brush/selector'
// import 'echarts/lib/component/brush/visualEncoding'


export default {
  name: 'myCharts',
  components: {
    ECharts
  },
  props: {
    dataOption: {
      type: Array,
    },
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: false
    },
    type: {
      type: String,
      default: 'line',
      required: false
    },
    xAxisType: { // category 类目轴 value 数值
      type: String,
      default: 'category'
    },
    echartsType: {
      type: Number
    },
    isShowToolBox: {
      type: Boolean,
      default: true,
    },
    tfSensorDataTypeViewUnit: {
      type: String,
    },
  },
  data() {
    return {
      firstRender: 1,
      opt: this.getOption()
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.opt = this.getOption()
        this.firstRender = 1
      }
    }
  },
  methods: {
    renderFinished() {
      if (this.firstRender == 1) {
        console.log('-------------renderFinished-------------')
        this.$emit('getEchartDataUrl', this.$refs.echart.getDataURL({
          pixelRatio: 2, //导出的图片分辨率比例
          backgroundColor: '#fff', //背景颜色
          excludeComponents: ['toolbox', 'dataZoom'] //忽略组件的列表
        }))
        this.firstRender--
      }
      
    },
    getOption() {
      const [first, ...legendData] = this.data[0]
      const legendDataArr = []

      legendData.forEach(item => {
        legendDataArr.push({
          name: item,
          icon: 'circle'
        })
      })

      return {
        title: {
          //标题
          text: this.title,
          x: 'center',
          // textAlign: 'center',
        },
        tooltip: {
          //提示框组件
          trigger: 'axis',
          // formatter: '{b0}: {c0}<br />{b1}: {c1}',
        },
        legend: {
          //图例
          // type: legendDataArr.length > 15 ? 'scroll' : 'plain', // 图例的类型
          type: 'scroll', // 图例的类型
          bottom: '10%',
          data: legendDataArr,
          orient: this.echartsType == 1 ? 'horizontal' : 'vertical',
          right: this.echartsType == 1 ? 'auto' : 0,
          top: this.echartsType == 1 ? 'auto' : '20%',
          itemGap: 20,
        },
        dataset: {
          //数据
          source: this.data
        },
        grid: {
          left: '3%',
          right: this.echartsType == 1 ? '10%' : '25%',
          bottom: this.echartsType == 1 ? '20%' : '10%',
          containLabel: true, //防止标签溢出
        },
        toolbox: {
          //工具栏
          show: this.isShowToolBox,
          feature: {
            dataZoom: {
              //数组缩放
              show: false,
              yAxisIndex: 'none'
            },
            dataView: {
              //数据视图
              show: false,
              readOnly: false
            },
            magicType: {
              //动态切换
              show: false,
              type: ['line', 'bar']
            },
            // restore: {}, //配置项还原
            saveAsImage: { //保存为图片
              pixelRatio: 2, //导出的图片分辨率比例
              backgroundColor: '#fff', //背景颜色
              excludeComponents: ['toolbox', 'dataZoom']
            }, 
          }
        },
        dataZoom: [
          {
            id: 'dataZoomInside',
            type: 'inside',

          },
          {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            // start: 30,
            // end: 70
          }
        ],
        xAxis: {
          type: this.xAxisType,
          // type: 'category',
          boundaryGap: false,
          // name: '日期'
          scale: true,
          axisLabel: {
            formatter: this.xAxisType == 'category' ?  '{value}' : `{value} ${this.tfSensorDataTypeViewUnit}` //添加单位显示
          },
        },
        yAxis: {
          // type: 'value',
          type: this.xAxisType == 'category' ? 'value' : 'category',
          scale: true, //设置成 true 后坐标刻度不会强制包含零刻度
          axisLabel: {
            formatter: this.xAxisType == 'category' ? `{value} ${this.tfSensorDataTypeViewUnit}` : '{value}'
          },
        },
        series: [...legendData].fill({
          type: this.type,
          connectNulls: true,
          // symbol: function(value, params) {
          //   console.log(value, params)
            
          //   return []
          // }
          // seriesLayoutBy: 'row'
        }),
        color: ['#FF9C6E', '#FFC069', '#95DE64', '#5CDBD3', '#69C0FF', '#85A5FF', '#B37FEB', '#FF85C0']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.echartsType1 {
  width: 100%;
  min-width: 800px;
  height: 400px;
}
.echartsType2 {
  width: 50%;
  min-width: 630px;
  height: 800px;
}
// .echartsType1,
// .echartsType2 {
//   // background-color: pink;
// }
</style>