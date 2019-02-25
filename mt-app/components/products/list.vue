<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="(item) in nav"
        :key="item.name"
        :class="[item.name,item.acitve?'s-nav-active':'']"
        @click="navSelect(item.name)"
      >{{ item.txt }}</dd>
    </dl>
    <ul>
      <Item
        v-for="(item,idx) in parentList"
        position="item.location"
        :key="idx"
        :meta="item"
        @mouseover="over(item.location)"/>
    </ul>
  </div>
</template>

<script>
import Item from './product.vue'
export default {
  components: {
    Item
  },
  props: {
    list: {
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      nav: [
        {
          name: 's-default',
          txt: '智能排序',
          acitve: true
        }, {
          name: 's-price',
          txt: '价格最低',
          active: false
        }, {
          name: 's-visit',
          txt: '人气最高',
          active: false
        }, {
          name: 's-comment',
          txt: '评价最高',
          active: false
        }
      ],
      parentList: this.list,
    }
  },
  // async asyncData({app}) {
  //   let { data } = await app.$axios.get('searchList');
  //   return { items: data.list }
  // },
  methods: {
    navSelect: function (type) {
      if (type === 's-price') {
        let self = this;
        self.nav[1].acitve = true;
        self.nav[0].acitve = false;
        self.nav[2].acitve = false;
        self.nav[3].acitve = false;
        let items = self.parentList;
        items.sort(function (a,b) {
          return a.price - b.price;
        });
        self.parentList = items;
      } else if (type === 's-visit') {
        let self = this;
        self.nav[2].acitve = true;
        self.nav[0].acitve = false;
        self.nav[1].acitve = false;
        self.nav[3].acitve = false;
        let items = self.parentList;
        items.sort(function (a,b) {
          return b.comment - a.comment;
        });
      } else if (type === 's-comment') {
        let self = this;
        self.nav[1].acitve = false;
        self.nav[0].acitve = false;
        self.nav[2].acitve = false;
        self.nav[3].acitve = true;
        let items = self.parentList;
        items.sort(function (a,b) {
          return b.rate - a.rate;
        });
      }
    },
    over: function (location) {
      //console.log(location)
      this.$emit('currentPoint', location);
    }
  }
}
</script>
