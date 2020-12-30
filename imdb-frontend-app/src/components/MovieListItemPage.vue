<template>
  <div v-if="loading">
    Loading...
  </div>
  <div class="d-flex flex-column w-50 ml-auto mr-auto" v-if="movie">
    <div class="bg-secondary rounded">
      <h1 class="text-white"> {{ movie.title }} </h1> 
      <h4 class="text-white"> {{ movie.genre.name }} </h4>
    </div>
    <img class="img-fluid rounded mw-100" style="height: auto" :src="movie.cover_image_url" alt="Movie image">
    <div class="border border-secondary rounded">
      <h4 class="text-secondary">Movie description: </h4>
      <p class="text-secondary"> {{ movie.description }} </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MovieListItemPage',
  data() {
    return {
      loading: false,
      movie: null,
    }
  },
  created() {
    this.loading = true;
    axios.get('movies/' + this.$route.params.id)
      .then(
        response => {
          this.movie = response.data;
          this.loading = false;
        }
      ).catch(
        error => {
          if (error.response.status === 404){
            this.$wkToast(error.response.data.error);
            this.$router.push('/movies');
          } else {
            alert('Server error, try again');
          }
        }
      )
  },
}
</script>