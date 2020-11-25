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

        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-user-by-dep v-decorator="['tfUserFkId']" :trigger-change="true"/>
        </a-form-item>
          
        <a-form-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfProjectFkId']" :trigger-change="true" :dictCode="`st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id='${this.$store.getters.userInfo.username}'`" placeholder="请选择项目"/>
        </a-form-item>
          
        <a-form-item label="证书编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfCertificateNo', validatorRules.tfCertificateNo]" placeholder="请输入证书编号"></a-input>
        </a-form-item>

        <a-form-item label="职称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfTitle']" :trigger-change="true" dictCode="dic_title" placeholder="请输入职称"/>
        </a-form-item>

        <a-form-item label="工作内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfWorkDesc', validatorRules.tfWorkDesc]" placeholder="请输入工作内容"></a-input>
        </a-form-item>

        <a-form-item label="人员角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['tfSysRoleCode']" :trigger-change="true" dictCode="sys_role,role_name,role_code" placeholder="请选择人员角色"/>
        </a-form-item>

        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'tfMemo', validatorRules.tfMemo]" placeholder="请输入备注" type="textarea"></a-input>
        </a-form-item>
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "TbProjectPersonModal",
    components: { 
      JSelectUserByDep,
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
        tfUserFkId:{},
        tfProjectFkId:{},
        tfSysRoleCode:{},
        },
        url: {
          add: "/project_person_manager/tbProjectPerson/add",
          edit: "/project_person_manager/tbProjectPerson/edit",
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
          this.form.setFieldsValue(pick(this.model,'tfUserFkId','tfProjectFkId','tfSysRoleCode', 'tfTitle', 'tfCertificateNo', 'tfWorkDesc', 'tfMemo'))
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
        this.form.setFieldsValue(pick(row,'tfUserFkId','tfProjectFkId','tfSysRoleCode'))
      }
      
    }
  }
</script>