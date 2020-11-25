<template>
  <div class="table-header-info">
    <!-- 传感器安装页面单位显示 -->
    <div v-if="showType == 1">
      <p class="data-unit" v-if="tableHeaderInfo.tfFormula">
        公式:{{tableHeaderInfo.tfFormula}}
      </P>
      <p v-if="tableHeaderInfo.tfP1Unit || tableHeaderInfo.tfP2Unit || tableHeaderInfo.tfP3Unit || tableHeaderInfo.tfP4Unit || tableHeaderInfo.tfP5Unit || tableHeaderInfo.tfP6Unit">
        <span class="comma-partition" v-if="tableHeaderInfo.tfP1Unit">
          ζ1单位:{{tableHeaderInfo.tfP1Unit}}
        </span>
        <span class="comma-partition" v-if="tableHeaderInfo.tfP2Unit">
          ζ2单位:{{tableHeaderInfo.tfP2Unit}}
        </span>
        <span class="comma-partition" v-if="tableHeaderInfo.tfP3Unit">
          ζ3单位:{{tableHeaderInfo.tfP3Unit}}
        </span>
        <span class="comma-partition" v-if="tableHeaderInfo.tfP4Unit">
          ζ4单位:{{tableHeaderInfo.tfP4Unit}}
        </span>
        <span class="comma-partition" v-if="tableHeaderInfo.tfP5Unit">
          ζ5单位:{{tableHeaderInfo.tfP5Unit}}
        </span>
        <span class="comma-partition" v-if="tableHeaderInfo.tfP6Unit">
          ζ6单位:{{tableHeaderInfo.tfP6Unit}}
        </span>
      </p>
      <span v-if="tableHeaderInfo.tfSlopeUnit || tableHeaderInfo.tfViewUnit">单位: </span>
      <p v-if="tableHeaderInfo.tfSlopeUnit">
        斜率:{{tableHeaderInfo.tfSlopeUnit}}
      </p>
      <p v-if="tableHeaderInfo.tfViewUnit">
        上下限:{{tableHeaderInfo.tfViewUnit}}
      </p>
      <p v-if="tableHeaderInfo.tfViewUnit">
        累计及初值:{{tableHeaderInfo.tfViewUnit}}
      </p>
      <p v-if="tableHeaderInfo.tfDesc">
        {{tableHeaderInfo.tfDesc}}
      </p>
    </div>
    <!-- 数据显示页面单位展示 -->
    <div v-if="showType == 2">
      <p v-if="tableHeaderInfo.tfViewUnit">
        单位:{{tableHeaderInfo.tfViewUnit}}
      </p>
    </div>
    <!-- 数据校验页面单位显示 -->
    <div v-if="showType == 3">
      <span v-if="tableHeaderInfo.tfViewUnit || tableHeaderInfo.tfTdUnit">单位: </span>
      <p v-if="tableHeaderInfo.tfViewUnit == tableHeaderInfo.tfTdUnit">
        td,tv: {{tableHeaderInfo.tfViewUnit}}
      </p>
      <p v-else>
        <span v-if="tableHeaderInfo.tfTdUnit">
          td: {{ tableHeaderInfo.tfTdUnit }}, 
        </span>
        <span v-if="tableHeaderInfo.tfViewUnit">
          tv: {{ tableHeaderInfo.tfViewUnit }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
  import { getAction, httpAction } from '@/api/manage'
  export default {
    name: 'TableHeaderUnitInfo',
    props: {
      tfSensorDataTypeCode: {
        type: String,
        default: ''
      },
      showType: { // 1 传感器安装 2 数据展示 3 数据检验
        type: Number,
        default: 1,
      }
    },
    data() {
      return {
        tableHeaderInfo: {}, //表格头部信息展示
      }
    },
    watch: {
      tfSensorDataTypeCode: function(value) {
        if (value) {
          this.getDataTypeCodeOhterInfo(value)
        } else {
          this.tableHeaderInfo = ''
        }
      }
    },
    created() {
      this.getDataTypeCodeOhterInfo(this.tfSensorDataTypeCode)
    },
    methods: {
      // 获取当前参数显示单位
      getDataTypeCodeOhterInfo(tfSensorDataTypeCode) {
        let params = {tfCode: tfSensorDataTypeCode}
        getAction('sensor_data_type_manager/tdicSensorDataType/list',params).then((res)=>{
          if(res.success){
            const data = res.result.records[0]
            this.tableHeaderInfo = data
          }else{
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.table-header-info {
  text-align: right;
  p {
    margin: 2px 0;
    display: inline-block;
    color:rgba(0,0,0,.45);
    &::after {
      content: ';';
      padding-right: 2px;
    }
    span.comma-partition {
      &::after {
        content: ',';
      }
    }
    span:last-child {
      &::after {
        content: '';
      }
    }
  }
  p:last-child {
    &::after {
      content: '';
    }
  }
  span {
    color:rgba(0,0,0,.45);
  }
}
</style>