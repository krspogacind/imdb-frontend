<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <div  v-for="link in data.links" :key="link.label">
        <li class="page-item" :class="{ disabled: !link.url || link.active }">
          <a class="page-link" :class="{ 'text-success':  link.url && !link.active, 'bg-success': link.active }" href="javascript:void(0)" @click="handleClick(link.url)"><span v-html="link.label"></span></a>
        </li>
      </div>
      <p class="ml-3 mt-2 text-secondary"> Showing {{ data.from }} to {{ data.to }} of {{ data.total }} movies
    </ul>
  </nav>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MovieListPagination',
  props: ['data'],
  methods: {
    handleClick(url) {
      const index = url.indexOf("movies");
      const relativeUrl = url.slice(index, url.length);
      
      axios.get(relativeUrl)
      .then(
        response => {
          this.$emit('changeData', response.data);
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

<style scoped>
li:disabled {
  color: text-secondary;
}
</style>