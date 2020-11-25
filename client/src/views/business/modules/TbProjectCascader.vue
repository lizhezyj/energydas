<template>
  <a-cascader
    v-model="cascaderVal"
    :options="cascaderOptions"
    @change="cascaderChange"
    :loadData="cascaderLoadData"
    expandTrigger="hover"
    placeholder="请选择项目工程部位"
    :allowClear="false"
  />
</template>

<script>
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { deteleObject } from '@/utils/util'

export default {
  name: '',
  data() {
    return {
      cascaderVal: [],
      cascaderOptions: []
    }
  },
  created() {
    this.initDictConfig()
  },
  methods: {
    setDictOptionsFunc(params, targetOption, resCb, isLeaf) {
      initDictOptions(params)
        .then(res => {
          if (res.success) {
            res.result.forEach(resItem => {
              let resObj = {
                label: resItem.title,
                value: resItem.value,
                isLeaf: isLeaf,
              }
              targetOption.push(resObj)
            })

            // 过滤重复项目
            targetOption = deteleObject(targetOption)
            // 成功设置数据后回调
            resCb(targetOption)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    initDictConfig() {
      // 所有的项目列表-根据角色过滤
      this.setDictOptionsFunc(
        `st_all_project_person,tf_project_name,tf_project_fk_id,tf_user_fk_id="${this.$store.getters.userInfo.username}"`, 
        this.cascaderOptions, 
        (targetOption) => {
          // 获取第一个项目的工程部位
          this.cascaderOptions = targetOption
          this.cascaderOptions[0].children = []
          this.setDictOptionsFunc(
            `tb_area,tf_code,id,tf_project_fk_id="${this.cascaderOptions[0].value}"`, 
            this.cascaderOptions[0].children,
            () => {
              // 设置默认值为第一个项目，第一个工程部位
              this.cascaderVal = [this.cascaderOptions[0].value, this.cascaderOptions[0].children[0].value]
              this.$emit('getPjCascardVal', this.cascaderVal)
            },
            true
          )
        },
        false
      )
    },
    cascaderChange(value, selectedOptions) {
      this.$emit('getPjCascardVal', value)
    },
    cascaderLoadData(selectedOptions) {
      var _self = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      targetOption.children = []
      this.setDictOptionsFunc(
        `tb_area,tf_code,id,tf_project_fk_id="${selectedOptions[0].value}"`,
        targetOption.children, 
        () => {
          this.cascaderOptions.forEach(optItem => {
            if (optItem.loading) optItem.loading = false
          })
          this.cascaderOptions = [...this.cascaderOptions]
        },
        true
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>