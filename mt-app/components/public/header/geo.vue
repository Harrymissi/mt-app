<template>
  <div class="m-geo">
    <i class="el-icon-location"/>{{city}}
    <nuxt-link
      class="changeCity"
      to="/changeCity">切换城市</nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>

<script>
    export default {
      data() {
        return {
          city: this.$store.state.geo.position.city
        }
      },
      mounted: async function() {
        if (localStorage.getItem('newCity')) {
          this.city = JSON.parse(localStorage.getItem('newCity'));
        }
      }
    }
</script>

<style scoped>

</style>
