<template>
  <!-- <div
    :class="className"
    :style="{height:height,width:width}"
    style="height:400px;width: 700px;padding:10px;background:#1B1B1B"
  /> -->
  <chart
    :options="map"
    ref="map"
    autoresize
  />
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import map from './data/map'
import scatter from './data/scatter'
// built-in theme
import 'echarts/theme/dark'
// Map of China
import chinaMap from './china.json'
// registering map data
ECharts.registerMap('china', chinaMap)

export default {
  name: 'myCharts',
  components: {
    chart: ECharts
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
      chart: null,
      map
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>