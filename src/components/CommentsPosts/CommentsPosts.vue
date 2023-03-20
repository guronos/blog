<template>
  <div>
    <div @click="getComments(IDPost)">
        <div v-if="!showComments">
          <i class="far fa-comments"></i> {{getCountComment(comments, arrayComments.length)}}
        </div> 
        <div v-else @click.stop="showComments=false">
            Скрыть комментарии
        </div>
    </div>
    <div v-if="showComments">
    <div v-for="(comment, ind) in arrayComments" :key="ind">
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
    <v-btn @click="getStatusAuthorization()" v-if="!addComment">Комментировать</v-btn>
    <div v-if="addComment">
        <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="comment">
            <v-text-field
              v-model="message"
              outlined
              clearable
              label="Комментарий"
              type="text"
            >
              <template v-slot:append>
                <v-fade-transition leave-absolute>
                  <v-progress-circular
                  class="mx-4"
                    v-if="loading"
                    @click="clickMe"
                    size="24"
                    color="info"
                    indeterminate
                  ></v-progress-circular>
                </v-fade-transition>
              </template>
            </v-text-field>
            <router-link to="/authorization"><v-alert type="error" v-if="notAuthorization">
        Для отправки комментария Вам необходимо авторизоваться!
      </v-alert></router-link>
      <v-alert type="error" v-if="errorText">
        {{errorText}}
      </v-alert>
            <v-btn @click="handlePutComment(IDPost)"><i class="far fa-paper-plane"></i>Отправить</v-btn>
            <v-btn @click="addComment=!addComment">Отменить</v-btn>
            </div>
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
    comments : Number,
    IDPost : Number
},
data () {
    return {
      arrayComments : [],
        showComments:false,
        addComment : false,
        message: '',
        loading: false,
        newComment : {},
        showNewComment : false,
        notAuthorization : false,
        errorText : ''
    }
}, methods: {
    clickMe () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
}, getStatusAuthorization () {
  if (!localStorage.getItem('token')){
        this.notAuthorization = true
}
this.addComment=!this.addComment
},
getCountComment(countCommentProps, lengthArrayComments){
  if (lengthArrayComments===0 && countCommentProps>=10) {
    return `Больше 10 комментариев`
  }
  let countComment = lengthArrayComments>0 ? lengthArrayComments :countCommentProps
    if (countComment === 0){
      return `Комментариев нет`
    } else if (countComment === 1 || (countComment%10===1 && countComment%11!=0)) {
            return `${countComment} Комментарий`
        } else if ((countComment === 2 || (countComment%10===2 && countComment%12!=0)) || (countComment === 3 || (countComment%10===3 && countComment%13!=0) || (countComment === 4 || (countComment%10===4 && countComment%14!=0)))) {
            return `${countComment} Комментария`
        } else {
            return `${countComment} Комментариев`
        }
    },
    async handlePutComment(postId, parentPost=0) {
      if (!localStorage.getItem('token')){
        this.notAuthorization = true
        return 
    } else {
      const validationToken = await fetch('http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    if (validationToken.statusText === 'OK'){
      let getUserData = await fetch('http://chub96u7.beget.tech/wp-json/wp/v2/users/me?_fields=id,name', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      let userData = getUserData.json()
      let createComment = await fetch('http://chub96u7.beget.tech/wp-json/wp/v2/comments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        author : userData.id,
        author_name : userData.name,
        content : this.message,
        post : postId,
        parent : parentPost
      })
    })
    this.message = ''
    let responseCreateComment = await createComment.json()
    if (responseCreateComment.status === "approved") {
this.newComment = {
  'avatar' : responseCreateComment.author_avatar_urls[24],
  'author_name' : responseCreateComment.author_name,
  'content' : responseCreateComment.content.rendered,
  'date' : responseCreateComment.date.match(/(\S+)\T(\S+)/)[1].split('-').reverse().join('.'), 
  'time' : responseCreateComment.date.match(/(\S+)\T(\S+)/)[2],
  'parent' : responseCreateComment.parent,
  'post' : responseCreateComment.post
    }
    console.log(responseCreateComment)
    this.errorText = ''
    this.getComments(postId)
    this.showComments =true
      return
    } else {
      this.errorText = responseCreateComment.message
      return
    }
    }
}
}, async getComments(postID){
  // this.showComments=!this.showComments
  this.showComments=true
  this.arrayComments = []
  try{
// const arrayComments = [];
const getCommentsData = await fetch(`http://chub96u7.beget.tech/wp-json/wp/v2/comments?post=${postID}&per_page=40`)
const commentData = await getCommentsData.json()

commentData.reverse().forEach(i=>this.arrayComments.push({
  'id' : i.id,
  'parent' : i.parent,
  'author_name' : i.author_name,
  'content' : i.content.rendered,
  'date' : i.date.match(/(\S+)\T(\S+)/)[1].split('-').reverse().join('.'), //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время, "переворачиваем" дату к формату ДД.ММ.ГГГГ
  'time' : i.date.match(/(\S+)\T(\S+)/)[2], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
  'avatar' : i.author_avatar_urls['24']
}));
// console.log('arrcom', arrayComments)
console.log(this.arrayComments)

  // return arrayComments
} catch (e){
  return
}
  }
}}

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
