<template>
  <!-- <a-card :bordered="false"> -->
  <baidu-map
    :id="id"
    :class="className"
    :style="{height, width}"
    :center="center"
    :zoom="zoom"
    @ready="handler"
    @moving="syncCenterAndZoom"
    @moveend="syncCenterAndZoom"
    @zoomend="syncCenterAndZoom"
    ak="7AqmUfCBIcFDrD6pcrDLKgwcI8riRGVu"
  >
    <!-- 缩放控件 -->
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <!-- 单点marker -->
    <bm-marker v-if="showMarker" :position="center" :dragging="true" @dragend="pointMarkerDragend" />
    <!-- 点集合 -->
    <bm-point-collection
      v-if="showPointCollection"
      :points="points"
      shape="BMAP_POINT_SHAPE_CIRCLE"
      color="red"
      size="BMAP_POINT_SIZE_NORMAL"
      @click="pointCollectionClickHandler"
    />
    <!-- 点集合标签 -->
    <bm-label 
      class="bmlabel" 
      v-show="showPointLabel"
      :labelStyle="{transform: 'translate(-10px, 8px)', witheSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px'}"
      v-for="pointItem in points" 
      :key="pointItem.id" 
      :position="{lng: pointItem.lng, lat: pointItem.lat}" 
      :content="pointItem.projectData.tfProjectName"
      @click="pointLabelClickHandler(pointItem)"
    />
    
    <!-- 信息窗口 -->
    <bm-info-window 
      :width="300"
      :height="0" 
      :position="infoWindow.position" 
      :show="infoWindow.show" 
      @close="infoWindowClose" 
      class="bminfo"
      :autoPan="true"
      >
      <p>{{infoWindow.title}}</p>
      <p>项目编号：<span>{{infoWindow.mainInfo.tfProjectCode}}</span> </p>
      <p>启动日期：<span>{{infoWindow.mainInfo.tfStartdate}}</span> </p>
      <p>项目状态：<span>{{filterMultiDictText(tfStateDictOptions, infoWindow.mainInfo.tfState + '')}}</span> </p>
      <p>建设单位：<span>{{infoWindow.mainInfo.tfCustomer}}</span> </p>
      <p>地点：<span>{{infoWindow.mainInfo.tfAddr}}</span> </p>
      <p>坐标：<span>{{infoWindow.mainInfo.tfLng}},{{infoWindow.mainInfo.tfLat}}</span> </p>
    </bm-info-window> 
  </baidu-map>
  <!-- </a-card> -->
</template>

<script>
import debounce from 'lodash/debounce'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import bmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import bmPointCollection from 'vue-baidu-map/components/overlays/PointCollection.vue'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue'
import BmLabel from 'vue-baidu-map/components/overlays/Label.vue'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'

import { axios } from '@/utils/request'

export default {
  name: 'TbProjectMapCard',
  components: {
    BaiduMap,
    bmMarker,
    bmPointCollection,
    BmInfoWindow,
    BmLabel,
    BmNavigation,
  },
  props: {
    showMarker: {
      type: Boolean,
      default: false
    },
    showPointCollection: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'map'
    },
    id: {
      type: String,
      default: 'map'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
    },
    adress: {
      type: String
    },
    points: {
      type: Array,
      default: () => []
    },
    center: {
      type: Object,
      default: () => {
        return {
          lng: 117.208694,
          lat: 39.091237
        }
      }
    },
    zoom: {
      type: Number,
      default: 13,
    }
  },
  watch: {
    adress: function(val) {
      this.debounceGetPoint(this, val)
    }
  },
  data() {
    return {
      // center: {},
      // zoom: 12,
      myGeocoder: '',
      BMap: '',
      map: '',
      markerPoint: '',
      infoWindow: {
        show: false,
        position: {},
        title: '',
        mainInfo: '',
      },
      showPointLabel: false,
      tfStateDictOptions: [],
    }
  },
  computed: {
    // centerData() {
    //   return this.center
    // }
  },
  created() {
    // this.coordsAction('117.208694,39.091237')
    //   .then(res => console.log(res))
    this.initDictConfig()
  },
  methods: {
    filterMultiDictText,
    initDictConfig() {
      initDictOptions('tdic_pjstate,tf_name,tf_code').then(res => {
        if (res.success) {
          this.tfStateDictOptions = res.result
        }
      })
    },
    coordsAction(coords) {
      //坐标转换
      const params = {
        coords,
        from: 1,
        to: 5,
        ak: '7AqmUfCBIcFDrD6pcrDLKgwcI8riRGVu'
      }
      return axios({
        url: 'https://api.map.baidu.com/geoconv/v1/',
        method: 'get',
        data: params
      })
    },
    handler({ BMap, map }) {
      this.myGeocoder = new BMap.Geocoder() // 创建地址解析器实例 根据地址信息==》百度经纬度坐标
      this.BMap = BMap
      this.map = map
      this.$emit('mapReady')
      // 去除地图覆盖物，信息窗口
      map.setMapStyleV2({     
        styleId: '7b683c7476f292fe4d7e50a7e7777850'
      })
    },
    syncCenterAndZoom(e) {
      // const { lng, lat } = e.target.getCenter()
      // const zoom = e.target.getZoom()
      // console.log(lng, lat)
      // console.log(zoom)
      // this.center.lng = lng
      // this.center.lat = lat
    },
    // 拖动点
    pointMarkerDragend(e) {
      const { lng, lat } = e.target.point
      // this.center.lng = lng
      // this.center.lat = lat

      this.getLocation({ lng, lat })
        .then(res => {
          const location = res.address
          this.$emit('getMarkerPoint', { point: { lng, lat }, location })
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 指定经纬度获取地址
    getLocation({ lng, lat }) {
      if (this.myGeocoder) {
        return new Promise((resolve, reject) => {
          this.myGeocoder.getLocation(new this.BMap.Point(lng, lat), res => {
            if (res) {
              resolve(res)
            } else {
              reject('获取地址失败')
            }
          })
        })
      }
    },
    // 根据位置描述获取经纬度坐标
    getPoint(location) {
      if (this.myGeocoder) {
        return new Promise((resolve, reject) => {
          this.myGeocoder.getPoint(location, point => {
            if (point) {
              resolve(point)
              // this.map.centerAndZoom(point, 16);
              // this.map.addOverlay(new BMap.Marker(point));
            } else {
              console.warn('您选择地址没有解析到结果!')
              reject('您选择地址没有解析到结果!')
            }
          })
        })
      }
    },
    // 防抖获取地址坐标
    debounceGetPoint: debounce((vm, val) => {
      vm.getPoint(val).then(res => {
        console.log(res)
        this.$emit('inputAddressGetPoint', res)
      })
    }, 800),
    pointCollectionClickHandler(e) {
      this.$set(this.infoWindow, 'show', true)
      this.$set(this.infoWindow, 'position', {lng: e.point.lng, lat: e.point.lat})
      this.$set(this.infoWindow, 'title', e.point.projectData.tfProjectName)
      this.$set(this.infoWindow, 'mainInfo', e.point.projectData)
      this.$emit('pointCollectionClickHandler', e)
    },
    pointLabelClickHandler(point) {
        this.$set(this.infoWindow, 'show', true)
        this.$set(this.infoWindow, 'position', {lng: point.lng, lat: point.lat})
        this.$set(this.infoWindow, 'title', point.projectData.tfProjectName)
        this.$set(this.infoWindow, 'mainInfo', point.projectData)
    },
    // pointMarkClickHandler
    infoWindowClose() {
      this.$set(this.infoWindow, 'show', false)
    },
    setCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
  }
}
</script>

<style lang="scss">
.bmlabel {
  position: absolute;
    max-width: 300px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    z-index: 2;
    line-height: 24px;
    border-radius: 2px;
    padding: 10px 14px;
    font-size: 14px;
    color: #fff;
    display: inline-block;
    background-color: #5184f9;
    box-shadow: 0 0 4px rgba(0,0,0,.2);
    font-weight: 900;
    white-space:normal;
}
.bminfo {
  
  p {
    margin: 0;
  }
}
// 去除左下角logo
.anchorBL {
  display: none;
}
</style>