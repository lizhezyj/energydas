<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="showCancelConfirm"
    :bodyStyle="modalBodyStyle">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form" layout="vertical">
        <a-collapse v-model="activeCollapseKey" :bordered="false" style="padding: 0;">
          <a-collapse-panel key="1" header="基本信息" style="border: 0; padding: 0;">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="项目名称" >
                  <a-input v-decorator="[ 'tfProjectName', validatorRules.tfProjectName]" placeholder="请输入项目名称"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="项目编号" >
                  <a-input v-decorator="[ 'tfProjectCode', validatorRules.tfProjectCode]" placeholder="请输入项目编号"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="项目状态" >
                  <j-dict-select-tag type="list" v-decorator="['tfState', validatorRules.tfState]" :trigger-change="true" dictCode="tdic_pjstate,tf_name,tf_code" placeholder="请选择项目状态"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="项目负责人" >
                  <a-input v-decorator="[ 'tfProjectManager', validatorRules.tfProjectManager]" placeholder="请输入项目负责人"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系方式" >
                  <a-input v-decorator="[ 'tfProjectManagerTel', validatorRules.tfProjectManagerTel]" placeholder="请输入联系方式"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="开工日期" >
                  <j-date placeholder="请选择开工日期" v-decorator="[ 'tfStartdate', validatorRules.tfStartdate]" :trigger-change="true" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="竣工日期" >
                  <j-date placeholder="请选择竣工日期" v-decorator="[ 'tfFinishdate', validatorRules.tfFinishdate]" :trigger-change="true" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="地点" >
                  <a-input v-decorator="[ 'tfAddr', validatorRules.tfAddr]" placeholder="请输入地点"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="经度" >
                  <a-input-number v-decorator="[ 'tfLng', validatorRules.tfLng]" :step="0.0001" placeholder="请输入经度" style="width: 100%" @change="handlePointChange" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="纬度" >
                  <a-input-number v-decorator="[ 'tfLat', validatorRules.tfLat]" :step="0.0001" placeholder="请输入纬度" style="width: 100%" @change="handlePointChange"/>
                </a-form-item>
              </a-col>

              <a-col :span="18">
                <map-card
                  style="padding: 0"
                  :showMarker="true"
                  :width="'100%'"
                  :height="'200px'"
                  :center="mapCenter"
                  :zoom="17"
                  @mapReady="mapReadyHandler"
                  @getMarkerPoint="getPointAndLocation"
                />
              </a-col>

              <a-col :span="6">
                <a-form-item label="备注" >
                  <a-textarea v-decorator="[ 'tfMemo', validatorRules.tfMemo]" placeholder="请输入备注" :rows="7" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="项目详情" style="border: 0; padding: 0;">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="项目简介">
                  <a-input v-decorator="[ 'tfProjectDesc', validatorRules.tfProjectDesc]" placeholder="请输入项目简介" type="textarea"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="18">
                <a-form-item label="建设单位">
                  <a-input v-decorator="[ 'tfBuildUnit', validatorRules.tfBuildUnit]" placeholder="请输入建设单位"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人">
                  <a-input v-decorator="[ 'tfBuildTel', validatorRules.tfBuildTel]" placeholder="请输入联系人"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="18">
                <a-form-item label="设计单位">
                  <a-input v-decorator="[ 'tfDesignUnit', validatorRules.tfDesignUnit]" placeholder="请输入设计单位"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人">
                  <a-input v-decorator="[ 'tfDesignTel', validatorRules.tfDesignTel]" placeholder="请输入联系人"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="18">
                <a-form-item label="施工单位">
                  <a-input v-decorator="[ 'tfProductUnit', validatorRules.tfProductUnit]" placeholder="请输入施工单位"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人">
                  <a-input v-decorator="[ 'tfProductTel', validatorRules.tfProductTel]" placeholder="请输入联系人"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="18">
                <a-form-item label="监理单位">
                  <a-input v-decorator="[ 'tfSupervisorUnit', validatorRules.tfSupervisorUnit]" placeholder="请输入监理单位"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="联系人">
                  <a-input v-decorator="[ 'tfSupervisorTel', validatorRules.tfSupervisorTel]" placeholder="请输入联系人"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="技术资料上传" style="border: 0; padding: 0;">
            <a-row>
              <a-col :span="24" style="text-align: center;">暂无内容</a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>        
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="工程部位" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="tbAreaTable.loading"
            :columns="tbAreaTable.columns"
            :dataSource="tbAreaTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
            @deleted="deletedRow"/>
        </a-tab-pane>
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import mapCard from '../../modules/TbProjectMapCard.vue'
  import { postAction, deleteAction } from '@/api/manage.js'

  export default {
    name: 'TbProjectModal',
    mixins: [JEditableTableMixin],
    components: {
      JDate,
      JDictSelectTag,
      mapCard,
    },
    data() {
      return {
        modalBodyStyle: {'padding-top': 0},
        activeCollapseKey: ['1', '2'],
        showMapCard: false,
        labelCol: {
          span: 8
        },
        wrapperCol: {
          span: 16
        },
        labelCol2: {
          span: 3
        },
        wrapperCol2: {
          span: 20
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          tfProjectCode:{rules: [{ required: true, message: '请输入项目编号!' }]},
          tfProjectName:{rules: [{ required: true, message: '请输入项目名称!' }]},
          tfProjectManager:{rules: [{ required: true, message: '请输入项目负责人!' }]},
          tfStartdate:{},
          tfFinishdate:{},
          tfState:{rules: [{ required: true, message: '请输入项目状态!' }]},
          tfCustomer:{},
          tfAddr:{},
          tfLng:{},
          tfLat:{},
          tfDatatime:{},
          
        },
        refKeys: ['tbArea'],
        tableKeys:['tbArea'],
        activeKey: 'tbArea',
        // 工程部位
        tbAreaTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '检测对象',
              key: 'tfPosition',
              type: FormTypes.select,
              defaultValue: '',
              options: [],
              placeholder: '请输入${title}',
            },
            {
              title: '工程部位编号',
              key: 'tfCode',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '工程部位名称',
              key: 'tfName',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            // {
            //   title: '经度',
            //   key: 'tfLng',
            //   type: FormTypes.input,
            //   defaultValue: '',
            //   placeholder: '请输入${title}',
            // },
            // {
            //   title: '纬度',
            //   key: 'tfLat',
            //   type: FormTypes.input,
            //   defaultValue: '',
            //   placeholder: '请输入${title}',
            // },
            {
              title: '描述',
              key: 'tfDesc',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            }
          ]
        },
        url: {
          add: "/project_manager/tbProject/add",
          edit: "/project_manager/tbProject/edit",
          tbArea: {
            list: '/project_manager/tbProject/queryTbAreaByMainId',
            deleteCheck: '/project_manager/tbProject/check'
          },
        },
        initFieldVal: '', //初始化数据,比较保存时数据
      }
    },
    computed: {
      mapCenter: {
        get() {
          if (this.model.tfLng && this.model.tfLat) {
            return {
              // lng: this.form.getFieldValue('tfLng'),
              // lat: this.form.getFieldValue('tfLat'),
              lng: this.model.tfLng,
              lat: this.model.tfLat,
            }
          } else {
            return {
              lng: 117.208694,
              lat: 39.091237,
            }
          }
        },
        set (val) {}
      }
    },
    watch: {
    },
    created() {
      this.initDictConfig()
    },
    methods: {
      // 取消时确认是否保存
      showCancelConfirm() {
        let self = this
        console.log(this.initFieldVal)
        if (this.initFieldVal != this.form.getFieldsValue()) {
          this.$confirm({
            title: '是否保存编辑的内容?',
            onOk() {
              self.handleOk()
            },
            onCancel() {
              self.handleCancel()
            }
          });
        } else {
          self.handleCancel()
        }
      },
      initDictConfig() {
        initDictOptions('dic_area_position').then(res => {
          if (res.success) {
            this.tbAreaTable.columns[0].options = res.result
          }
        })
      },
      /** 删除工程部位前检查是否可以删除 */
      deletedRow(id) {
        console.log(id)
        deleteAction(this.url.tbArea.deleteCheck, {id: id[id.length-1]})
        // 0 可以删除 1不可以删除
          .then(res => {
            if (res.message && res.message == 1) {
              this.close()
              this.$message.error('该工程部位下有安装采集器,请先删除该工程部位下面的采集器再删除工程部位!')
            }
          }) 
          .catch(error => console.log(error))
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'tfProjectCode','tfProjectName','tfStartdate','tfFinishdate','tfState','tfCustomer','tfAddr','tfLng','tfLat','tfDatatime', 'tfProjectManager', 'tfProjectManagerTel','tfMemo', 'tfProjectDesc','tfBuildUnit','tfBuildTel', 'tfProductUnit', 'tfProductTel','tfSupervisorUnit', 'tfSupervisorTel','tfDesignTel', 'tfDesignUnit')
        this.initFieldVal = fieldval
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        // 工程部位数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.tbArea.list, params, this.tbAreaTable)
        }

        
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          tbAreaList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

      // map start
      mapReadyHandler() {

      },
      getPointAndLocation(data) {
        console.log(data)
        data.point.lng = parseFloat(Number(data.point.lng).toFixed(5))
        data.point.lat = parseFloat(Number(data.point.lat).toFixed(5))
        this.$nextTick(() => {
          this.form.setFieldsValue({
            tfAddr: data.location,
            tfLng: data.point.lng,
            tfLat: data.point.lat,
          })
        })
      },
      handlePointChange(val) {
        this.$nextTick(() => {
          var tfLng = this.form.getFieldValue('tfLng')
          var tfLat = this.form.getFieldValue('tfLat')
          console.log(tfLng + ',' + tfLat)
          this.model.tfLng = tfLng
          this.model.tfLat = tfLat
        })
      },
      // map end
      
    }
  }
</script>

<style scoped>
.ant-modal-body {
  padding-top: 0;
}
.ant-form-item {
  margin: 0;
}
</style>