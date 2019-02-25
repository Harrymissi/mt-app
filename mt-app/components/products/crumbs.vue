<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ city }}美团</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ city }}{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      default: ''
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
