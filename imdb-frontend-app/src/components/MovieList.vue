<template>
  <div class="form-inline justify-content-center mb-3">
    <div class="form-group mr-5">
      <label for="search" class="h5 mr-3">Search (movie title): </label>
      <input id="search" v-debounce="searchMovies" type="text" class="form-control w-50" placeholder="Title">
    </div>
    <div class="form-group">
      <label for="filter" class="h5 mr-3">Filter (by genre): </label>
      <select @change="filterMovies" id="filter" class="form-control w-45 custom-select" v-model="genre">
        <option selected value="all"> All </option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id"> {{ genre.name }} </option>
      </select>
    </div>
  </div>
  <div class="card-deck">
    <MovieListItem
      v-for="movie in movieList"
      :key="movie.id"
      :movie="movie"/>
  </div>
  <MovieListPagination v-if="paginationData.total !== 0" :data="paginationData" @changeData="changeData"/>
  <h2 v-if="movieList.length === 0"> No movies found </h2>
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
      genres: [],
      genre: 'all',
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

    axios.get('genres')
      .then(
        response => {
          this.genres = response.data;
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
              this.movieList = response.data.data;
              this.paginationData = response.data;
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
            this.paginationData = response.data;
          }
        ).catch(
          error => {
            alert('Server error, try again');
          }
        )

    },

    filterMovies() {
      if (this.genre === 'all'){
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
        return;
      }

      const data = {
        genre_id: this.genre,
      }

      axios.get('movies/filter', { params: data })
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
    
    changeData(data) {
      this.movieList = data.data;
      this.paginationData = data;
      window.scrollTo(0, 0);
    }
  }
}
</script>