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
      <h4 class="text-secondary mt-3">Movie description: </h4>
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
    <div class="border border-secondary rounded justify-content-center mb-4">
      <h4 class="text-secondary mt-3">Movie comments: </h4>
      <button v-if="user && !showTextArea" class="btn btn-warning mb-4" @click="showTextArea = true"> Add comment </button>
      <button v-if="showTextArea" class="btn btn-success mb-4" @click="addComent"> Submit comment </button>
      <button v-if="showTextArea" class="btn btn-secondary ml-4 mb-4" @click="showTextArea = false"> Cancel </button>
      <br>
      <small>
        {{  errorMessage  }}
      </small>
      <textarea @input="deleteMessage" v-if="showTextArea" class="form-control ml-4 mb-4 comment" v-model="commentContent" placeholder="Comment" rows="3"></textarea>
      <div v-for="comment in comments" :key="comment.id" class="ml-4 mb-4">
        <div class="border border-secondary rounded comment">
          <b> {{ comment.user.name }} </b>
          <div> {{ comment.content }} </div>
        </div>
        <small class="text-secondary float-left ml-3"> {{ comment.created_at }} </small>
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
      showTextArea: false,
      commentContent: '',
      errorMessage: '',
      comments: [],
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

    axios.get('movies/comment/' + this.$route.params.id)
      .then(
        response => {
          response.data.forEach(element => {
            const index = element.created_at.indexOf('.');
            element.created_at = element.created_at.slice(0, index).replace('T', ' ');

          });
          this.comments = response.data;
        }
      ).catch(
        error => {
          if (error.response.status === 401){
            this.$wkToast('Need to login to see movie comments');
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

    },

    addComent() {
      if (this.commentContent === '') {
        this.errorMessage = "Comment is empty"
        return;
      }
      if (this.commentContent.length > 500) {
        this.errorMessage = "Comment is longer than 500 characters"
        return;
      }

      const data = {
        movie_id: this.movie.id,
        content: this.commentContent,
      }

      this.showTextArea = false;

      axios.post('movies/comment', data)
      .then(
        response => {
          const comment = response.data.comment[0];
          const index = comment.created_at.indexOf('.');
          comment.created_at = comment.created_at.slice(0, index).replace('T', ' ');
          this.comments.unshift(comment);
          this.$wkToast(response.data.message);
        }
      ).catch(
        error => {
          if (error.response.status === 401){
            this.$wkToast('Need to login to comment movies');
          } else {
            alert('Server error, try again');
          }
        }
      )
    },

    deleteMessage() {
      if (this.errorMessage !== null){
        this.errorMessage = null;
      }
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

.comment {
  width: 95%;
}

small {
  color: red;
}
</style>