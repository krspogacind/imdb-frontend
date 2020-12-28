<template>
  <div class="card-deck">
    <MovieListItem
      v-for="movie in movieList"
      :key="movie.id"
      :movie="movie"/>
  </div>
  <MovieListPagination :data="paginationData" @changeData="changeData"/>
</template>

<script>
import MovieListItem from './MovieListItem.vue'
import MovieListPagination from './MovieListPagination.vue'
import axios from 'axios'

export default {
  name: 'MovieList',
  components: {
    MovieListItem,
    MovieListPagination
  },
  data() {
    return {
      movieList: [],
      paginationData: [],
    }
  },
  created() {
    axios.get('movies')
      .then(
        response => {
          this.movieList = response.data.data;
          this.paginationData = response.data;
        }
      ).catch(
        error => {
          alert('Server error, try again');
        }
      )
  },
  methods: {
    changeData(data) {
      this.movieList = data.data;
      this.paginationData = data;
      window.scrollTo(0, 0);
    }
  }
}
</script>