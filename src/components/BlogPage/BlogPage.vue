<template>
  <v-container class="container-blog">
<LoadingPage v-if="loadingData" />
    <v-container class="wrap d-flex justify-center cyan lighten-5">
      <div class="pa-4">
        <v-img max-height="200" max-width="200" src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
      </div>
    <div class="d-flex flex-column align-start">
      <div class="paginationBlock">
        <ItemsPaginations 
    :quantityShowPost="quantityShowPost"
    :currentPage="currentPage"
    @handleChangeCurrentPage='handleChangeCurrentPage'
    @handleShowQuantityPosts="handleShowQuantityPosts"
        />
      </div>
      
      <div class="post secondary rounded-lg pa-4 elevation-10 " v-for="post in showPosts" :key="post.id">
        <PostBlock 
        :title="post.title"
        :content="post.content"
        :img="post.img"
        :date="post.date"
        
        />
        {{currentPage}}
    </div>
    <ItemsPaginations class="paginationBlock" 
    :quantityShowPost="quantityShowPost"
    :currentPage="currentPage"
    @handleChangeCurrentPage='handleChangeCurrentPage'
    @handleShowQuantityPosts="handleShowQuantityPosts"
    
    />
  </div>
  </v-container>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemsPaginations from '../ItemsPagination/'
import LoadingPage from '../LoadingPage/'
import PostBlock from '../PostBlock'
export default {
  name : 'BlogPage',
  components : { ItemsPaginations, LoadingPage, PostBlock },
data () {
  return {
    quantityShowPost : [1, 2, 5, 10],
    currentPage : 1,
    currentQuantyPost : 1
  }
}, 
created() {
  console.log(`created ${this.currentQuantyPost}, ${this.currentPage}`)
  this.requestPosts(this.routeToPosts, this.currentQuantyPost, this.currentPage)
}, methods : {
  ...mapActions(['requestPosts']),
  handleChangeCurrentPage($event) {
    this.currentPage = $event
    console.log(`handleChangeCurrentPage ${this.currentQuantyPost}, ${this.currentPage}`)
    this.requestPosts(this.routeToPosts, this.currentQuantyPost, this.currentPage)
},
handleShowQuantityPosts (event) {
  this.currentQuantyPost = event
  console.log(`handleShowQuantityPosts ${this.currentQuantyPost}, ${this.currentPage}`)
      this.requestPosts(this.routeToPosts, this.currentQuantyPost, this.currentPage)
}
},
computed : {
  ...mapGetters(['showPosts', 'routeToPosts', 'loadingData']),
},
}
</script>

<style scoped>
.wrap {
  max-width: 1200px;
}
.container-blog {
height: 100vh;
}
.post {
  margin: 10px 10px;
  border: 1px solid #000;
  max-width: 800px;
}
/* .post-body {
  max-height:76px;
} */
/* .loading {
width: 100vw;
height: 100vh;
background: #ffffff;
display: flex;
justify-content: center;
align-items: center;
} */
</style>