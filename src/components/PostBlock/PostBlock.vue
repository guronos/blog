<template>
    <div>
    <div><h3>{{ title }}</h3></div> 
    <div v-if="excerpt.length">
     <div v-if="!fullContent">{{ excerpt }}<span @click="fullContent=true" class="post-link text-decoration-underline">Подробнее...</span></div> 
    
     <div v-else>
        {{ content }}
        <div class="post-link text-decoration-underline" @click="fullContent=false">Скрыть</div>
    </div></div>
    <div v-else>{{ content }}</div>
       <v-img class="my-5 image-wrap" v-if="img" :src="img"></v-img>
     <v-divider class="my-1" />
<CommentsPosts class="my-2"
:comments="comments"
:IDPost="IDPost"
/>
     <v-divider class="my-1" />
     <div class="d-flex">
     <div>{{ date }}</div> 
     <div class="mx-2">{{ time }}</div> 
    </div>
    </div>
</template>

<script>
import CommentsPosts from '../CommentsPosts'
export default {
    name : 'PostBlock',
    components : { CommentsPosts },

        props: {
            title : String,
            excerpt : String,
            content : String,
            img : String,
            date : String,
            time : String,
            comments : Number,
            IDPost : Number
        },
        data (){
            return {
                fullContent : false
            }
        }
    }
</script>

<style lang="scss" scoped>
.post-link {
    cursor: pointer;
    color: blue;
}
.image-wrap {
max-width: 900px;
@media (max-width: 960px) {
    max-width: 500px;
}
@media (max-width: 600px) {
    max-width: 300px;
}
}
</style>