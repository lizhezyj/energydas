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

        <a-form-item label="采集时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择采集时间" v-decorator="[ 'createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfProjectFkId']" :trigger-change="true" dictCode="tb_project,tf_project_name,id" placeholder="请选择项目"/>
        </a-form-item>
          
        <a-form-item label="工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfAreaFkId']" :trigger-change="true" dictCode="tb_area,tf_name,id" placeholder="请选择工程部位"/>
        </a-form-item>
          
        <a-form-item label="采集器" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfCollecterPointerFkId']" :trigger-change="true" dictCode="tb_collecter_pointer,tf_code,id" placeholder="请选择采集器"/>
        </a-form-item>
          
        <a-form-item label="采集器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfCollecterProductCode']" :trigger-change="true" dictCode="tb_collecter,tf_code,tf_code" placeholder="请选择采集器编号"/>
        </a-form-item>
          
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfState', validatorRules.tfState]" placeholder="请输入状态" style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="电量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfElectricity', validatorRules.tfElectricity]" placeholder="请输入电量"></a-input>
        </a-form-item>
          
        <a-form-item label="温度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfTemp', validatorRules.tfTemp]" placeholder="请输入温度"></a-input>
        </a-form-item>
          
        <a-form-item label="报警类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfAlarmtype', validatorRules.tfAlarmtype]" placeholder="请输入报警类型"></a-input>
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
    name: "TbDeviceAlarmModal",
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
        createTime:{},
        tfProjectFkId:{},
        tfAreaFkId:{},
        tfCollecterPointerFkId:{},
        tfCollecterProductCode:{},
        tfState:{},
        tfElectricity:{},
        tfTemp:{},
        tfAlarmtype:{},
        },
        url: {
          add: "/device_alarm_manager/tbDeviceAlarm/add",
          edit: "/device_alarm_manager/tbDeviceAlarm/edit",
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
          this.form.setFieldsValue(pick(this.model,'createTime','tfProjectFkId','tfAreaFkId','tfCollecterPointerFkId','tfCollecterProductCode','tfState','tfElectricity','tfTemp','tfAlarmtype'))
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
        this.form.setFieldsValue(pick(row,'createTime','tfProjectFkId','tfAreaFkId','tfCollecterPointerFkId','tfCollecterProductCode','tfState','tfElectricity','tfTemp','tfAlarmtype'))
      }
      
    }
  }
</script>