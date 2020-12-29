<template>
  <div class="form-group form-inline">
    <label for="search" class="h5 ml-auto mr-3">Search (movie title): </label>
    <input id="search" v-debounce="searchMovies" type="text" class="form-control form-control-lg w-25 mr-auto" placeholder="Title">
  </div>
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
          alert('Server error, try again');
        }
      )
  },
  methods: {
    searchMovies(value, e) {
      if (value === ''){
        axios.get('movies')
          .then(
            response => {
              this.movieList = response.data;
            }
          ).catch(
            error => {
              alert('Server error, try again');
            }
        )
        return;
      }
      
      const data = {
        title: value,
      }

      axios.get('movies/search', { params: data })
      .then(
        response => {
          this.movieList = response.data.data;
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