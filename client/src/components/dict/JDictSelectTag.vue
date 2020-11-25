<template>
  <a-radio-group v-if="tagType=='radio'" @change="handleInput" :value="value" :disabled="disabled">
    <a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{ item.text }}</a-radio>
  </a-radio-group>

  <a-select v-else-if="tagType=='select'" :placeholder="placeholder" :disabled="disabled" :value="value" @change="handleInput" @search="handleSearch" :showSearch="showSearch">
    <!-- 新增选项按钮 -->
    <div :slot="showSelectOptsAddBtn ? 'dropdownRender' : '' " slot-scope="menu">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0;" />
      <div style="padding: 8px; cursor: pointer;" @click="handleAddSelectItem"><a-icon type="plus" />  新增</div>
    </div>
    <a-select-option value="">请选择</a-select-option>
    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.value">
      <span style="display: inline-block;width: 100%" :title=" item.text || item.label ">
        {{ item.text || item.label }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
  import {ajaxGetDictItems} from '@/api/api'
  import { deteleObject } from '@/utils/util'

  export default {
    name: "JDictSelectTag",
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    props: {
      dictCode: String,
      placeholder: String,
      triggerChange: Boolean,
      disabled: Boolean,
      value: String,
      type: String,
      showSearch: Boolean,
      showSelectOptsAddBtn: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        dictOptions: [],
        tagType:""
      }
    },
    watch: {
      dictCode(val) {
        this.initDictData();
      }
    },
    created() {
      console.log(this.dictCode);
      if(!this.type || this.type==="list"){
        this.tagType = "select"
      }else{
        this.tagType = this.type
      }
      //获取字典数据
      this.initDictData();
    },
    methods: {
      initDictData() {
        if (!this.dictCode) return
        //根据字典Code, 初始化字典数组
        ajaxGetDictItems(this.dictCode, null).then((res) => {
          if (res.success) {
            // console.log(res.result);
            if (this.dictCode.indexOf('st_all_project_person') > -1) { //查项目字典的时候过滤重复的
              this.dictOptions = deteleObject(res.result)
            } else {
              this.dictOptions = res.result;
            }
            this.$emit('getDictOptionsData', this.dictOptions)
          }
        })
      },
      handleInput(e) {
        let val;
        if(this.tagType=="radio"){
          val = e.target.value
        }else{
          val = e
        }
        console.log(val);
        if(this.triggerChange){
          this.$emit('change', val);
        }else{
          this.$emit('input', val);
        }
      },
      handleSearch(val) {
        this.$emit('search', val)
      },
      setCurrentDictOptions(dictOptions){
        this.dictOptions = dictOptions
      },
      getCurrentDictOptions(){
        return this.dictOptions
      },
      handleAddSelectItem() {
        this.$emit('handleAddSelectItem');
      }
    }
  }
</script>

<style scoped>
</style>