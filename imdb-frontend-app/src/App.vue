<template>
  <Navbar/>
  <div class="router-view">
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      user: null
    }
  },
  created() {
    axios.post('auth/me')
      .then(
        response => {
          this.user = response.data;
          this.$store.dispatch('user', response.data);
        }
      ).catch(
        error => {
          if (error.response.status === 401){
            localStorage.removeItem('token');
          }
        }
      )
  }
}
</script>

<style scoped>
.router-view {
  margin-top: 4%
}
</style>
