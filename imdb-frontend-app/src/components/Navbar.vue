<template>
  <nav class="navbar navbar-expand navbar-dark bg-success fixed-top">
    <router-link to="/" class="navbar-brand">Imdb app</router-link>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/registration" class="nav-link">Registration</router-link>
        </li>
      </ul>
      <!-- <div class="navbar-nav ml-auto">
        <div class="nav-item">
          <a href="javascript:void(0)" @click="handleLogOut"  class="nav-link">Logout</a>
        </div> 
      </div> -->
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>