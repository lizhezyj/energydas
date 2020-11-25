<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag 
            type="list"
            :showSearch="true"
            @search="handleTfNameSearch"
            v-decorator="['tfName', validatorRules.tfName]" 
            :trigger-change="true" 
            dictCode="dic_collecter_name" 
            placeholder="请输入或选择名称"/>
        </a-form-item>
          
        <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfCode', validatorRules.tfCode]" placeholder="请输入编号"></a-input>
        </a-form-item>
          
        <a-form-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfDesc', validatorRules.tfDesc]" placeholder="请输入说明"></a-input>
        </a-form-item>
          
        <a-form-item label="型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag 
            type="list" 
            :showSearch="true"
            @search="handleTfTypeSearch"
            v-decorator="['tfType', validatorRules.tfType]" 
            :trigger-change="true" 
            dictCode="dic_collecter_type" 
            placeholder="请输入或选择型号"/>
        </a-form-item>
          
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <j-dict-select-tag :disabled="title == '新增'" type="list" v-decorator="['tfState', validatorRules.tfState]" :trigger-change="true" dictCode="dic_colleter_state" placeholder="请选择状态"/> -->
          <a-select 
            :disabled="model.tfState == 'worthless' || model.tfState == 'working'" 
            placeholder="请选择状态" 
            v-decorator="['tfState', validatorRules.tfState]"
            @change="handleTfStateSelectChange">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="(item, key) in sortedTfStateSelectOptions" :key="key" :value="item.value">
              <span style="display: inline-block;width: 100%" :title=" item.text || item.label ">
                {{ item.text || item.label }}
              </span>
            </a-select-option>
          </a-select>
          <p v-if="tfStateSelectTip" style="color: #f5222d;">设置为报废状态后将无法修改其状态！</p>
        </a-form-item>

        <a-form-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag :disabled="model.tfState == 'working'"  :showSearch="true" type="list" v-decorator="['tfProjectFkId', tfProjectFkIdValidatorRules]" :trigger-change="true" dictCode="tb_project,tf_project_name,id,tf_state='run'--or--tf_state='debug'" placeholder="请选择项目"/> 
        </a-form-item>

        <a-form-item label="经手人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :disabled="model.tfState == 'working'"  v-decorator="[ 'tfDealMan', tfDealManValidatorRules]" placeholder="请输入经手人"></a-input>
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
    name: "TbCollecterModal",
    components: { 
      JDictSelectTag,
    },
    props: {
      tfStateSelectOptions: {
        type: Array,
        required: true,
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
          tfName:{},
          tfCode:{rules: [{ required: true, pattern: '^BP[0-9]{6}$', message: '请输入正确编号格式,BP加六位数字!' }]},
          tfDesc:{},
          tfType:{},
          tfState:{rules: [{ required: true, message: '请输入编号!' }]},
        },
        tfProjectFkIdRequired: false,
        tfDealManRequired: false,
        url: {
          add: "/collecter_manager/tbCollecter/add",
          edit: "/collecter_manager/tbCollecter/edit",
        },
        sortedTfStateSelectOptions: [],
        tfState: '',
        tfPrestate: '',
        tfStateSelectTip: false,
      }
    },
    computed: {
      // 项目必填控制
      tfProjectFkIdValidatorRules() {
        return {
          rules: [{ required: this.tfProjectFkIdRequired, message: '请选择项目!' }]
        }
      },
      tfDealManValidatorRules() {
        return {
          rules: [{ required: this.tfDealManRequired, message: '请选择经手人!' }]
        }
      },
    },
    created () {
    },
    methods: {
      // selcet 绑定搜索输入事件,手动将数值绑定到 formitem 上,实现简单的选择和输入
      handleTfNameSearch(val) {
        this.form.setFieldsValue({'tfName': val})
      },
      handleTfTypeSearch(val) {
        this.form.setFieldsValue({'tfType': val})
      },
      handleTfStateSelectChange(value) {
        this.tfProjectFkIdRequired = false
        this.tfDealManRequired = false
        this.tfStateSelectTip = false
        if (value == 'worthless') { //报废状态提示
          this.tfStateSelectTip = true
        }
        if (this.tfPrestate == 'instore' && ['outstore', 'repair', 'worthless'].includes(value)) { //在库改 出库、维修、报废状态项目不能为空，经手人不能为空
          this.tfProjectFkIdRequired = true
          this.tfDealManRequired = true
        }
        if (this.tfPrestate == 'repair' && value == 'instore') { //维修改在库经手人不能为空
          this.tfDealManRequired = true
        }
        if (this.tfPrestate == 'waitstore' && ['instore', 'repair', 'worthless'].includes(value)) { //待入库的可以改为在库、维修、报废（经手人不能为空）
          this.tfDealManRequired = true
        }
        if (this.tfPrestate == 'working') {
          this.tfProjectFkIdRequired = true
          this.tfDealManRequired = true
        }
      },
      add () {
        this.edit({'tfDealMan': this.$store.getters.userInfo.username}); // 新增是默认设置经手人为当前登录账号
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);

        this.tfPrestate = this.model.tfState
        this.handleTfStateSelectChange(this.model.tfState) //设置状态
        
        //编辑不同状态的设备时动态配置可选状态  instore在库working在用worthless报废repair维修
        switch (this.model.tfState) {
          case ('instore'):
            this.sortedTfStateSelectOptions = this.tfStateSelectOptions.filter(item => item.value != 'working')
            break
          case ('repair'):
            this.sortedTfStateSelectOptions = this.tfStateSelectOptions.filter(item => ['instore','repair'].includes(item.value))
            break
          case ('outstore'):
            this.sortedTfStateSelectOptions = this.tfStateSelectOptions.filter(item => item.value != 'working')
            break
          case ('waitstore'):
            this.sortedTfStateSelectOptions = this.tfStateSelectOptions.filter(item => !['working','outstore'].includes(item.value))
            break
          default:
            this.sortedTfStateSelectOptions = this.tfStateSelectOptions
        }

        this.tfStateSelectTip = this.model.tfState == 'worthless' ? true : false

        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tfName','tfCode','tfDesc','tfType','tfState','tfProjectFkId','tfDealMan'))
          // 新增时默认状态为‘在库’
          if(this.title == '新增') this.form.setFieldsValue({'tfState': 'instore'})
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
          console.log(values)
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
            if(that.model.id) {
              formData.tfPrestate = that.tfPrestate; // 编辑采集器时传入之前的采集器状态
            } else {
              // formData.preTfState = ''
            }
            // formData.tfDealMan = this.$store.getters.userInfo.username
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
        this.form.setFieldsValue(pick(row,'tfName','tfCode','tfDesc','tfType','tfState'))
      }
      
    }
  }
</script>