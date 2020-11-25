<template>
  <a-range-picker
    style="width: 100%;"
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    v-model="momVal"
    :showTime="showTime"
    :ranges="ranges"
    :format="dateFormat"
    :getCalendarContainer="getCalendarContainer"
    :defaultPickerValue="defaultRangesValue"
    :defaultValue="defaultRangesValue"
  />
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'CRange',
    props: {
      placeholder:{
        type: Array,
        default: function() {
          return ['开始日期', '结束日期']
        },
        required: false
      },
      value:{
        type: Array,
        required: false
      },
      defaultRangesValue:{
        type: Array,
        required: false
      },
      dateFormat:{
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss',
        required: false
      },
      //此属性可以被废弃了
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      },
      readOnly:{
        type: Boolean,
        required: false,
        default: false
      },
      disabled:{
        type: Boolean,
        required: false,
        default: false
      },
      showTime:{
        type: Boolean,
        required: false,
        default: true
      },
      ranges: {
        // type: Array || Object,
        required: false,
      },
      getCalendarContainer: {
        type: Function,
        default: () => document.body
      }
    },
    data () {
      let dateArr = this.value;
      return {
        decorator:"",
        momVal:dateArr.length == 0?[]:[moment(dateArr[0],this.dateFormat),moment(dateArr[1],this.dateFormat)]
      }
    },
    watch: {
      value (valArr) {
        console.log(valArr)
        if(!valArr){
          this.momVal = []
        }else{
          this.momVal = []
          valArr.forEach(valItem => {
            if (valItem) {
              this.momVal.push(moment(valItem,this.dateFormat))
            } else {
              this.momVal = []
            }
          })
        }
      }
    },
    methods: {
      moment,
      handleDateChange(momArr,dateArr){
        this.$emit('change', dateArr);
      }
    },
    //2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
