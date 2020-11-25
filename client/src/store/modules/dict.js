import Vue from 'vue'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { resolve } from 'tinymce'


const dict = {
  state: {
    projectAreaPointerDictOptions: [], // 项目\工程部位\采集器编号字典树
    tfSensorDataTypeDictOptions: [], // 采集参数字典
    selectedBreadcrumbItems: {}, // 已选择的面包屑item
  },

  mutations: {
    /**
     * data: 
     * data.dataIndex: 
     * data.dataOptions:
     * data.dataPreIndex: 
     */
    SET_PROJECTAREAPOINTER_DICTOPTIONS: (state, data) => {
      switch (data.dataIndex) {
        case 'tfProjectFkId': 
          state.projectAreaPointerDictOptions = data.dataOptions
          break
        case 'tfAreaFkId':
          state.projectAreaPointerDictOptions.forEach(tfProjectFkIdItem => {
            if (tfProjectFkIdItem.value == data.dataPreIndex) {
              tfProjectFkIdItem.children = data.dataOptions
            }
          })
          break
          case 'tfCollecterPointerFkId':
          state.projectAreaPointerDictOptions.forEach(tfProjectFkIdItem => {
            if (tfProjectFkIdItem.children) {
              tfProjectFkIdItem.children.forEach(tfAreaFkIdItem => {
                if (tfAreaFkIdItem.value == data.dataPreIndex) {
                  tfAreaFkIdItem.children = data.dataOptions
                }
              })
            }
          })
          break
      }
    },
    SET_TFSENSORDATATYPE_DICTOPTIONS: (state, data) => {
      state.tfSensorDataTypeDictOptions = data
    },
    SET_SELECTEDBREADCRUMBITEMS: (state, data) => {
      state.selectedBreadcrumbItems = data
    }
  },

  actions: {
    getTfSensorDataTypeDictOptions({commit}, dictCodes) {
      return new Promise((resolve, reject) => {
        initDictOptions(dictCodes)
          .then(res => {
            if (res.success) {
              // 设置采集参数单位
              commit('SET_TFSENSORDATATYPE_DICTOPTIONS', res.result)
              resolve(res.result)
            } else {
              reject(res)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
}

export default dict
