<template>
  <div class="movie-card">
    <a href="javascript:void(0)" @click="openMoviePage" class="movie-card card text-white bg-dark">
      <img class="card-img-top" :src="movie.cover_image_url" alt="Card image cap">
      <div class="card-body">
        <h3 class="card-title">{{ movie.title }}</h3>
        <h6 class="card-subtitle mb-2 text-muted">{{ movie.genre.name }}</h6>
        <p class="card-text">{{ truncatedDescription }}</p>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'MovieListItem',
  props: ['movie'],
  computed: {
    truncatedDescription() {
      if (this.movie.description.length > 100){
        return this.movie.description.substring(0, 99) + '...';
      } else {
        return this.movie.description;
      }
    }
  },
  methods: {
    openMoviePage() {
      this.$router.push('/movies/' + this.movie.id)
    }
  }
}
</script>

<style scoped>
.movie-card {
  margin-left: 40px;
  margin-bottom: 40px;
  max-width: 450px;
  width: 450px;
}

.movie-card.card {
  height: 350px;
}

img {
  height: 200px;
}
a {
  text-decoration: none;
}
</style>