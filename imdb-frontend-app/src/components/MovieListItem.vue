<template>
  <div class="movie-card">
    <div class="movie-card card border-secondary">
      <a class="text-white bg-dark" href="javascript:void(0)" @click="openMoviePage">
        <img class="card-img-top img" :src="movie.cover_image_url" alt="Card image cap" />
        <div class="card-body">
          <h3 class="card-title">{{ movie.title }}</h3>
          <h6 class="card-subtitle mb-2 text-muted">{{ movie.genre.name }}</h6>
          <p class="card-text">{{ truncatedDescription }}</p>
        </div>
      </a>
      <div class="card-footer">
        <div class="float-left d-inline text-secondary mt-1">
          <p> Page views: {{ movie.view_count }} </p>
        </div>
        <div class="d-inline float-right text-secondary">
          <a href="javascript:void(0)" @click="like(true)">
            <img v-if="!isLiked"  id="like" class="icon" src="../assets/like.png" /> 
            <img v-else id="like" class="icon" src="../assets/like_done.png" /> 
          </a>
          {{ likes }}
          <a href="javascript:void(0)" @click="like(false)">
            <img v-if="!isDisliked" id="dislike" class="icon ml-3" src="../assets/dislike.png" />
            <img v-else id="dislike" class="icon ml-3 mr-3" src="../assets/dislike_done.png" />
          </a>
          {{ dislikes }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'MovieListItem',
  props: ['movie'],
  data() {
    return {
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
    truncatedDescription() {
      if (this.movie.description.length > 100){
        return this.movie.description.substring(0, 99) + '...';
      } else {
        return this.movie.description;
      }
    },
  },
  created() {
    const likes = this.movie.reactions.filter(element => element.reaction === 'like');
    this.likes = likes.length;

    const dislikes = this.movie.reactions.filter(element => element.reaction === 'dislike');
    this.dislikes = dislikes.length;

    if (this.user !== null){
      this.movie.reactions.forEach(element => {
        if (element.user_id === this.user.id){
          if (element.reaction === 'like'){
            this.isLiked = true;
          } else {
            this.isDisliked = true;
          }
        }
      });
    }
  },
  methods: {
    openMoviePage() {
      this.$router.push('/movies/' + this.movie.id)
    },

    like(flag) {
      const like = flag ? 'like' : 'dislike';
      const data = {
        movie_id: this.movie.id,
        reaction: like,
      }

      axios.post('movies/reaction', data)
      .then(
        response => {
          if (flag){
            this.likes = this.likes + 1;
            this.isLiked = true;
          } else {
            this.dislikes = this.dislikes + 1;
            this.isDisliked = true;
          }
          this.$wkToast(response.data.message);
        }
      ).catch(
        error => {
          if (error.response.status === 401){
            this.$wkToast('Need to login to like/dislike movies');
          } else if(error.response.status === 409) {
            this.$wkToast(error.response.data.error);
          } else {
            alert('Server error, try again');
          }
        }
      )

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
  height: 410px;
}

.img {
  height: 200px;
}
a {
  text-decoration: none;
}

.icon {
  width: 30px;
  height: 30px;
}
</style>