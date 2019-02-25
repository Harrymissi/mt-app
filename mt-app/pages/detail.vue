<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <crumbs
          :keyword="keyword"
          :type="type"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <summa :meta="product"/>
      </el-col>
    </el-row>
    <el-row class="m-titile\">
      <el-col :span="24">
        <h3>商家团购及优惠</h3>
      </el-col>
    </el-row>
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <list
          v-if="login"
          :list="list"/>
        <div
          v-else
          class="deal-need-login">
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看">
          <span>请登录后查看详细团购优惠</span>
          <el-button
            type="primary"
            round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Crumbs from '../components/detail/crumbs'
  import Summa from '../components/detail/summary'
  import List from '../components/detail/list'

  export default {
    components: {
      Crumbs,
      Summa,
      List
    },
    data() {
      return {
        keyword: '',
        type: '',
        product: {},
        list: [],
        login: ''
      }
    },
    computed: {
      canOrder: function () {
        return this.list.filter(item=>item.photos.length).length // 看目前list中是否有东西
      }
    },
    async asyncData(ctx) {
      let city;
      if (localStorage.getItem('newCity')) {
        city = JSON.parse(localStorage.getItem('newCity')).replace('市', '');
      } else {
        city = '天津'
      }
      let {keyword, type} = ctx.query;
      let {status, data: {product, more:list, login}} = await ctx.$axios.get('/search/products', {
        params: {
          keyword,
          type,
          city
        }
      });
      if (status === 200) {
        return {    // asyncData中返回的数据是和data做merge的
          keyword,
          product,
          type,
          list,
          login
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/detail/index.scss";
</style>
