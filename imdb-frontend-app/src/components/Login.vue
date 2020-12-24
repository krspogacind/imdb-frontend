<template>
  <div v-if="user">
    <h5>You are allready logged in</h5>
  </div>
  <div v-else>
    <form @submit.prevent="handleSubmit">
      <small>
        {{  error_message  }}
      </small>
      <!-- Email Address -->
      <div class="form-group col-lg-5 ml-auto mr-auto">
        <label for="email">Email</label>
        <input @input="deleteMessage" id="email" type="email" class="form-control" v-model="email" placeholder="Email">
      </div>

      <!-- Password -->
      <div class="form-group col-lg-5 ml-auto mr-auto">
        <label for="password">Password</label>
        <input @input="deleteMessage" id="password" type="password" class="form-control" v-model="password" placeholder="Password">
      </div>

      <div class="col-lg-5 ml-auto mr-auto">
        <button class="btn btn-success btn-block">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error_message: null
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    handleSubmit() {
      const data = {
        email: this.email,
        password: this.password,
      }
      
      axios.post('auth/login', data)
        .then(
          response => {
            localStorage.setItem('token', response.data.access_token);
            this.$store.dispatch('user', response.data.user);
            location.href = '/';
          }
        ).catch(
          error => {
            if (error.response.status === 401){
              this.error_message = "Wrong username or password";
            } else {
              alert('Server error, try again');
            }
          }
        )
    },

    deleteMessage() {
      if (this.error_message !== null){
        this.error_message = null;
      }
    }
  }
}
</script>

<style scoped>
small {
  color: red;
}
h5 {
  text-align: center
}
</style>