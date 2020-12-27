<template>
  <form @submit.prevent="handleSubmit">
    <small>
      {{ error_message }}
    </small>
    <!-- Name -->
    <div class="form-group col-lg-5 ml-auto mr-auto">
      <label for="name">Name</label>
      <input @input="deleteMessage" id="name" type="text" class="form-control" v-model="name" placeholder="Name">
    </div>

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

    <!-- Confirm Password -->
    <div class="form-group col-lg-5 ml-auto mr-auto">
      <label for="confirm_password">Confirm password</label>
      <input @input="deleteMessage" id="confirm_password" type="password" class="form-control" v-model="password_confirm" placeholder="Confirm password">
    </div>

    <div class="col-lg-5 ml-auto mr-auto">
      <button class="btn btn-success btn-block">Registration</button>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios';

export default {
  name: 'Registration',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirm: '',
      error_message: '',
    }
  },
  methods: {
    handleSubmit() {
      if (this.name === '' || this.email === '' || this.password === '') {
        this.error_message = "All fields are required"
        return;
      }
      if (this.name.length > 255 || this.email.length > 255) {
        this.error_message = "Name and email are not longer than 255 characters";
        return;
      }
      if (this.password.length < 6 || this.password.length > 20) {
        this.error_message = "Password must have 6 to 20 characters"
        return;
      }
      if (this.password !== this.password_confirm) {
        this.error_message = "The password must match confirm password"
        return;
      }

      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
      }
      
      axios.post('auth/register', data)
        .then(
          response => {
            this.$wkToast(response.data.message);
            this.$router.push('/login');
          }
        ).catch(
          error => {
            if (error.response.status === 422){
              this.error_message = error.response.data.errors.email[0];
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
</style>