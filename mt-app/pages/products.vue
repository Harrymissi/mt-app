<template>
    <div class="page-product">
      <el-row class="page-product">
        <el-col :span="19">
          <crumbs :keyword="keyword"/>
          <category
            :types="types"
            :areas="areas"/>
          <list
            :list="list"
            v-on:currentPoint="currentPoint"/>
        </el-col>
        <el-col :span="5">
          <amap
            v-if="point.length"
            :width="230"
            :height="290"
            :point="point"/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import Crumbs from '../components/products/crumbs'
  import Category from '../components/products/categroy'
  import List from '../components/products/list'
  import Amap from '../components/public/map'
    export default {
      components: {List, Category, Crumbs, Amap},
      data() {
        return {
          list: [],
          types: [],
          areas: [],
          keyword: '',
          point: [], //经纬度
          city: ''
        }
      },
      mounted: async function() {
        let self = this;
        if (localStorage.getItem('newCity')) {
          self.city = JSON.parse(localStorage.getItem('newCity')).replace('市', '');
        } else {
          self.city = '天津'
        }
      },
      methods: {
        currentPoint: function (currentPoint) {
          this.point = currentPoint.split(',');
        }
      },
      async asyncData(ctx) { //获取异步数据
        let keyword = ctx.query.keyword.slice(2,);
        let city = ctx.query.keyword.slice(0,2);

        let {status, data:{count,pois}} = await ctx.$axios.get('/search/resultsByKeywords', {
          params: {
            keyword,
            city
          }
        });

        let {status: status2, data: {areas, types}} = await ctx.$axios.get('/category/crumbs', {
          params: {
            city
          }
        });

        if (status===200 && count>0 && status2===200) {
          return {
            list: pois.filter(item => item.photos.length).map(item => {
              return {
                type: item.type,
                img: item.photos.length ? item.photos[0].url : '',
                name: item.name,
                comment: Math.floor(Math.random()*10000),
                rate: Number(item.biz_ext.rating),
                price: Number(item.biz_ext.cost),
                scene: item.tag,
                tel: item.tel,
                status: '可订明日',
                location: item.location,
                module: item.type.split(';')[0]
              }
            }), //把没有图片的过滤掉,再对数据做映射，前端定义好的属性当key，后端取来的当value
            keyword,
            areas: areas.filter(item=>item.type!=='').slice(0,5),
            types: types.filter(item=>item.type!=='').slice(0,5),
            point: (pois.find(item=>item.location).location||'').split(',')
          }
        }
      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/products/index.scss";
</style>
