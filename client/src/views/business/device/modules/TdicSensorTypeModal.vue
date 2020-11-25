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
          <j-dict-select-tag type="list" v-decorator="['tfDataTypeCode',validatorRules.tfDataTypeCode]" :trigger-change="true" @change="tbSensorDataTypeChangeHandle" dictCode="tdic_sensor_data_type,tf_code,tf_code" placeholder="请选择参数类型编号"/>
        </a-form-item>
          
        <a-form-item label="参数类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfDataTypeName',validatorRules.tfDataTypeName]" :trigger-change="true" @change="tbSensorDataNameChangeHandle" dictCode="tdic_sensor_data_type,tf_name,tf_name" placeholder="请选择参数类型名称"/>
        </a-form-item>
          
        <!-- <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfViewUnit', validatorRules.tfViewUnit]" placeholder="请输入单位"></a-input>
        </a-form-item> -->
          
        <a-form-item label="数据公式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfFormula', validatorRules.tfFormula]" placeholder="请输入数据公式"></a-input>
        </a-form-item>

        <!-- <a-form-item label="计算参数1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number 
            :step="0.0000000001" 
            v-decorator="[ 'tfP1', validatorRules.tf_p1]" 
            :formatter="limitDecimals" 
            :parser="limitDecimals" 
            placeholder="请输入计算参数1" 
            style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="计算参数2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number 
            :step="0.0000000001" 
            v-decorator="[ 'tfP2', validatorRules.tf_p2]" 
            :formatter="limitDecimals" 
            :parser="limitDecimals" 
            placeholder="请输入计算参数2" 
            style="width: 100%"/>
        </a-form-item>
          
        <a-form-item label="计算参数3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number 
            :step="0.0000000001" 
            v-decorator="[ 'tfP3', validatorRules.tf_p3]"
            :formatter="limitDecimals" 
            :parser="limitDecimals"  
            placeholder="请输入计算参数3" 
            style="width: 100%"/>
        </a-form-item> -->
          
        <!-- <a-form-item label="计算参数1名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfP1Name', validatorRules.tfP1Name]" placeholder="请输入计算参数1名称"></a-input>
        </a-form-item>
          
        <a-form-item label="计算参数2名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tf_p3Name', validatorRules.tfP2Name]" placeholder="请输入计算参数2名称"></a-input>
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
        </a-form-item> -->

        <a-form-item label="设备型号名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfProductTypeName', validatorRules.tfProductTypeName]" placeholder="请输入设备型号名称"></a-input>
        </a-form-item>

          
        <a-form-item label="设备型号编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfProductTypeCode', validatorRules.tfProductTypeCode]" placeholder="请输入设备型号编码"></a-input>
        </a-form-item>
          
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
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
          tfDataTypeName:{rules: [{ required: true, message: '请输入参数类型名称!' }]},
          tfProductTypeName:{rules: [{ required: true, message: '请输入设备型号名称!' }]},
          tfFormula:{},
          tfP1Name:{},
          tfP2Name:{},
          tfP3Name:{},
          tfP4Name:{},
          tfP5Name:{},
          tfP6Name:{},
          tfProductTypeCode:{rules: [{ required: true, message: '请输入设备型号编号!' }]},
        },
        url: {
          tbSensorDataTypelist: '/sensor_data_type_manager/tdicSensorDataType/list',
          add: "/sensor_type_manager/tdicSensorType/add",
          edit: "/sensor_type_manager/tdicSensorType/edit",
        },
        tbSensorDataTypeDataSource: '',
     
      }
    },
    created () {
      this.loadTbSensorDataTypeData()
    },
    watch: {
      
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
      // 参数类型选择，附带信息联动 start
      loadTbSensorDataTypeData() {
        getAction(this.url.tbSensorDataTypelist).then((res) => {
          if (res.success) {
            this.tbSensorDataTypeDataSource = res.result.records;
            if (this.$route.query) this.tbSensorDataTypeChangeHandle(this.model.tfDataTypeCode) // 默认选中的情况下，触发下拉联通
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
      },
      tbSensorDataTypeChangeHandle(val) {
        console.log(val)
        this.tbSensorDataTypeDataSource.forEach(item => {
          if (item.tfCode == val) {
            this.form.setFieldsValue({tfViewUnit:item.tfViewUnit, tfFormula:item.tfFormula, tfDataTypeName:item.tfName})
            console.log(this.form.getFieldsValue())
          }
        })
      },
      tbSensorDataNameChangeHandle(val) {
        console.log(val)
        this.tbSensorDataTypeDataSource.forEach(item => {
          if (item.tfName == val) {
            this.form.setFieldsValue({tfViewUnit:item.tfViewUnit, tfFormula:item.tfFormula, tfDataTypeCode:item.tfCode})
            console.log(this.form.getFieldsValue())
          }
        })
      },
      // end
      add () {
        // 传感器安装页面跳转过来，携带参数类型参数，默认选中
        if (this.$route.query) { 
          this.edit({
            tfDataTypeCode: this.$route.query.tfSensorDataTypeCode
          })
        } else {
          this.edit({});
        }
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tfDataTypeCode','tfDataTypeName','tfProductTypeName', 'tfFormula','tfP1Name','tfP2Name','tfP3Name','tfP4Name','tfP5Name','tfP6Name','tfProductTypeCode'))
          if (this.model.isLoadDataTypeChangeHandle) this.tbSensorDataTypeChangeHandle(this.model.tfDataTypeCode) //是否参数类型code关联选择，在采集器安装页面新增厂家型号用
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
              if (i == 'tfP1' || i == 'tfP2' || i == 'tfP3') {
                formData[i] = that.toNonExponential(formData[i])
              }
            }
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
        this.form.setFieldsValue(pick(row,'tfDataTypeCode','tfDataTypeName','tfProductTypeName', 'tfViewUnit', 'tfFormula', 'tfP1', 'tfP2', 'tfP3', 'tfP1Name','tfP2Name','tfP3Name','tfP4Name','tfP5Name','tfP6Name','tfProductTypeCode'))
      }
      
    }
  }
</script>