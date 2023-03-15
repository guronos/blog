<template>
    <div>
    <div><h3>{{ title }}</h3></div> 
     <div class="post-body overflow-hidden">{{ content }}</div> 
     <div v-for="(image, index) in img" :key="index">
        <v-img class="my-5" :src="image" width="auto" height="30vh"></v-img>
    </div>
     <v-divider />
     <div>{{ date }}</div> 
    </div>
</template>

<script>
export default {
    name : 'PostBlock',

        props: {
            title : String,
            content : String,
            img : Array,
            date : String
        }
    }
</script>

<style scoped>
.post-body {
  max-height:76px;
}
</style>