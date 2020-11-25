<template>
  <a-modal
    title="详情"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!-- 主表单区域 -->
      <a-form :form="form">
        <a-row>

          <a-col :span="8">
            <a-form-item label="采集时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <j-date :disabled="true" placeholder="请选择采集时间" v-decorator="[ 'createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/> -->
              <a-input :disabled="true" v-decorator="[ 'createTime', validatorRules.tfElectricity]"></a-input>
              <!-- <span>{{model.createTime}}</span> -->
            </a-form-item>
          </a-col>
        
          <a-col :span="8">
            <a-form-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <j-dict-select-tag :disabled="true"  type="list" v-decorator="['tfProjectFkId']" :trigger-change="true" placeholder="请选择项目"/> -->
              <a-input :disabled="true" v-decorator="[ 'tfProjectFkId', validatorRules.tfProjectFkId]"></a-input>
              <!-- <span>{{model.tfProjectFkId}}</span> -->
            </a-form-item>
          </a-col>
                
          <a-col :span="8">
            <a-form-item label="采集器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <j-dict-select-tag :disabled="true" type="list" v-decorator="['tfCollecterProductCode']" :trigger-change="true" placeholder="请选择采集器编号"/> -->
              <a-input :disabled="true" v-decorator="[ 'tfCollecterProductCode', validatorRules.tfCollecterProductCode]"></a-input>
              <!-- <span>{{model.tfCollecterProductCode}}</span> -->
            </a-form-item>
          </a-col>
        
          <a-col :span="8">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :disabled="true" v-decorator="[ 'tfState', validatorRules.tfState]" style="width: 100%"/>
              <!-- <span>{{model.tfState}}</span> -->
            </a-form-item>
          </a-col>
        
          <a-col :span="8">
            <a-form-item label="电量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="true" v-decorator="[ 'tfElectricity', validatorRules.tfElectricity]"></a-input>
              <!-- <span>{{model.tfElectricity}}</span> -->
            </a-form-item>
          </a-col>
        
          <a-col :span="8">
            <a-form-item label="温度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="true" v-decorator="[ 'tfTemp', validatorRules.tfTemp]"></a-input>
              <!-- <span>{{model.tfTemp}}</span> -->
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="sim卡" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="true" v-decorator="[ 'tfSim']"></a-input>
              <!-- <span>{{model.tfTemp}}</span> -->
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="流水号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="true" v-decorator="[ 'tfNo']"></a-input>
              <!-- <span>{{model.tfTemp}}</span> -->
            </a-form-item>
          </a-col>
        
        </a-row>
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="原始数据表" :key="refKeys[0]" :forceRender="true">
          <a-table
            ref="refKeys[0]"
            size="middle"
            bordered
            rowKey="id"
            :columns="tbPushSensorDataTable.columns"
            :dataSource="tbPushSensorDataTable.dataSource"
            :loading="tbPushSensorDataTable.loading">

          </a-table>
        </a-tab-pane>
        
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>

  import pick from 'lodash.pick'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'TbPushCollecterDataModal',
    mixins: [JEditableTableMixin],
    components: {
      JDate,
      JDictSelectTag,
    },
    props: {
      columnsData: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        labelCol: {
          span: 6
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
          createTime:{},
          tfProjectFkId:{},
          tfAreaFkId:{},
          tfCollecterPointerFkId:{},
          tfCollecterProductCode:{},
          tfState:{},
          tfElectricity:{},
          tfTemp:{},
        },
        refKeys: ['tbPushSensorData', ],
        tableKeys:['tbPushSensorData', ],
        activeKey: 'tbPushSensorData',
        // tb_push_sensor_data
        tbPushSensorDataTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title:'通道号',
              align:"center",
              dataIndex: 'tfLineNumber',
              sorter: (a, b) => {
                return a.tfLineNumber - b.tfLineNumber
              },
            },
            {
              title:'采集器接线分类',
              align:"center",
              dataIndex: 'tfLineCode',
              sorter: (a, b) => {
                return a.tfLineCode.localeCompare(b.tfLineCode)
              },
            },
            {
              title:'传感器编号',
              align:"center",
              dataIndex: 'tfSensorProductCode',
            },
            {
              title:'pv1',
              align:"center",
              dataIndex: 'pv1',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'pv2',
              align:"center",
              dataIndex: 'pv2',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'pv3',
              align:"center",
              dataIndex: 'pv3',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'pv4',
              align:"center",
              dataIndex: 'pv4',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'pv5',
              align:"center",
              dataIndex: 'pv5',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'温度',
              align:"center",
              dataIndex: 'tfTemp',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'电量',
              align:"center",
              dataIndex: 'tfElectric',
              customRender:(text)=>{
                if(text == '-8888'){
                  return ''
                } else{
                  return text
                }
              },
            },
            {
              title:'状态',
              align:"center",
              dataIndex: 'tfState'
            },
          ],
          oldcolumns: [
            {
              title: 'id',
              key: 'tfPushCollecterDataFkId',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '采集器接线分类',
              key: 'tfLineCode',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '温度',
              key: 'tfTemp',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '电量',
              key: 'tfElectric',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '状态',
              key: 'tfState',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'pv1',
              key: 'pv1',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'pv2',
              key: 'pv2',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'pv3',
              key: 'pv3',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'pv4',
              key: 'pv4',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: 'pv5',
              key: 'pv5',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            // {
            //   title: '项目',
            //   key: 'tfProjectFkId',
            //   type: FormTypes.input,
            //   defaultValue: '',
            //   placeholder: '请输入${title}',
            // },
            // {
            //   title: '采集器',
            //   key: 'tfCollecterProductCode',
            //   type: FormTypes.input,
            //   defaultValue: '',
            //   placeholder: '请输入${title}',
            // },
          ]
        },
        url: {
          add: "/push_data_manager/tbPushCollecterData/add",
          edit: "/push_data_manager/tbPushCollecterData/edit",
          tbPushSensorData: {
            list: '/push_data_manager/tbPushCollecterData/queryTbPushSensorDataByMainId'
          },
        }
      }
    },
    methods: {
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'createTime','tfProjectFkId','tfCollecterProductCode','tfState','tfElectricity','tfTemp', 'tfSim', 'tfNo')
        fieldval.tfProjectFkId = this.columnsData.tfProjectFkId
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.tbPushSensorData.list, params, this.tbPushSensorDataTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)

        return {
          ...main, // 展开
          tbPushSensorDataList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
      
      
    }
  }
</script>

<style scoped>
</style>