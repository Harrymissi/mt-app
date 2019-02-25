<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>

<script>
  import _ from 'lodash'
    export default {
       data() {
         return {
           province: [],
           pvalue: '',
           city: [],
           cvalue: '',
           input: '',
           cities: [] //全国的城市列表
         }
       },
      watch: {
         pvalue: async function (newPvalue) {
           let self = this;
           let {status, data:{city}} = await self.$axios.get(`/geo/province/${newPvalue}`);
           if(status === 200) {
             self.city = city.map(item => {
               return {
                 value: item.id,
                 label: item.name
               }
             })
             self.cvalue = '';
           }
         }
      },
      mounted: async function() {
         let self = this;
         let {status, data:{province}} = await self.$axios.get('/geo/province');
         if(status === 200) {
           self.province = province.map(item => {
             return {
               value: item.id,
               label: item.name
             }
           })
         }
      },
      methods: {
        querySearchAsync: _.debounce(async function (query, callback) {
          let self = this;
          if(self.cities.length) {
            callback(self.cities.filter(item => item.value.indexOf(query)>-1))  //例如输入了一个“北”，那么所有带这个字的全国城市都返回
          } else {
            let {status, data:{city}} = await self.$axios.get('/geo/city');
            if(status === 200) {
              self.cities = city.map(item => {
                return {
                  value: item.name
                }
              });
              callback(self.cities.filter(item => item.value.indexOf(query)>-1));
            } else {
              callback([])
            }
          }
        },200),
        handleSelect: function (item) {  //选中之后的跳转
          //let self = this;
          // self.$store.dispatch('geo/setPosition', {
          //   city: item.value,
          //   province: ''
          // });

          localStorage.setItem('newCity', JSON.stringify(item.value));
          location.href = '/';
        }
      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/iselect.scss";
</style>
