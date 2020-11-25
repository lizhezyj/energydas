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

        <!-- <a-form-item label="所属工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfAreaFkId', validatorRules.tfAreaFkId]" placeholder="请输入所属工程部位"></a-input>
        </a-form-item> -->

        <a-form-item label="所属项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" :disabled="true" v-decorator="['tfProjectFkId']" :trigger-change="true" @change="projectInputChangeHandle" :dictCode="`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${$store.getters.userInfo.username}'`" placeholder="请选择从属项目"/>
        </a-form-item>

        <a-form-item label="工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" :disabled="true" v-decorator="['tfAreaFkId', validatorRules.tfAreaFkId]" :trigger-change="true" :dictCode="dictCodes.tfAreaFkId" placeholder="请选择所属工程部位"/>
        </a-form-item>
          
        <a-form-item label="采集点编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfCode', validatorRules.tfCode]" placeholder="请按照cp****输入采集点编号"></a-input>
        </a-form-item>
          
        <a-form-item label="安装位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfPosition', validatorRules.tfPosition]" placeholder="请输入安装位置"></a-input>
        </a-form-item>
          
        <a-form-item label="采集器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <j-dict-select-tag type="list" v-decorator="['tfCollecterProductCode', validatorRules.tfCollecterProductCode]" :trigger-change="true" :dictCode="dictCodes.tfCollecterProductCode" placeholder="请选择采集器设备编号"/> -->
          <a-select
            showSearch
            placeholder="请选择采集器编号" 
            v-decorator="['tfCollecterProductCode', validatorRules.tfCollecterProductCode]"
            @change="handleTfCollecterSelectChange"
            >
            <a-select-option value="">无设备</a-select-option>
            <a-select-option v-for="(item, key) in tfCollecterSelectOptions" :key="key" :value="item.tfCode">
              <span style="display: inline-block;width: 100%" :title=" item.tfName ">
                {{ item.tfCode }}
              </span>
            </a-select-option>
          </a-select>
        </a-form-item>
          
        <a-form-item label="采集频率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="[ 'tfRate', validatorRules.tfRate]" placeholder="请输入采集频率" style="width: 100%"/>
        </a-form-item>
          
        <!-- <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfState', validatorRules.tfState]" placeholder="请输入状态"></a-input>
        </a-form-item> -->
          
        <a-form-item label=" 说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="textarea" v-decorator="[ 'tfDesc', validatorRules.tfDesc]" placeholder="请输入 说明"></a-input>
        </a-form-item>
          
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction, getAction, allHttpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "TbCollecterPointerModal",
    components: { 
    },
    props: {
      queryParam: {
        type: Object,
        required: true,
      },
      tfCollecterList: {
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
        tfAreaFkId:{rules: [{ required: true, message: '请选择所属工程部位!' }]},
        tfCode:{rules: [{ required: true, message: '请按照cp****输入安装位置编号!' }]},
        tfPosition:{},
        tfCollecterProductCode:{},
        tfRate:{},
        tfState:{},
        tfDesc:{},
        },
        url: {
          add: "/collecter_pointer_manager/tbCollecterPointer/add",
          edit: "/collecter_pointer_manager/tbCollecterPointer/edit",
          collecterList: "/collecter_manager/tbCollecter/list", //采集器列表
          collecterEdit: "/collecter_manager/tbCollecter/edit", //修改采集器编号信息时，更新对应的采集设备状态（在用-->在库 、在库-->在用）
        },
        dictCodes: {
          tfAreaFkId: '',
          tfCollecterProductCode: 'tb_collecter,tf_name,tf_code,tf_state="instore"',
        },
        currentTfCollecterState: '', //记录当前选择采集器编号的采集器状态，提交时变更状态记录
      }
    },
    computed: {
      tfCollecterSelectOptions() {
        const arr = this.tfCollecterList
        let resArr = []
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]['tfProjectFkId'] == this.queryParam.tfProjectFkId  && ['outstore', 'waitstore'].includes(arr[i]['tfState']) ) { //过滤当前项目，出库、待入库状态的采集器
            resArr.push(arr[i])
          }
        } 
        return resArr
      }
    },
    created () {
    },
    methods: {
      //采集器选择时
      handleTfCollecterSelectChange(val) {
        this.tfCollecterSelectOptions.forEach(item => {
          if (item.value = val) {
            console.log(item.tfState)
            this.currentTfCollecterState = item.tfState
          }
        })
      },
      //根据对象数组属性值过滤出唯一对象
      filterArrObj(arr, filterParams, filterParamsVal) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][filterParams] == filterParamsVal) {
            return arr[i]
          }
        } 
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.oldCollecterCode = this.model.tfCollecterProductCode; //保存旧的采集器code
        this.visible = true;
        this.$nextTick(() => {
          this.setDefaultParamsToFormFields();
          this.form.setFieldsValue(pick(this.model,'tfAreaFkId','tfCode','tfPosition','tfCollecterProductCode','tfRate','tfDesc'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields(async (err, values) => {
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
            var formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)

            /**
             * 修改采集器状态 start
             */
            console.log('修改前采集器code--' + this.oldCollecterCode)
            console.log('修改后采集器code--' + formData.tfCollecterProductCode)
            // 采集器变更时修改对应的采集器状态
            if (this.oldCollecterCode != formData.tfCollecterProductCode) { // 编辑前后采集器不同
              if (this.oldCollecterCode) { // 编辑前后采集器不同，且存在旧采集器，此时为编辑，需要更改两个采集器的状态
                let oldCollecterData = this.filterArrObj(this.tfCollecterList, 'tfCode', this.oldCollecterCode)
                oldCollecterData.tfState = 'waitstore' //替换下旧的采集设备待入库
                oldCollecterData.tfPrestate = 'working' //日志记录旧的状态
                oldCollecterData.tfDealMan = this.$store.getters.userInfo.username //记录操作人
                console.log('修改前采集器data--',oldCollecterData)
                
                
                const editOldColRes = await httpAction(this.url.collecterEdit,oldCollecterData,'put')
                if (editOldColRes.success) {
                  console.log('采集器--' + this.oldCollecterCode + '状态变更为 在库 ')
                } else {
                  console.log('采集器--' + this.oldCollecterCode + '状态变更失败')
                  that.$message.warning('采集器--' + this.oldCollecterCode + '状态变更失败');
                  that.confirmLoading = false;
                  that.close();
                  return
                }
              }
              // 编辑新选的采集器状态
              if (formData.tfCollecterProductCode) { // 新采集器选择无设备时,不需要编辑状态
                let newCollecterData = this.filterArrObj(this.tfCollecterList, 'tfCode', formData.tfCollecterProductCode)
                newCollecterData.tfState = 'working' //绑定新的设备设置为在用
                newCollecterData.tfPrestate = this.currentTfCollecterState //日志记录旧的状态
                newCollecterData.tfDealMan = this.$store.getters.userInfo.username //记录操作人
                console.log('修改后采集器data--',newCollecterData)
                const editNewColRes = await httpAction(this.url.collecterEdit,newCollecterData,'put')
                if (editNewColRes.success) {
                  console.log('采集器--' + this.oldCollecterCode + '状态变更为 在库 ')
                } else {
                  console.log('采集器--' + this.oldCollecterCode + '状态变更失败')
                  that.$message.warning('采集器--' + this.oldCollecterCode + '状态变更失败');
                  that.confirmLoading = false;
                  that.close();
                  return
                }
              }
              
            }
            
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

            /**
             * 修改采集器状态 end
             */

            
            
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'tfAreaFkId','tfCode','tfPosition','tfCollecterProductCode','tfRate','tfState','tfDesc'))
      },
      // 设置默认的参数到form表对应字段
      setDefaultParamsToFormFields() {
        console.log('st')
        this.form.resetFields()
        this.form.setFieldsValue({
          'tfProjectFkId': this.queryParam.tfProjectFkId,
          'tfAreaFkId': this.queryParam.tfAreaFkId,
        })

        this.projectInputChangeHandle('val', true)
      },
      // 选择项目过滤工程部位
      projectInputChangeHandle(val, isSetDefaultData) {
        console.log('st_pj')
        if (isSetDefaultData) {
          this.$set(this.dictCodes, 'tfAreaFkId', `tb_area,tf_code,id,tf_project_fk_id="${this.queryParam.tfProjectFkId}"`)
          this.form.setFieldsValue({'tfAreaFkId': this.queryParam.tfAreaFkId})
        } else {
          this.$set(this.dictCodes, 'tfAreaFkId', `tb_area,tf_code,id,tf_project_fk_id="${val}"`)
          this.form.setFieldsValue({'tfAreaFkId': ''})
        }
      },
    }
  }
</script>