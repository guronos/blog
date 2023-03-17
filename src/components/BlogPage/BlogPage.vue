<template>
  <v-container class="container-blog">
<LoadingPage v-if="loadingData" />
    <v-container class="wrap d-flex justify-center cyan lighten-5 container-blog">
      <div class="pa-4">
        <v-img max-height="200" max-width="200" src="https://cdn-irec.r-99.com/sites/default/files/imagecache/250i/pictures/picture-575475-9b2fd.jpg"></v-img>
      </div>
    <div class="d-flex flex-column align-start">
      <div>
        <PagePagination 
        class="paginationBlock"
    :currentPage="currentPage"
    :quantyPages='quantyPages'
    @handleChangeCurrentPage='handleChangeCurrentPage'
    
        />
        <PostPagination 
        class="postPagination"
        :quantityShowPost="quantityShowPost"
        @handleShowQuantityPosts="handleShowQuantityPosts"
        />
      </div>
      
      <div class="post secondary rounded-lg pa-4 elevation-10 " v-for="post in showPosts" :key="post.id">
        <PostBlock 
        :title="post.title"
        :content="post.content"
        :img="post.img"
        :date="post.date"
        :time="post.time"
        :comments="post.comments"
        
        />
    </div>
    <div>
        <PagePagination 
        class="paginationBlock"
    :currentPage="currentPage"
    :quantyPages='quantyPages'
    @handleChangeCurrentPage='handleChangeCurrentPage'
    
        />
      </div>
  </div>
  </v-container>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PagePagination from '../PagePagination/'
import PostPagination from '../PostPagination/'
import LoadingPage from '../LoadingPage/'
import PostBlock from '../PostBlock'
export default {
  name : 'BlogPage',
  components : { PagePagination, LoadingPage, PostBlock, PostPagination },
data () {
  return {
    quantityShowPost : [1, 2, 5, 10],
    currentPage : 1,
    currentQuantyPost : 2,
    // text : "Постов на странице"
  }
}, 
created() {
  // console.log(`created ${this.currentQuantyPost}, ${this.currentPage}`)
  this.getRequestPosts([this.currentQuantyPost, this.currentPage])
}, methods : {
  ...mapActions(['getRequestPosts']),
  handleChangeCurrentPage($event) {
    if (this.currentPage !== $event) {
    this.currentPage = $event
    console.log(`handleChangeCurrentPage ${this.currentQuantyPost}, ${this.currentPage}`)
    this.getRequestPosts([this.currentQuantyPost, this.currentPage])
    }
},
handleShowQuantityPosts (event) {
  this.currentQuantyPost = event
  console.log(`handleShowQuantityPosts ${this.currentQuantyPost}, ${this.currentPage}`)
  this.getRequestPosts([this.currentQuantyPost, 1])
},
},
computed : {
  ...mapGetters(['showPosts', 'loadingData', 'showQuantityPostsOnServer']),
  quantyPages(){
    console.log('Match '+Math.ceil(this.showQuantityPostsOnServer / this.currentQuantyPost))
    return Math.ceil(this.showQuantityPostsOnServer / this.currentQuantyPost)
  }
},
}
</script>

<style scoped>
.wrap {
  max-width: 1200px;
}
.container-blog {
/* height: 100vh; */
margin-bottom: -20px;
}
.post {
  margin: 10px 10px;
  border: 1px solid #000;
  width: 800px;
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
.paginationBlock {
  width: 300px;
}
.postPagination {
  width: 300px;
}
</style>