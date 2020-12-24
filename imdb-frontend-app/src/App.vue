<template>
  <Navbar/>
  <div class="router-view">
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
}
</script>

<style scoped>
.router-view {
  margin-top: 4%
}
</style>
