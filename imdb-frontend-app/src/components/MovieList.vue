<template>
  <div class="card-deck">
    <MovieListItem
      v-for="movie in movieList"
      :key="movie.id"
      :movie="movie"/>
  </div>
</template>

<script>
import MovieListItem from './MovieListItem.vue'
import axios from 'axios'

export default {
  name: 'MovieList',
  components: {
    MovieListItem
  },
  data() {
    return {
      movieList: [],
    }
  },
  created() {
    axios.get('movies')
      .then(
        response => {
          this.movieList = response.data;
        }
      ).catch(
        error => {
          if (error.response.status === 401){
            this.$router.push('/login');
          } else {
            alert('Server error, try again');
          }
        }
      )
  },
}
</script>