<template>
  <div>
    
    <j-dict-select-tag 
      ref="dictSelectTag"
      :showSearch="true"
      style="margin: -5px 0; width:150px;"
      v-if="col.dataIndex == 'tfSensorProductTypeCode'"      
      :value="text"
      @change="handleTableColChange" 
      :trigger-change="true" 
      :dictCode="`tdic_sensor_type,tf_product_type_name,tf_product_type_code,tf_data_type_code='${queryParam.tfSensorDataTypeCode}'`" 
      placeholder="请选择厂家型号"
      @handleAddSelectItem="handleAddSelectItem"
      :showSelectOptsAddBtn="true"
    />

    <j-dict-select-tag 
      ref="dictSelectTag"
      :showSearch="true"
      style="margin: -5px 0; width:150px;"
      v-else-if="col.dataIndex == 'tfLineCode'"      
      :value="text"
      @change="handleTableColChange" 
      :trigger-change="true" 
      dictCode="dic_sensor_type" 
      placeholder="请选择传感器类型"
    />

    <a-input-number
      v-else-if="(col.dataIndex.indexOf('tfP') > -1 && col.dataIndex != 'tfPosition')"
      style="margin: -5px 0; width:150px;"
      :step="0.0000000001" 
      v-model="numText"
      :formatter="limitDecimals" 
      :parser="limitDecimals" 
      @change="handleTableColChange" 
    />

    <a-input-number 
      v-else-if="isRenderInputNum(col.dataIndex)"
      style="margin: -5px 0; width:150px;"
      :value="text"
      @change="handleTableColChange"
    />
    
    <a-input
      v-else
      style="margin: -5px 0; width:150px;"
      :value="text"
      @change="e => handleTableColChange(e.target.value, record.id, col.dataIndex)"
    />



  </div>
</template>

<script>
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import { getAction, httpAction } from '@/api/manage'

  export default {
    name: 'SensorPointerEditableCell',
    props: {
      dataSource: {
        required: true,
        type: Array,
      },
      col: {
        required: true,
      },
      record: {
        required: true,
      },
      text: {
        required: true,
      },
      queryParam: {
        required: true,
        
      }
    },
    data() {
      return {
        // numText: this.text,
        url: {
          tdicSensorTypeList: "/sensor_type_manager/tdicSensorType/list",
        },
        renderInputNumIndexArr: [
          {
            dataIndex: 'tfCollecterChannelCode',
            dataName: '通道号',
          },
          {
            dataIndex: 'tfUpAlert',
            dataName: '报警上限',
          },
          {
            dataIndex: 'tfDownAlert',
            dataName: '报警下限',
          },
          {
            dataIndex: 'tfSlopeAlert',
            dataName: '报警斜率',
          },
          {
            dataIndex: 'tfTotalAlert',
            dataName: '报警累计',
          },
          {
            dataIndex: 'tfTotalAlertInitVal',
            dataName: '累计报警初始值',
          },
        ]
      }
    },
    computed: {
      numText: {
        set: function (newValue) {
          // console.log(newValue)
          // this.numText = newValue
        },
        get: function () {
          return this.text
        }
      }
    },
    methods: {
      //判断是否渲染为input number输入框
      isRenderInputNum(index) {
        for (var i = 0; i < this.renderInputNumIndexArr.length; i++) {
          if (index == this.renderInputNumIndexArr[i].dataIndex) {
            return true
          }
        }
        return false
      },
      // 控制计算参数小数点后十位
      limitDecimals (value) {
        const reg = /^(\-)*(\d+)\.(\d{1,10}).*$/;
        let res = ''
        value = this.toNonExponential(value)
        if(typeof value === 'string') {
          res = !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
          return res
        } else if (typeof value === 'number') {
          res = !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
          return res
        } else {
            return ''
        }
      },
      // 避免科学计数法显示 1e-10
      toNonExponential(num) {
        if (num == 0 || !num) return num
        if(typeof num === 'string') {
          num = parseFloat(num)
        }
        var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
        return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
      },
      handleTableColChange(value, id, column) {
        if (typeof value == 'string') value = value.trim()
        if (!id) id = this.record.id
        if (!column) column = this.col.dataIndex
        const newDataSource = [...this.dataSource];
        const target = newDataSource.filter(item => id === item.id)[0];

        // 厂家型号下拉选择联动
        if (column == 'tfSensorProductTypeCode') {
          // this.SensorProductTypeInputChangeHandle(value, target) //取消厂家型号选择联动
        } else if (column.indexOf('tfP') > -1 && column != 'tfPosition' ) {
          value = this.limitDecimals(value)
          this.numText = this.limitDecimals(value)
        }
        
        if (target) {
          target[column] = value;
          // console.log(target)
          this.$emit('handleTableColChange', newDataSource)
        }
      },
      // 选择厂家型号设置对应的系数
      SensorProductTypeInputChangeHandle(val, target) {
        if (!val) {
          target['tfP1'] = null
          target['tfP2'] = null
          target['tfP3'] = null
          return;
        }
        
        let SensorProductTypeData = ''
        getAction(this.url.tdicSensorTypeList, {tfProductTypeCode: val})
        .then((res) => {
          if (res.success) {
            console.log(res)
            SensorProductTypeData = res.result.records[0]
          }
          if(res.code===510){
          }
          if (SensorProductTypeData) {
            target['tfP1'] = SensorProductTypeData.tfP1 ? SensorProductTypeData.tfP1 : null
            target['tfP2'] = SensorProductTypeData.tfP2 ? SensorProductTypeData.tfP2 : null
            target['tfP3'] = SensorProductTypeData.tfP3 ? SensorProductTypeData.tfP3 : null
          }
        })
      },
      handleAddSelectItem() {
        // this.$router.push({path: '/business/TdicSensorTypeList', query: {...this.queryParam}})
        this.$emit('handleAddSelectItem')
      },
      handleAddSelectItemComplete() {
        this.$refs.dictSelectTag.initDictData()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>