<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col
        :span="3"
        class="left">
        <img alt="美团" src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png">
      </el-col>
      <el-col
        :span="15"
        class="center">
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="搜索商家和地点"
            @focus="focus"
            @blur="blur"
            @input="input"/>
          <button class="el-button el-button--primary">
            <i class="el-icon-search"/>
          </button>
          <dl
            class="hotPlace"
            v-if="isHotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item, index) in hotPlace.slice(0,5)" :key="index">
              <a :href="'/products?keyword='+encodeURIComponent(currentCity + item.name)">{{item.name}}</a>
            </dd>
          </dl>
          <dl
            class="searchList"
            v-if="isSearchList">
            <dd v-for="(item, index) in searchList" :key="index">
              <a :href="'/products?keyword='+encodeURIComponent(currentCity + item.name)">{{item.name}}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a :href="'/products?keyword='+encodeURIComponent(currentCity + item.name)"
             v-for="(item, index) in hotPlace.slice(0,5)"
             :key="index">{{item.name}}</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link
              to="/"
              class="takeout">美团外卖</nuxt-link>
            <nuxt-link
              to="/"
              class="movie">猫眼电影</nuxt-link>
            <nuxt-link
              to="/"
              class="hotel">美团酒店</nuxt-link>
            <nuxt-link
              to="/"
              class="apartment">名宿/公寓</nuxt-link>
            <nuxt-link
              to="/"
              class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col
        :span="6"
        class="right">
        <ul class="security">
          <li><i class="refund"/><p class="txt">随时退</p></li>
          <li><i class="single"/><p class="txt">不满意免单</p></li>
          <li><i class="overdue"/><p class="txt">过期退</p></li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import _ from 'lodash'
    export default {
        data() {
          return {
            search: '',
            isFocus: false,
            hotPlace: ['火锅', '火锅底料', '小肥羊'],
            searchList: [],
            currentCity: ''
          }
        },
        computed: {
          isHotPlace: function () {
            return this.isFocus && !this.search
          },
          isSearchList: function () {
            return this.isFocus && this.search
          }
        },
      mounted: async function() {
        let self = this;
        let city;
        if (localStorage.getItem('newCity')) {
          city = JSON.parse(localStorage.getItem('newCity')).replace('市', '');
        } else {
          city = '天津'
        }
        self.currentCity = city;
        let {status, data:{result}} = await self.$axios.get('/search/hotPlace', {
          params: {
            city
          }
        });
        self.hotPlace = result;
      },
      methods: {
          focus: function () {
            this.isFocus = true
          }, //焦距在输入框
          blur: function () {
            let self = this;
            setTimeout(function () {
              self.isFocus = false
            }, 200)
          }, //焦距离开输入框
          input: _.debounce(async function() {   //延时函数，因为不能输入一个字就发送一个请求，这样不合理
            let self = this;
            //let city = self.$store.state.geo.position.city.replace('市', '');
            let city = '天津';
            if (localStorage.getItem('newCity')) {
              city = JSON.parse(localStorage.getItem('newCity')).replace('市', '');
            }
            self.searchList = [];
            let {status, data:{top}} = await self.$axios.get('/search/top', {
              params: {
                input: self.search,
                city,
              }
            });
            self.searchList = top.slice(0,10)
          }, 1000)
      }
    }
</script>

<style scoped>

</style>
