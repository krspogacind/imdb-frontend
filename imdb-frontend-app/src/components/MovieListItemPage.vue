<template>
  <div v-if="loading">
    Loading...
  </div>
  <div class="d-flex flex-column w-50 ml-auto mr-auto" v-if="movie">
    <div class="bg-secondary rounded">
      <h1 class="text-white"> {{ movie.title }} </h1> 
      <h4 class="text-white"> {{ movie.genre.name }} </h4>
      <div class="float-right d-inline mr-3 text-white">
        <small> Page views: {{ viewsCount }} </small>
      </div>
    </div>
    <img class="img-fluid rounded mw-100" style="height: auto" :src="movie.cover_image_url" alt="Movie image">
    <div class="border border-secondary rounded">
      <h4 class="text-secondary">Movie description: </h4>
      <p class="text-secondary"> {{ movie.description }} </p>
      <div class="text-right text-secondary mr-3 mb-3">
        <a href="javascript:void(0)" @click="like(true)">
          <img v-if="!isLiked"  id="like" class="icon" src="../assets/like.png" /> 
          <img v-else id="like" class="icon" src="../assets/like_done.png" /> 
        </a>
        {{ likes }}
        <a href="javascript:void(0)" @click="like(false)">
          <img v-if="!isDisliked" id="dislike" class="icon ml-3" src="../assets/dislike.png" />
          <img v-else id="dislike" class="icon ml-3" src="../assets/dislike_done.png" />
        </a>
        {{ dislikes }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'MovieListItemPage',
  data() {
    return {
      loading: false,
      movie: null,
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      viewsCount: 0
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  created() {
    this.loading = true;
    axios.get('movies/' + this.$route.params.id)
      .then(
        response => {
          this.movie = response.data;
          this.loading = false;
          this.addReactions();
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
    
    axios.put('movies/' + this.$route.params.id + '/views')
      .then(
        response => {
          this.viewsCount = response.data.view_count;
        }
      ).catch(
        error => {
          if (error.response.status === 404){
            this.$wkToast(error.response.data.error);
            this.$router.push('/movies');
          } else if (error.response.status === 401) {
            this.$wkToast('Need to login to see movie page');
            this.$router.push('/login');
          } else {
            alert('Server error, try again');
          }
        }
      )
  },
  methods: {
    addReactions() {
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
a {
  text-decoration: none;
}

.icon {
  width: 30px;
  height: 30px;
}
</style>