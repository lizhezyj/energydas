<template>
  <a-modal
    title="导出报表"
    :width="900"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="clickHandle"
    @cancel="handleCancel"
    >
    <a-form :form="form">
      <!-- <a-row>
        <a-col :span="12">
          <a-form-item label="当前项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <p>tet</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="当前工程部位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <p>tet</p>
          </a-form-item>
        </a-col>
      </a-row> -->
      <p>当前：{{tfProjectFkName}}{{tfAreaFkName}}{{tfCollecterPointerFkName}}</p>
      <a-row>
        <a-col :span="12">
          <a-form-item label="导出日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <c-range 
              dateFormat="YYYY-MM-DD"
              v-model="createTime_block" 
              :ranges="dateRanges"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="导出文件名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['exportFileName']" placeholder="请输入导出文件名"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="只导出图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch v-model="isOnlyPicExport" />
          </a-form-item>
        </a-col>
      </a-row>

      <p>选定参数指定导出通道：</p>
      <a-row v-for="(dataTypeItem, index) in  exportDataTypeList" :key="index">
        <a-col :span="12">
          <a-form-item label="参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="list" v-model="dataTypeItem.tfDataTypeName"  dictCode="tdic_sensor_data_type,tf_name,tf_code" placeholder="请选择参数类型名称"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="选择通道号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-select-multiple placeholder="请选择通道号" v-model="dataTypeItem.tfChannelList"  :options="channelSelectMultipleOptions" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col style="text-align:center;" :span="24">
          <a-button type="primary" icon="plus" @click="handleAddExportDataTypeList">新增</a-button>
          <template v-if="exportDataTypeList.length>0">
            &nbsp;&nbsp;&nbsp;
            <a-button type="primary" icon="minus" @click="handleDeleteExportDataTypeList">移除</a-button>
          </template>
        </a-col>
      </a-row>

      
    </a-form>
    <!-- <a-button type="primary" icon="download" @click="clickHandle">导出Word报表</a-button> -->
  </a-modal>
</template>

<script>

import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
import CRange from '@/views/business/modules/CRange.vue'
import moment from 'moment'
import pick from 'lodash.pick'
import JSelectMultiple from '@/components/jeecg/JSelectMultiple'

export default {
  name: 'ExportWord',
  components: {
    CRange,
    JSelectMultiple,
  },
  props: {
    exportWordData: {
      type: Object,
    },
    loadExportWordDataComplete: {
      type: Boolean,
      default: false,
    },
    dateRanges: {
      type: Object,
    },
    queryParam: {
      type: Object,
    },
    tfProjectFkName: {
      type: String,
    },
    tfAreaFkName: {
      type: String,
    },
    tfCollecterPointerFkName: {
      type: String,
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
      channelSelectMultipleOptions: [
        { text: 'tv1', value: 'tv1' },
        { text: 'tv2', value: 'tv2' },
        { text: 'tv3', value: 'tv3' },
        { text: 'tv4', value: 'tv4' },
        { text: 'tv5', value: 'tv5' },
        { text: 'tv6', value: 'tv6' },
        { text: 'tv7', value: 'tv7' },
        { text: 'tv8', value: 'tv8' },
        { text: 'tv9', value: 'tv9' },
        { text: 'tv10', value: 'tv10' },
        { text: 'tv11', value: 'tv11' },
        { text: 'tv12', value: 'tv12' },
        { text: 'tv13', value: 'tv13' },
        { text: 'tv14', value: 'tv14' },
        { text: 'tv15', value: 'tv15' },
        { text: 'tv16', value: 'tv16' },
      ],
      exportDataTypeList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      visible: false,
      createTime_block: [moment().subtract(6, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
      validatorRules:{
        exportFileName:{rules: [{ required: true, message: '请输入导出文件名!' }]},
      },
      isOnlyPicExport: false,
    }
  },
  computed: {
    exportFileName: {
      get: function () {
        return `${this.createTime_block[1]}${this.tfProjectFkName}${this.tfAreaFkName}${this.tfCollecterPointerFkName}`
      },
      set: function (val) {
        console.log(val)
        return val
      }
    }
  },
  watch: {
    // 加载导出数据是否完成
    loadExportWordDataComplete: function (val) {
      if (val) setTimeout(this.exportWord, 3000)
    },
    createTime_block: function (val) {
      this.form.setFieldsValue({exportFileName: `${val[1]}${this.tfProjectFkName}${this.tfAreaFkName}${this.tfCollecterPointerFkName}`})
      this.$emit('changeExportDateTime', val)
    },
  },
  methods: {
    handleTfDataTypeChange(val) {
      console.log(val)
    },
    handleDeleteExportDataTypeList() {
      this.exportDataTypeList.pop()
    },
    handleAddExportDataTypeList() {
      this.exportDataTypeList.push({
        tfDataTypeName: '',
        tfChannelList: '',
      })
    },
    // 打开导出word对话框
    open() {
      this.$emit('changeExportDateTime', this.createTime_block)
      this.form.resetFields();
      this.visible = true;
      this.$nextTick(() => {
        // 设置初始值
        this.form.setFieldsValue({exportFileName: this.exportFileName,})
        this.createTime_block = [moment().subtract(6, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')]
      })
    },
    // 点击确定回调
    clickHandle() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 导出指定参数必填控制
          for (let i = 0; i < this.exportDataTypeList.length; i++) {
            if (!this.exportDataTypeList[i].tfDataTypeName) {
              this.$message.warning('导出参数不能为空!')
              return
            } else if (!this.exportDataTypeList[i].tfChannelList) {
              this.$message.warning('导出参数通道号不能为空!')
              return
            }
          }
          this.confirmLoading = true
          this.$emit('click', this.exportDataTypeList)
        }
      })
    },
    // 导出echarts图片格式转换
    base64DataURLToArrayBuffer(dataURL) {
      const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
      if (!base64Regex.test(dataURL)) {
        return false;
      }
      const stringBase64 = dataURL.replace(base64Regex, "");
      let binaryString;
      if (typeof window !== "undefined") {
        binaryString = window.atob(stringBase64);
      } else {
        binaryString = new Buffer(stringBase64, "base64").toString("binary");
      }
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes.buffer;
    },
    // 导出文档
    exportWord(){
      console.log('exportWord')
      // return
      var ImageModule = require('open-docxtemplater-image-module');
      // 点击导出word
      let _this = this;            
      // 读取并获得模板文件的二进制内容
      // JSZipUtils.getBinaryContent("../../../../asssets/docTemplate/exportTemplate.docx",function(error, content) {
      JSZipUtils.getBinaryContent("../exportTemplate.docx",function(error, content) {
        // exportTemplate.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
            throw error;
        }
        // 图片处理
        let opts = {}
        opts.centered = true;  // 图片居中，在word模板中定义方式为{%%image}
        opts.fileType = "docx";
        opts.getImage = function(chartId){
          return _this.base64DataURLToArrayBuffer(chartId);
        }
        opts.getSize = function(){
          return [500,200]
        }
        let imageModule = new ImageModule(opts);
        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docxtemplater实例对象
        let doc = new docxtemplater();
        doc.attachModule(imageModule);
        doc.loadZip(zip);   


        const exportFileName = _this.form.getFieldValue('exportFileName')
        // 设置模板变量的值
        doc.setData({
          // image: _this.echartDataUrl, // 获取echarts图片
          // data: _this.dataSource,
          // col_title: _this.col_title,
          // table_title: _this.title,
          word_title: `${_this.tfProjectFkName}${_this.tfAreaFkName}`,
          word_start_time: _this.createTime_block[0],
          word_end_time: _this.createTime_block[1],
 
          has_zk_data: _this.isOnlyPicExport ? false : _this.exportWordData.ZK.table_data && _this.exportWordData.ZK.table_data.length > 0 ? true : false,
          zk_table_title: _this.exportWordData.ZK.table_title,
          zk_table_col_title: _this.exportWordData.ZK.table_col_title,
          zk_table_data: _this.exportWordData.ZK.table_data,
          zk_table_data_unit: _this.exportWordData.ZK.table_data_unit,
          zk_image: _this.exportWordData.ZK.img_data,

          has_zx_data: _this.isOnlyPicExport ? false : _this.exportWordData.ZX.table_data && _this.exportWordData.ZX.table_data.length > 0 ? true : false,
          zx_table_title: _this.exportWordData.ZX.table_title,
          zx_table_col_title: _this.exportWordData.ZX.table_col_title,
          zx_table_data: _this.exportWordData.ZX.table_data,
          zx_table_data_unit: _this.exportWordData.ZX.table_data_unit,
          zx_image: _this.exportWordData.ZX.img_data,

          has_sm_data: _this.isOnlyPicExport ? false : _this.exportWordData.SM.table_data && _this.exportWordData.SM.table_data.length > 0 ? true : false,
          sm_table_title: _this.exportWordData.SM.table_title,
          sm_table_col_title: _this.exportWordData.SM.table_col_title,
          sm_table_data: _this.exportWordData.SM.table_data,
          sm_table_data_unit: _this.exportWordData.SM.table_data_unit,
          sm_image: _this.exportWordData.SM.img_data,

          has_yw_data: _this.isOnlyPicExport ? false : _this.exportWordData.YW.table_data && _this.exportWordData.YW.table_data.length > 0 ? true : false,
          yw_table_title: _this.exportWordData.YW.table_title,
          yw_table_col_title: _this.exportWordData.YW.table_col_title,
          yw_table_data: _this.exportWordData.YW.table_data,
          yw_table_data_unit: _this.exportWordData.YW.table_data_unit,
          yw_image: _this.exportWordData.YW.img_data,

          has_cj_data: _this.isOnlyPicExport ? false : _this.exportWordData.CJ.table_data && _this.exportWordData.CJ.table_data.length > 0 ? true : false,
          cj_table_title: _this.exportWordData.CJ.table_title,
          cj_table_col_title: _this.exportWordData.CJ.table_col_title,
          cj_table_data: _this.exportWordData.CJ.table_data,
          cj_table_data_unit: _this.exportWordData.CJ.table_data_unit,
          cj_image: _this.exportWordData.CJ.img_data,
        });
        
        try {
          // 用模板变量的值替换所有模板变量
          doc.render();
          } catch (error) {
          // 抛出异常
          let e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
          };
          throw error;
        }                
        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, exportFileName);
        _this.exportDataTypeList = []
        _this.confirmLoading = false
        _this.close()

      });
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleCancel () {
      this.close()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>