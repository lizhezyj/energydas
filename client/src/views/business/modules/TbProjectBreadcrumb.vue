<template>
  <a-breadcrumb>
    <span slot="separator">/</span>
     <a-breadcrumb-item v-for="(breadcrumbItem, index) in breadcrumbItems" :key="index">
      <a-dropdown>
        <span class="a-dropdow-title" style="">{{ breadcrumbItem.text }} </span>
        <a-menu slot="overlay">
          <a-menu-item 
            v-for="(dictOptionsItem, index2) in dictOptions[breadcrumbItem.dataIndex]" 
            :key="index2"
            @click="selectDropMenuItem(dictOptionsItem, breadcrumbItem.dataIndex)"
          >
            <span>{{dictOptionsItem.text}}</span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-breadcrumb-item>

  </a-breadcrumb>
</template>

<script>
import {ajaxGetDictItems} from '@/api/api'
import { deteleObject } from '@/utils/util'

export default {
  name: 'TbProjectBreadcrumb',
  props: {
    dictCodes: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      breadcrumbItems: {},
      dictOptions: {}
    }
  },
  computed: {
  },
  watch: {
    'dictCodes.tfAreaFkId': {
      handler() {
        this.getDictData(this.dictCodes.tfAreaFkId, 'tfAreaFkId')
      }
    },
    'dictCodes.tfCollecterPointerFkId': {
      handler() {
        this.getDictData(this.dictCodes.tfCollecterPointerFkId, 'tfCollecterPointerFkId')
      }
    },
    'dictCodes.tfCollecterProductCode': {
      handler() {
        this.getDictData(this.dictCodes.tfCollecterProductCode, 'tfCollecterProductCode')
      }
    },
    'dictCodes.tfSensorDataTypeCode': {
      handler() {
        this.$store.dispatch('getTfSensorDataTypeDictOptions', this.dictCodes.tfSensorDataTypeCode)
          .then(res => this.setDataAndEmit(res, 'tfSensorDataTypeCode'))
      }
    }
  },
  created() {
    this.getInitDictData()
  },
  methods: {
    getInitDictData() {
      for (let i in this.dictCodes) {
        this.breadcrumbItems[i] = []
        if (i == 'tfSensorDataTypeCode') { // 获取&&缓存采集参数字典
          if (this.$store.state.dict.tfSensorDataTypeDictOptions.length > 0) {
            this.setDataAndEmit(this.$store.state.dict.tfSensorDataTypeDictOptions, i)
          } else {
            this.$store.dispatch('getTfSensorDataTypeDictOptions', this.dictCodes.tfSensorDataTypeCode)
              .then(res => this.setDataAndEmit(res, i))
          }
        } else {
          this.getDictData(this.dictCodes[i], i)
        }
      }
    },
    getDictData(dictCode, dataIndex) {
      if (!dictCode) return
      var that = this
      const dataPreIndex = dictCode.split('\'')[1]
      const storeDictOptions = this.$store.state.dict.projectAreaPointerDictOptions
      let isSendRequest = true
      switch (dataIndex) {
        case 'tfProjectFkId':
          if (storeDictOptions && storeDictOptions.length > 0) {
            this.setDataAndEmit(storeDictOptions, dataIndex)    
            isSendRequest = false
            return
          }
          break
        case 'tfAreaFkId':
          storeDictOptions.forEach(tfProjectFkIdItem => {
            if (tfProjectFkIdItem.value == dataPreIndex && tfProjectFkIdItem.children) {
              this.setDataAndEmit(tfProjectFkIdItem.children, dataIndex)
              isSendRequest = false
              return
            }
          })
          break
        case 'tfCollecterPointerFkId':
          storeDictOptions.forEach(tfProjectFkIdItem => {
            if (tfProjectFkIdItem.children) {
              tfProjectFkIdItem.children.forEach(tfAreaFkIdItem => {
                if (tfAreaFkIdItem.value == dataPreIndex && tfAreaFkIdItem.children) {
                  this.setDataAndEmit(tfAreaFkIdItem.children, dataIndex)
                  isSendRequest = false
                  return
                }
              })
            }
          })
          break
      }
      if (!isSendRequest) return
      
      //根据字典Code, 初始化字典数组
      ajaxGetDictItems(dictCode, null).then((res) => {
        if (res.success) {
          console.log(res.result);
          if (dictCode.indexOf('st_all_project_person') > -1) { //查项目字典的时候过滤重复的
            res.result = deteleObject(res.result)
          }
          const storeData = {
            dataIndex,
            dataOptions: res.result,
            dataPreIndex,
          }
          console.log(storeData)
          this.$store.commit('SET_PROJECTAREAPOINTER_DICTOPTIONS',storeData)
          this.setDataAndEmit(res.result, dataIndex)
        }
      })
      
      
    },
    // 获取字典数据后的成功回调
    setDataAndEmit(data, dataIndex) {
      this.$set(this.dictOptions, dataIndex, data)
      var cacheSelectedBreadcrumbItems = this.$store.state.dict.selectedBreadcrumbItems[dataIndex]
      if (data.length > 0) {
        if (cacheSelectedBreadcrumbItems && cacheSelectedBreadcrumbItems.text) { // 其他页缓存的面包屑选项
          this.$set(this.breadcrumbItems, dataIndex, {text: cacheSelectedBreadcrumbItems.text, value: cacheSelectedBreadcrumbItems.value, dataIndex})
        } else {
          this.$set(this.breadcrumbItems, dataIndex, {text: data[0].text, value: data[0].value, dataIndex})
        }
      } else {
        this.$set(this.breadcrumbItems, dataIndex, {text: '请添加', value: '', dataIndex})
      }
      this.$emit('selectDropMenuItemChange', this.breadcrumbItems[dataIndex])
    },
    // 下拉选项改变
    selectDropMenuItem(selectdDataItem, dataIndex) {
      this.$store.commit('SET_SELECTEDBREADCRUMBITEMS', {}) // 下拉选择时将缓存清空
      // 对所选项的子项清除
      if (this.breadcrumbItems[dataIndex].value != selectdDataItem.value) { // 选择项目非重复点击
        switch (dataIndex) {
          case 'tfProjectFkId':
            for (var i in this.breadcrumbItems) {
              if (i != dataIndex) {
                this.breadcrumbItems[i] = ''
              }
            }
            break
          case 'tfAreaFkId':
            for (var i in this.breadcrumbItems) {
              if (i != dataIndex && i!= 'tfProjectFkId') {
                this.breadcrumbItems[i] = ''
              }
            }
            break
        }
      }
      
      for (let i in this.breadcrumbItems) {
        if (i == dataIndex) {
          this.$set(this.breadcrumbItems, dataIndex, {dataIndex, ...selectdDataItem})
          this.breadcrumbItems = Object.assign({}, this.breadcrumbItems)
        }
      }
      this.$emit('selectDropMenuItemChange', this.breadcrumbItems[dataIndex])
      this.$store.commit('SET_SELECTEDBREADCRUMBITEMS', this.breadcrumbItems)
    } 

  }
}
</script>

<style lang="scss" scoped>
.ant-breadcrumb .a-dropdow-title {
  cursor: pointer;
}
.ant-breadcrumb > span {
  color: rgba(0, 0, 0, 0.45);
  transition: width 2s;
}
.ant-breadcrumb > span:hover {
  color: #40a9ff
}
</style>