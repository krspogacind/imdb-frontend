<template>
  <nav class="navbar navbar-expand navbar-dark bg-success fixed-top">
    <router-link to="/" class="navbar-brand">Imdb app</router-link>
      <ul class="navbar-nav ml-auto" v-if="!user">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/registration" class="nav-link">Registration</router-link>
        </li>
      </ul>
      <div class="navbar-nav ml-auto" v-else>
        <div class="nav-item">
          <a href="javascript:void(0)" @click="handleLogOut" class="nav-link">Logout</a>
        </div> 
      </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    handleLogOut() {
      axios.post('auth/logout')
        .then(
          response => {
            localStorage.removeItem('token');
            this.$store.dispatch('user', null);
            this.$router.push('/');
            this.$wkToast(response.data.message);
          }
        ).catch(
          error => {
            alert('Server error, try again');
          }
        )
    }
  }
}
</script>