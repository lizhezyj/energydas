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

        <a-form-item label="参数类型编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfDataTypeCode']" :trigger-change="true" dictCode="tdic_sensor_data_type,tf_code,tf_code" placeholder="请选择参数类型编号"/>
        </a-form-item>
          
        <a-form-item label="参数类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfDataTypeName']" :trigger-change="true" dictCode="tdic_sensor_data_type,tf_name,tf_name" placeholder="请选择参数类型名称"/>
        </a-form-item>
          
        <a-form-item label="设备型号名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfProductTypeName', validatorRules.tfProductTypeName]" placeholder="请输入设备型号名称"></a-input>
        </a-form-item>
          
        <a-form-item label="数据公式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfFormula', validatorRules.tfFormula]" placeholder="请输入数据公式"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数1名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP1Name', validatorRules.tfP1Name]" placeholder="请输入计算参数1名称"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数2名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP2Name', validatorRules.tfP2Name]" placeholder="请输入计算参数2名称"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数3名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP3Name', validatorRules.tfP3Name]" placeholder="请输入计算参数3名称"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数4名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP4Name', validatorRules.tfP4Name]" placeholder="请输入计算参数4名称"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数5名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP5Name', validatorRules.tfP5Name]" placeholder="请输入计算参数5名称"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数6名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP6Name', validatorRules.tfP6Name]" placeholder="请输入计算参数6名称"></a-input>
        </a-form-item>
          
        <a-form-item label="设备型号编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfProductTypeCode', validatorRules.tfProductTypeCode]" placeholder="请输入设备型号编码"></a-input>
        </a-form-item>
          
        <a-form-item label="系数1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfP1', validatorRules.tfP1]" placeholder="请输入系数1" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="系数2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfP2', validatorRules.tfP2]" placeholder="请输入系数2" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="系数3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfP3', validatorRules.tfP3]" placeholder="请输入系数3" style="width: 100%"/>
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
    name: "TdicSensorTypeModal",
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
        tfDataTypeCode:{rules: [{ required: true, message: '请输入参数类型编号!' }]},
        tfDataTypeName:{},
        tfProductTypeName:{},
        tfFormula:{},
        tfP1Name:{},
        tfP2Name:{},
        tfP3Name:{},
        tfP4Name:{},
        tfP5Name:{},
        tfP6Name:{},
        tfProductTypeCode:{},
        tfP1:{},
        tfP2:{},
        tfP3:{},
        },
        url: {
          add: "/tdic_sensor_type/tdicSensorType/add",
          edit: "/tdic_sensor_type/tdicSensorType/edit",
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
          this.form.setFieldsValue(pick(this.model,'tfDataTypeCode','tfDataTypeName','tfProductTypeName','tfFormula','tfP1Name','tfP2Name','tfP3Name','tfP4Name','tfP5Name','tfP6Name','tfProductTypeCode','tfP1','tfP2','tfP3'))
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
        this.form.setFieldsValue(pick(row,'tfDataTypeCode','tfDataTypeName','tfProductTypeName','tfFormula','tfP1Name','tfP2Name','tfP3Name','tfP4Name','tfP5Name','tfP6Name','tfProductTypeCode','tfP1','tfP2','tfP3'))
      }
      
    }
  }
</script>