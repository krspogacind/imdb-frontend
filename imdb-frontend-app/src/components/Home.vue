<template>
  <h1 v-if="user">
    Welcome {{ user.name }} to to-do list app
  </h1>
  <h1 v-else>
    Welcome to to-do list app
  </h1>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style scoped>
h1 {
  text-align: center
}
</style>