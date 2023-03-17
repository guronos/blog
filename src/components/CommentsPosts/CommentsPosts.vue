<template>
  <div>
    <div @click="showComments=!showComments">
        <div v-if="!showComments">
            Комментарии: {{comments.length}}
        </div> 
        <div v-else>
            Скрыть комментарии
        </div>
    </div>
    <div v-if="showComments">
    <div v-for="comment in comments" :key="comment.id">
        <div class="comment my-4">
            <v-img :src="comment.avatar" width="24"></v-img>
        <h5>{{ comment.author_name }}</h5>
        <div>
            {{ comment.content }}
        </div>
        <v-divider />
        <div>
            <div>{{ comment.date }}</div>
            <div>{{ comment.time }}</div>
        </div>
        </div>
    </div>    
    </div>
    <v-btn @click="getComment=!getComment" v-if="!getComment">Оставить комментарий</v-btn>
    <div v-if="getComment">
        <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="message"
              outlined
              clearable
              label="Комментарий"
              type="text"
            >
              <template v-slot:prepend>
                <v-tooltip
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  Не держи в себе, выскажись!
                </v-tooltip>
              </template>
              <template v-slot:append>
                <v-fade-transition leave-absolute>
                  <v-progress-circular
                    v-if="loading"
                    @click="clickMe"
                    size="24"
                    color="info"
                    indeterminate
                  ></v-progress-circular>
                </v-fade-transition>
              </template>

            </v-text-field>
            <div>dfgdg</div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    </div>
  </div>
</template>

<script>
export default {
name: 'CommentsPosts',
props : {
    comments : Array
},
data () {
    return {
        showComments:false,
        getComment : true,
        message: '',
        loading: false,
    }
}, methods: {
    clickMe () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
}}}


/* 
await fetch('http://chub96u7.beget.tech/wp-json/wp/v2/users', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY2h1Yjk2dTcuYmVnZXQudGVjaCIsImlhdCI6MTY3ODk2MjY0MSwibmJmIjoxNjc4OTYyNjQxLCJleHAiOjE2Nzk1Njc0NDEsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.1bOwlGuSSYCO0FDfF6ZBGXvnq7VraEwTpr6QzNsfDro',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        author : this.id,
        author_name : this.name,
        content : 'text',
        post : this.postID
      })
    })
*/
</script>

<style>
.comment {
    border: 2px solid #d42929;
}
</style>
