<template>
  <v-container>
    <LoadingPage v-if="loadingData" />
    <v-container class="wrap d-flex justify-center">
      <div class="pa-4 d-none d-md-flex d-lg-flex d-xl-flex">
        <v-img
          max-height="200"
          max-width="200"
          src="https://cdn-irec.r-99.com/sites/default/files/imagecache/250i/pictures/picture-575475-9b2fd.jpg"
        ></v-img>
      </div>
      <div class="d-flex flex-column align-center justify-center">
        <div>
          <PagePagination
            class="paginationBlock"
            :currentPage="currentPage"
            :quantyPages="quantyPages"
            @handleChangeCurrentPage="handleChangeCurrentPage"
          />
          <PostPagination
            class="postPagination"
            :quantityShowPost="quantityShowPost"
            @handleShowQuantityPosts="handleShowQuantityPosts"
          />
        </div>

        <div
          class="post rounded-lg pa-4 elevation-10"
          v-for="post in showPosts"
          :key="post.id"
        >
          <PostBlock
            :title="post.title"
            :excerpt="post.excerpt"
            :content="post.content"
            :img="post.img"
            :date="post.date"
            :time="post.time"
            :comments="post.comments"
            :IDPost="post.id"
          />
        </div>
        <div>
          <PagePagination
            class="paginationBlock"
            :currentPage="currentPage"
            :quantyPages="quantyPages"
            @handleChangeCurrentPage="handleChangeCurrentPage"
          />
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PagePagination from "../PagePagination/";
import PostPagination from "../PostPagination/";
import LoadingPage from "../LoadingPage/";
import PostBlock from "../PostBlock";
export default {
  name: "BlogPage",
  components: { PagePagination, LoadingPage, PostBlock, PostPagination },
  data() {
    return {
      quantityShowPost: [1, 2, 5, 10],
      currentPage: 1,
      currentQuantyPost: 2,
    };
  },
  created() {
    this.getRequestPosts([this.currentQuantyPost, this.currentPage]);
  },
  methods: {
    ...mapActions(["getRequestPosts"]),
    handleChangeCurrentPage($event) {
      if (this.currentPage !== $event) {
        this.currentPage = $event;
        this.getRequestPosts([this.currentQuantyPost, this.currentPage]);
      }
    },
    handleShowQuantityPosts(event) {
      this.currentQuantyPost = event;
      this.getRequestPosts([this.currentQuantyPost, 1]);
    },
  },
  computed: {
    ...mapGetters(["showPosts", "loadingData", "showQuantityPostsOnServer"]),
    quantyPages() {
      return Math.ceil(this.showQuantityPostsOnServer / this.currentQuantyPost);
    },
  },
};
</script>

<style scoped>
.wrap {
  max-width: 1200px;
}
.post {
  background: #5c8eebe7;
  color: #ffffff;
  animation-duration: 0.5s;
  animation-name: post;
  animation-iteration-count: 1;
  animation-direction: reverse;
  animation-fill-mode: forwards;
}
@keyframes post {
  from {
    margin: 10px 10px;
    width: 80%;
  }
  to {
    margin-top: 100%;
    width: 100%;
  }
}
.paginationBlock {
  width: 300px;
}
.postPagination {
  width: 300px;
}
</style>
