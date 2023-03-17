<template>
    <div>
    <div><h3>{{ title }}</h3></div> 
     <div class="post-body overflow-hidden">{{ content }}</div> 
     <!-- <div v-for="(image, index) in img" :key="index"> -->
        <v-img class="my-5" v-if="img" :src="img" width="auto" height="30vh"></v-img>
    <!-- </div> -->
     <v-divider />
<CommentsPosts 
:comments="comments"
/>
     <v-divider />
     <div>{{ date }}</div> 
     <div>{{ time }}</div> 
    </div>
</template>

<script>
import CommentsPosts from '../CommentsPosts'
export default {
    name : 'PostBlock',
    components : { CommentsPosts },

        props: {
            title : String,
            content : String,
            img : String,
            date : String,
            time : String,
            comments : Array
        }
    }
</script>

<style scoped>
.post-body {
  max-height:76px;
}
</style>