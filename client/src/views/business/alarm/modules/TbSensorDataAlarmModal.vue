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
      <a-form :form="form">

        <a-form-item label="从属工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfAreaFkId']" :trigger-change="true" dictCode="view_area,tf_code,id" placeholder="请选择从属工程部位"/>
        </a-form-item>
          
        <a-form-item label="采集器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfCollecterPointerFkId']" :trigger-change="true" dictCode="tb_collecter_pointer,tf_collecter_product_code,id" placeholder="请选择采集器编号"/>
        </a-form-item>
          
        <a-form-item label="通道号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfCollecterChannelCode', validatorRules.tfCollecterChannelCode]" placeholder="请输入通道号" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="传感器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfSensorProductCode', validatorRules.tfSensorProductCode]" placeholder="请输入传感器编号"></a-input>
        </a-form-item>
          
        <a-form-item label="采集器线分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfLineCode', validatorRules.tfLineCode]" placeholder="请输入采集器线分类"></a-input>
        </a-form-item>
          
        <a-form-item label="报警上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfUpAlert', validatorRules.tfUpAlert]" placeholder="请输入报警上限" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="报警下限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfDownAlert', validatorRules.tfDownAlert]" placeholder="请输入报警下线" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="报警斜率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfSlopeAlert', validatorRules.tfSlopeAlert]" placeholder="请输入报警斜率" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="报警累计" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfTotalAlert', validatorRules.tfTotalAlert]" placeholder="请输入报警累计" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="累计初始值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfTotalAlertInitVal', validatorRules.tfTotalAlertInitVal]" placeholder="请输入累计初始值" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="上次数据" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfPreVal', validatorRules.tfPreVal]" placeholder="请输入上次数据" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="本次" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfVal', validatorRules.tfVal]" placeholder="请输入本次" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="斜率值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfSlopeVal', validatorRules.tfSlopeVal]" placeholder="请输入斜率值" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="报警类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfAlarmType', validatorRules.tfAlarmType]" placeholder="请输入报警类型"></a-input>
        </a-form-item>
          
        <a-form-item label="线缆分类通道号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfLineNumber', validatorRules.tfLineNumber]" placeholder="请输入线缆分类通道号" style="width: 100%"/>
        </a-form-item>
          
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "TbSensorDataAlarmModal",
    components: { 
      JDictSelectTag,
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
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
        tfAreaFkId:{rules: [{ required: true, message: '请输入从属工程部位!' }]},
        tfCollecterPointerFkId:{rules: [{ required: true, message: '请输入采集器编号!' }]},
        tfCollecterChannelCode:{rules: [{ required: true, message: '请输入通道号!' }]},
        tfSensorProductCode:{rules: [{ required: true, message: '请输入传感器编号!' }]},
        tfLineCode:{},
        tfUpAlert:{},
        tfDownAlert:{},
        tfSlopeAlert:{},
        tfTotalAlert:{},
        tfTotalAlertInitVal:{},
        tfPreVal:{},
        tfVal:{},
        tfSlopeVal:{},
        tfAlarmType:{},
        tfLineNumber:{},
        },
        url: {
          add: "/sensor_data_alarm_manager/tbSensorDataAlarm/add",
          edit: "/sensor_data_alarm_manager/tbSensorDataAlarm/edit",
        }
     
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tfAreaFkId','tfCollecterPointerFkId','tfCollecterChannelCode','tfSensorProductCode','tfLineCode','tfUpAlert','tfDownAlert','tfSlopeAlert','tfTotalAlert','tfTotalAlertInitVal','tfPreVal','tfVal','tfSlopeVal','tfAlarmType','tfLineNumber'))
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
        this.form.setFieldsValue(pick(row,'tfAreaFkId','tfCollecterPointerFkId','tfCollecterChannelCode','tfSensorProductCode','tfLineCode','tfUpAlert','tfDownAlert','tfSlopeAlert','tfTotalAlert','tfTotalAlertInitVal','tfPreVal','tfVal','tfSlopeVal','tfAlarmType','tfLineNumber'))
      }
      
    }
  }
</script>