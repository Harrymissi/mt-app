<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin'
export default {
  data(){
    return {
      list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block:[]
    }
  },
  async mounted(){
    let self=this;
    let blocks=[];
    let {status,data:{city}}=await self.$axios.get('/geo/city');
    if(status===200){
      let p;
      let c;
      let d={};
      city.forEach(item=>{
        p= pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1); //获取拼音的首字母
        c= p.charCodeAt(0);  //ASCII值
        if(c > 96 && c < 123){  // 小写字母的值在这个范围内，其他的为异常
          if(!d[p]){
            d[p] = [];  // 每个字母对应的城市
          }
          d[p].push(item.name)
        }
      });
      for(let [k,v] of Object.entries(d)){  // 把对象转换为数组
        blocks.push({
          title: k.toUpperCase(),
          city: v
        })
      }
      blocks.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0));
      self.block = blocks;
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
