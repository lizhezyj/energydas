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

        <a-form-item label="参数编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfCode', validatorRules.tfCode]" placeholder="请输入参数编号"></a-input>
        </a-form-item>
          
        <a-form-item label="参数名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfName', validatorRules.tfName]" placeholder="请输入参数名称"></a-input>
        </a-form-item>
          
        <a-form-item label="展示数据单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfViewUnit', validatorRules.tfViewUnit]" placeholder="请输入展示数据单位"></a-input>
        </a-form-item>
          
        <a-form-item label="公式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfFormula', validatorRules.tfFormula]" placeholder="请输入公式"></a-input>
        </a-form-item>

        <a-form-item label="ζ1单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP1Unit', validatorRules.tfP1Unit]" placeholder="请输入ζ1单位"></a-input>
        </a-form-item>

        <a-form-item label="ζ2单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP2Unit', validatorRules.tfP2Unit]" placeholder="请输入ζ2单位"></a-input>
        </a-form-item>

        <a-form-item label="ζ3单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP3Unit', validatorRules.tfP3Unit]" placeholder="请输入ζ3单位"></a-input>
        </a-form-item>

        <a-form-item label="ζ4单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP4Unit', validatorRules.tfP4Unit]" placeholder="请输入ζ4单位"></a-input>
        </a-form-item>

        <a-form-item label="ζ5单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP5Unit', validatorRules.tfP5Unit]" placeholder="请输入ζ5单位"></a-input>
        </a-form-item>

        <a-form-item label="ζ6单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP6Unit', validatorRules.tfP6Unit]" placeholder="请输入ζ6单位"></a-input>
        </a-form-item>
          
        <a-form-item label="斜率单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfSlopeUnit', validatorRules.tfSlopeUnit]" placeholder="请输入斜率单位"></a-input>
        </a-form-item>

        <a-form-item label="采集数据单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfTdUnit', validatorRules.tfTdUnit]" placeholder="请输入采集数据单位"></a-input>
        </a-form-item>

        <a-form-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfDesc', validatorRules.tfDesc]" placeholder="请输入说明"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  
  export default {
    name: "TdicSensorDataTypeModal",
    components: { 
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
        tfCode:{},
        tfName:{},
        tfViewUnit:{},
        tfFormula:{},
        },
        url: {
          add: "/sensor_data_type_manager/tdicSensorDataType/add",
          edit: "/sensor_data_type_manager/tdicSensorDataType/edit",
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
          this.form.setFieldsValue(pick(this.model,'tfCode','tfName','tfViewUnit','tfFormula','tfSlopeUnit','tfTdUnit', 'tfP1Unit', 'tfP2Unit', 'tfP3Unit', 'tfP4Unit', 'tfP5Unit', 'tfP6Unit', 'tfDesc'))
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
        this.form.setFieldsValue(pick(row,'tfCode','tfName','tfViewUnit','tfFormula'))
      }
      
    }
  }
</script>