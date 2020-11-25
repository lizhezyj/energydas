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

        <a-form-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tf_project_fk_id']" :trigger-change="true" dictCode="tb_project,tf_project_name,id" placeholder="请选择项目"/>
        </a-form-item>
          
        <a-form-item label="工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tf_area_fk_id']" :trigger-change="true" dictCode="tb_area,tf_code,id" placeholder="请选择工程部位"/>
        </a-form-item>
          
        <a-form-item label="参数类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tf_senser_data_type_code']" :trigger-change="true" dictCode="tdic_sensor_data_type,tf_name,tf_code" placeholder="请选择参数类型"/>
        </a-form-item>
          
        <a-form-item label="time" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择time" v-decorator="[ 'create_time', validatorRules.createTime]" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="采集器编号id" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tf_collecter_pointer_fk_id']" :trigger-change="true" dictCode="tb_collecter_pointer,tf_collecter_product_code,id" placeholder="请选择采集器编号id"/>
        </a-form-item>
          
        <a-form-item label="采集器硬件编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tf_collecter_product_code']" :trigger-change="true" dictCode="tb_collecter_pointer,tf_collecter_product_code,tf_collecter_product_code" placeholder="请选择采集器硬件编号"/>
        </a-form-item>
          
        <a-form-item label="查验状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tf_checked', validatorRules.tfChecked]" placeholder="请输入查验状态" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="补数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfIsVirtualData', validatorRules.tfIsVirtualData]" placeholder="请输入补数" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td1', validatorRules.td1]" placeholder="请输入t1" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv1', validatorRules.tv1]" placeholder="请输入v1" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td2', validatorRules.td2]" placeholder="请输入t2" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv2', validatorRules.tv2]" placeholder="请输入v2" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td3', validatorRules.td3]" placeholder="请输入t3" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv3', validatorRules.tv3]" placeholder="请输入v3" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t4" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td4', validatorRules.td4]" placeholder="请输入t4" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v4" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv4', validatorRules.tv4]" placeholder="请输入v4" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d5" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td5', validatorRules.td5]" placeholder="请输入d5" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v5" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv5', validatorRules.tv5]" placeholder="请输入v5" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d6" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td6', validatorRules.td6]" placeholder="请输入d6" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v6" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv6', validatorRules.tv6]" placeholder="请输入v6" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d7" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td7', validatorRules.td7]" placeholder="请输入d7" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v7" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv7', validatorRules.tv7]" placeholder="请输入v7" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d8" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td8', validatorRules.td8]" placeholder="请输入d8" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v8" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv8', validatorRules.tv8]" placeholder="请输入v8" style="width: 100%"/>
        </a-form-item>

        <a-form-item label="t9" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td9', validatorRules.td9]" placeholder="请输入t9" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v9" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv9', validatorRules.tv9]" placeholder="请输入v9" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t10" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td10', validatorRules.td10]" placeholder="请输入t10" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v10" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv10', validatorRules.tv10]" placeholder="请输入v10" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t11" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td11', validatorRules.td11]" placeholder="请输入t11" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v11" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv11', validatorRules.tv11]" placeholder="请输入v11" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="t12" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td12', validatorRules.td12]" placeholder="请输入t12" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v12" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv12', validatorRules.tv12]" placeholder="请输入v12" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d13" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td13', validatorRules.td13]" placeholder="请输入d13" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v13" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv13', validatorRules.tv13]" placeholder="请输入v13" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d14" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td14', validatorRules.td14]" placeholder="请输入d14" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v14" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv14', validatorRules.tv14]" placeholder="请输入v14" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d15" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td15', validatorRules.td15]" placeholder="请输入d15" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v15" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv15', validatorRules.tv15]" placeholder="请输入v15" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="d16" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'td16', validatorRules.td16]" placeholder="请输入d16" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="v16" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tv16', validatorRules.tv16]" placeholder="请输入v16" style="width: 100%"/>
        </a-form-item>
          
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "ViewDataCheckedModal",
    components: { 
      JDate,
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
          tfProjectFkId:{rules: [{ required: true, message: '请输入项目!' }]},
          tfAreaFkId:{rules: [{ required: true, message: '请输入工程部位!' }]},
          tfSenserDataTypeCode:{rules: [{ required: true, message: '请输入参数类型!' }]},
          createTime:{rules: [{ required: true, message: '请输入time!' }]},
          tfCollecterPointerFkId:{rules: [{ required: true, message: '请输入采集器编号id!' }]},
          tfCollecterProductCode:{rules: [{ required: true, message: '请输入采集器硬件编号!' }]},
          tfChecked:{},
          tfIsVirtualData:{},
          td1:{},
          tv1:{},
          td2:{},
          tv2:{},
          td3:{},
          tv3:{},
          td4:{},
          tv4:{},
          td5:{},
          tv5:{},
          td6:{},
          tv6:{},
          td7:{},
          tv7:{},
          td8:{},
          tv8:{},
          td9:{},
          tv9:{},
          td10:{},
          tv10:{},
          td11:{},
          tv11:{},
          td12:{},
          tv12:{},
          td13:{},
          tv13:{},
          td14:{},
          tv14:{},
          td14:{},
          tv14:{},
          td16:{},
          tv16:{},
        },
        url: {
          add: "/view_data_checked/viewDataChecked/add",
          edit: "/view_data_checked/viewDataChecked/edit",
        }
     
      }
    },
    created () {
      this.tv1 = Math.floor(Math.random() * (100 - 1)) + 1
      console.log(this.tv1)
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
          this.form.setFieldsValue(pick(this.model,'tf_project_fk_id','tf_area_fk_id','tf_senser_data_type_code','create_time','tf_collecter_pointer_fk_id','tf_collecter_product_code','tf_checked','tf_is_virtual_data','td1','tv1','td2','tv2','td3','tv3','td4','tv4','td5','tv5','td6','tv6','td7','tv7','td8','tv8','td9','tv9','td10','tv10', ))
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
            for (var i in formData) {
              if (i.indexOf('tv') > -1) formData[i] = Math.floor(Math.random() * (100 - 1)) + 1
              if (i.indexOf('td') > -1) formData[i] = Math.floor(Math.random() * (100 - 1)) + 1
            }
            console.log("表单提交数据",formData)
            // that.confirmLoading = false;
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
        this.form.setFieldsValue(pick(row,'tf_project_fk_id','tf_area_fk_id','tf_senser_data_type_code','create_time','tf_collecter_pointer_fk_id','tf_collecter_product_code','tf_checked','tf_is_virtual_data','td1','tv1','td2','tv2','td3','tv3','td4','tv4','td5','tv5','td6','tv6','td7','tv7','td8','tv8'))
      }
      
    }
  }
</script>