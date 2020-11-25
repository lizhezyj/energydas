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

        <a-form-item label="地块" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag :disabled="true" type="list" v-decorator="['tfAreaFkId']" :trigger-change="true" dictCode="tb_area,tf_code,id" placeholder="请选择地块"/>
        </a-form-item>
          
        <a-form-item label="参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfDataTypeCode']" :trigger-change="true" dictCode="tdic_sensor_data_type,tf_name,tf_code" placeholder="请选择参数"/>
        </a-form-item>
          
        <a-form-item label="安装数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfMaxNum', validatorRules.tfMaxNum]" placeholder="请输入安装数量"></a-input>
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
    name: "TbAreaDataTypeModal",
    components: { 
      JDictSelectTag,
    },
    props: {
      queryParam: {
        type: Object,
      }
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
        tfAreaFkId:{},
        tfDataTypeCode:{},
        tfMaxNum:{},
        },
        url: {
          add: "/area_data_type_manager/tbAreaDataType/add",
          edit: "/area_data_type_manager/tbAreaDataType/edit",
        }
     
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({tfAreaFkId: this.queryParam.tfAreaFkId, tfDataTypeCode: this.queryParam.tfDataTypeCode});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tfAreaFkId','tfDataTypeCode','tfMaxNum'))
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
        this.form.setFieldsValue(pick(row,'tfAreaFkId','tfDataTypeCode','tfMaxNum'))
      }
      
    }
  }
</script>