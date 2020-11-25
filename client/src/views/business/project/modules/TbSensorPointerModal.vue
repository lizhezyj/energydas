<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <table-header-unit-info :tfSensorDataTypeCode="queryParam.tfSensorDataTypeCode" />

      <a-form :form="form">

        <p class="form-block-title">基本信息</p>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item label="从属项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag :disabled="true" type="list" v-decorator="['tfProjectFkId']" :trigger-change="true" @change="projectInputChangeHandle" :dictCode="`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${$store.getters.userInfo.username}'`" placeholder="请选择从属项目"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="从属工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag :disabled="true" type="list" v-decorator="['tfAreaFkId', validatorRules.tfAreaFkId]" :trigger-change="true" @change="areaInputChangeHandle" :dictCode="dictCodes.tfAreaFkId" placeholder="请选择从属工程部位"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="采集器" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <j-dict-select-tag type="list" v-decorator="['tfCollecterPointerFkId']" :trigger-change="true" dictCode="tb_collecter_pointer,tf_collecter_product_code,id" placeholder="请选择连接采集器设备"/> -->
              <j-dict-select-tag :disabled="true" type="list" v-decorator="['tfCollecterPointerFkId', validatorRules.tfCollecterPointerFkId]" :trigger-change="true" :dictCode="dictCodes.tfCollecterPointerFkId" placeholder="请选择连接采集器设备"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="参数编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag :disabled="true" type="list" v-decorator="['tfSensorDataTypeCode', validatorRules.tfSensorDataTypeCode]" :trigger-change="true" dictCode="st_all_sensor_data_type,tf_data_type_name,tf_data_type_code" placeholder="请选择参数编号"/>
            </a-form-item>
          </a-col>
        </a-row>

        <p class="form-block-title">传感器信息</p>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item label="传感器型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['tfSensorProductTypeCode', validatorRules.tfSensorProductTypeCode]" @change="SensorProductTypeInputChangeHandle" :trigger-change="true" :dictCode="`tdic_sensor_type,tf_product_type_name,tf_product_type_code,tf_data_type_code='${queryParam.tfSensorDataTypeCode}'`" placeholder="请选择传感器型号"/>
              <!-- <j-search-select-tag v-decorator="['tfSensorProductTypeCode']" @change="SensorProductTypeInputChangeHandle" :async="false" :dictCode="`tdic_sensor_type,tf_product_type_name,tf_product_type_code,tf_data_type_code='${queryParam.tfSensorDataTypeCode}'`" placeholder="请选择厂家型号" /> -->
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="传感器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'tfSensorProductCode', validatorRules.tfSensorProductCode]" placeholder="请输入传感器编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="传感器名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'tfSensorName', validatorRules.tfSensorName]" placeholder="请输入传感器名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="通道号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'tfCollecterChannelCode', validatorRules.tfCollecterChannelCode]" placeholder="请输入通道号" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="传感器类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['tfLineCode', validatorRules.tfLineCode]" :trigger-change="true" dictCode="dic_sensor_type" placeholder="请输入传感器类型"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="安装位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="[ 'tfPosition', validatorRules.tfPosition]" placeholder="请输入安装位置"></a-input>
          </a-form-item>
          </a-col>
        </a-row>

        
        <p class="form-block-title">计算参数</p>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item label="ζ1" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                :step="0.0000000001" 
                v-decorator="[ 'tfP1', validatorRules.tfP1]" 
                :formatter="limitDecimals" 
                :parser="limitDecimals" 
                placeholder="请输入ζ1" 
                style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="ζ2" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number 
                :step="0.0000000001" 
                v-decorator="[ 'tfP2', validatorRules.tfP2]" 
                :formatter="limitDecimals" 
                :parser="limitDecimals" 
                placeholder="请输入ζ2" 
                style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="ζ3" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number 
                :step="0.0000000001" 
                v-decorator="[ 'tfP3', validatorRules.tfP3]" 
                :formatter="limitDecimals" 
                :parser="limitDecimals" 
                placeholder="请输入ζ3" 
                style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="ζ4" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number 
                :step="0.0000000001" 
                v-decorator="[ 'tfP4', validatorRules.tfP4]" 
                :formatter="limitDecimals" 
                :parser="limitDecimals" 
                placeholder="请输入ζ4" 
                style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="ζ5" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number 
                :step="0.0000000001"
                v-decorator="[ 'tfP5', validatorRules.tfP5]" 
                :formatter="limitDecimals" 
                :parser="limitDecimals" 
                placeholder="请输入ζ5" 
                style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="ζ6" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number 
                :step="0.0000000001"
                v-decorator="[ 'tfP6', validatorRules.tfP6]" 
                :formatter="limitDecimals" 
                :parser="limitDecimals" 
                placeholder="请输入ζ6" 
                style="width: 100%"/>
            </a-form-item>
          </a-col>
        </a-row>

        <p class="form-block-title">报警参数</p>
        <a-row :gutter="24">
          <!-- <a-col :md="12" :sm="8">
            <a-form-item label="报警类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="[ 'tfAlertType', validatorRules.tfAlertType]" placeholder="请输入报警类型"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :md="12" :sm="8">
            <a-form-item label="报警上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'tfUpAlert', validatorRules.tfUpAlert]" placeholder="请输入报警上限" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="报警下限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'tfDownAlert', validatorRules.tfDownAlert]" placeholder="请输入报警下线" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="报警斜率" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'tfSlopeAlert', validatorRules.tfSlopeAlert]" placeholder="请输入报警斜率" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="报警累计" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'tfTotalAlert', validatorRules.tfTotalAlert]" placeholder="请输入报警累计" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="累计报警初始值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="[ 'tfTotalAlertInitVal', validatorRules.tfTotalAlertInitVal]" placeholder="请输入累计报警初始值" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
          </a-col>
        </a-row>
        
        <a-form-item label="参数名称" v-show="false" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <j-dict-select-tag type="list" v-decorator="['tfSensorDataTypeName']" :trigger-change="true" dictCode="st_all_sensor_data_type,tf_data_type_name,tf_data_type_name" placeholder="请选择参数名称"/> -->
        </a-form-item>
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { getAction, httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JSearchSelectTag from "@/components/dict/JSearchSelectTag"
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import TableHeaderUnitInfo from '@/views/business/modules/TableHeaderUnitInfo.vue'
  
  export default {
    name: "TbSensorPointerModal",
    components: { 
      JDictSelectTag,
      JSearchSelectTag,
      TableHeaderUnitInfo,
    },
    props: {
      queryParam: {
        string: Object,
        required: true,
      }
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:900,
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules:{
          tfAreaFkId:{},
          tfCollecterPointerFkId:{},
          tfSensorDataTypeCode:{},
          tfCollecterChannelCode:{rules: [{ required: true, message: '请输入通道号!' }]},
          tfSensorProductCode:{rules: [{ required: true, message: '请输入传感器编号!' }]},
          tfSensorProductTypeCode:{rules: [{ required: true, message: '请输入传感器型号!' }]},
          // tfSensorName:{rules: [{ required: true, message: '请输入传感器名称!' }]},
          tfPosition:{},
          tfLineCode:{rules: [{ required: true, message: '请输入传感器类型!' }]},
          // tfAlertType:{rules: [{ required: true, message: '请输入报警类型!' }]},
          tfUpAlert:{},
          tfDownAlert:{},
          tfSlopeAlert:{},
          tfTotalAlert:{},
          tfP1:{},
          tfP2:{},
          tfP3:{},
          tfP4:{},
          tfP5:{},
          tfP6:{},
          tfSensorDataTypeName:{},
          tfTotalAlertInitVal:{},
        },
        url: {
          add: "/sensor_pointer_manager/tbSensorPointer/add",
          edit: "/sensor_pointer_manager/tbSensorPointer/edit",
          tdicSensorTypeList: "/sensor_type_manager/tdicSensorType/list",
        },

        dictCodes: {
          // tfAreaFkId: 'view_area,tf_code,id'
          tfAreaFkId: '',
          tfCollecterPointerFkId: '',
        }

        
     
      }
    },
    watch: {
    },
    created () {
    },
    methods: {
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.setDefaultParamsToFormFields();
          this.form.setFieldsValue(pick(this.model,'tfAreaFkId','tfCollecterPointerFkId','tfSensorDataTypeCode','tfCollecterChannelCode','tfSensorProductCode','tfSensorProductTypeCode','tfPosition','tfLineCode','tfUpAlert','tfDownAlert','tfSlopeAlert','tfTotalAlert','tfP1','tfP2','tfP3','tfP4','tfP5','tfP6','tfSensorDataTypeName','tfTotalAlertInitVal', 'tfSensorName'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            // 将科学计数法转化为小数点计数
            for(var i in formData) {
              if (i == 'tfP1' || i == 'tfP2' || i == 'tfP3' || i == 'tfP4' || i == 'tfP5' || i == 'tfP6') {
                formData[i] = that.toNonExponential(formData[i])
              }
            }
            // 手动设置参数名称的值(这个参数需要的话)
            
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'tfAreaFkId','tfCollecterPointerFkId','tfSensorDataTypeCode','tfCollecterChannelCode','tfSensorProductCode','tfSensorProductTypeCode','tfPosition','tfLineCode','tfAlertType','tfUpAlert','tfDownAlert','tfSlopeAlert','tfTotalAlert','tfP1','tfP2','tfP3','tfP4','tfP5','tfP6','tfSensorDataTypeName','tfTotalAlertInitVal'))
      },

      // 设置默认的参数到form表对应字段
      setDefaultParamsToFormFields() {
        console.log('st')
        this.form.resetFields()
        this.form.setFieldsValue({
          'tfProjectFkId': this.queryParam.tfProjectFkId,
          'tfAreaFkId': this.queryParam.tfAreaFkId,
          'tfCollecterPointerFkId': this.queryParam.tfCollecterPointerFkId,
          'tfSensorDataTypeCode': this.queryParam.tfSensorDataTypeCode,
        })

        this.projectInputChangeHandle('val', true)
        this.areaInputChangeHandle('val', true)
      },
      // 选择项目过滤工程部位
      projectInputChangeHandle(val, isSetDefaultData) {
        console.log('st_pj')
        // this.$set(this.dictCodes, 'tfAreaFkId', `tb_area,tf_code,id,tf_project_fk_id="${this.queryParam.tfProjectFkId}"`)
        // this.form.setFieldsValue({'tfAreaFkId': this.queryParam.tfAreaFkId})
        if (isSetDefaultData) {
          this.$set(this.dictCodes, 'tfAreaFkId', `tb_area,tf_code,id,tf_project_fk_id="${this.queryParam.tfProjectFkId}"`)
          this.form.setFieldsValue({'tfAreaFkId': this.queryParam.tfAreaFkId})
        } else {
          this.$set(this.dictCodes, 'tfAreaFkId', `tb_area,tf_code,id,tf_project_fk_id="${val}"`)
          this.form.setFieldsValue({'tfAreaFkId': ''})
        }
      },
      // 根据工程部位过滤采集器编号（采集器设备）
      areaInputChangeHandle (val, isSetDefaultData) {
        if (isSetDefaultData) {
          this.$set(this.dictCodes, 'tfCollecterPointerFkId', `tb_collecter_pointer,tf_collecter_product_code,id,tf_area_fk_id="${this.queryParam.tfAreaFkId}"`)
          this.form.setFieldsValue({'tfCollecterPointerFkId': this.queryParam.tfCollecterPointerFkId})
        } else {
          this.$set(this.dictCodes, 'tfCollecterPointerFkId', `tb_collecter_pointer,tf_collecter_product_code,id,tf_area_fk_id="${val}"`)
          this.form.setFieldsValue({'tfCollecterPointerFkId': ''})
        }
      },
      // 选择厂家型号设置对应的系数
      SensorProductTypeInputChangeHandle(val) {
        if (!val) {
          this.form.setFieldsValue({
            'tfP1': null,
            'tfP2': null,
            'tfP3': null,
          })
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
            this.form.setFieldsValue({
              'tfP1': SensorProductTypeData.tfP1 ? SensorProductTypeData.tfP1 : null,
              'tfP2': SensorProductTypeData.tfP2 ? SensorProductTypeData.tfP2 : null,
              'tfP3': SensorProductTypeData.tfP3 ? SensorProductTypeData.tfP3 : null,
            })
          }
        })
      }
      
    }
  }
</script>

<style lang="scss" scoped>

.form-block-title {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}
  
</style>