<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ city.replace('市','') }}美团</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">{{ city.replace('市','') }}{{ type }}</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type:String,
      default:''
    },
    type: {
      type:String,
      default:''
    }
  },
  data() {
    return {
      city: ''
    }
  },
  async mounted() {
    let self = this;
    if (localStorage.getItem('newCity')) {
      self.city = JSON.parse(localStorage.getItem('newCity')).replace('市', '');
    } else {
      self.city = '天津'
    }
  }
}
</script>
