<template>
  <div>
    <div @click="getComments(IDPost)">
      <div v-if="!showComments">
        <i class="far fa-comments"></i>
        {{ getCountComment(comments, arrayComments.length) }}
      </div>
      <div v-else @click.stop="showComments = false">Скрыть комментарии</div>
    </div>
    <div v-if="showComments">
      <div v-for="(comment, ind) in arrayComments" :key="ind">
        <v-card
          color="#B0C4DE"
          v-if="comment.parent === 0"
          class="my-4 pb-2"
        >
          <div class="commentator mx-2">
            <div><v-img :src="comment.avatar" width="24px"></v-img></div>
            <h5 class="ml-3">{{ comment.author_name }}</h5>
          </div>
          <v-divider class="ma-2" />
          <div class="mx-2">
            {{ comment.content }}
          </div>
          <v-divider class="ma-2" />
          <div>
            <div class="d-flex mx-2">
              <div>{{ comment.date }}</div>
              <div class="mx-2">{{ comment.time }}</div>
            </div>
            <v-btn
              color="#5c8eebe7"
              class="ma-2 white--text"
              @click="getStatusAuthorization(true, ind)"
              >Ответить</v-btn
            >
            <div v-for="(comm, indx) in arrayComments" :key="indx">
              <div v-if="comm.parent === comment.id">
                <v-card color="#F0F8FF" class="my-2 ml-10" max-width="90%">
                  <div class="commentator mx-2">
                    <div><v-img :src="comm.avatar" width="24px"></v-img></div>
                    <h5 class="ml-3">{{ comm.author_name }}</h5>
                  </div>
                  <v-divider class="ma-2" />
                  <div class="mx-2">
                    {{ comm.content }}
                  </div>
                  <v-divider class="ma-2" />
                  <div class="d-flex mx-2">
                    <div>{{ comm.date }}</div>
                    <div class="mx-2">{{ comm.time }}</div>
                  </div>
                </v-card>
              </div>
            </div>
            <div v-if="ind === childCommentID">
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-card color="#c1d9ee" class="pa-1">
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

                        <v-alert type="error" v-if="errorText">
                          {{ errorText }}
                        </v-alert>
                        <v-btn
                          color="#5c8eebe7"
                          class="mx-3 white--text"
                          @click="handlePutComment(IDPost, comment.id)"
                          ><i class="far fa-paper-plane mr-2"></i
                          >Отправить</v-btn
                        >
                        <v-btn
                          color="#5c8eebe7"
                          class="white--text"
                          @click="childCommentID = ''"
                          >Отменить</v-btn
                        >
                        <div class="d-flex justify-center ma-2">
                          <router-link
                            to="/authorization"
                            class="text-decoration-none"
                            ><v-alert
                              class="alert-message"
                              type="error"
                              v-if="notAuthorization"
                            >
                              Для отправки комментария Вам необходимо
                              авторизоваться!
                            </v-alert></router-link
                          >
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </div>
          </div>
        </v-card>
      </div>
    </div>
    <v-btn color="#B0C4DE" @click="getStatusAuthorization()" v-if="!addComment"
      >Комментировать</v-btn
    >
    <div v-if="addComment">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card color="#c1d9ee" class="pa-1">
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

                <v-alert type="error" v-if="errorText">
                  {{ errorText }}
                </v-alert>
                <v-btn
                  color="#5c8eebe7"
                  class="mx-3 white--text"
                  @click="handlePutComment(IDPost)"
                  ><i class="far fa-paper-plane mr-2"></i>Отправить</v-btn
                >
                <v-btn
                  color="#5c8eebe7"
                  class="white--text"
                  @click="addComment = !addComment"
                  >Отменить</v-btn
                >
                <div class="d-flex justify-center ma-2">
                  <router-link to="/authorization" class="text-decoration-none"
                    ><v-alert type="error" v-if="notAuthorization">
                      Для отправки комментария Вам необходимо авторизоваться!
                    </v-alert></router-link
                  >
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
import { checkToken } from "../../assets/scripts/index.js"
export default {
  name: "CommentsPosts",
  props: {
    comments: Number,
    IDPost: Number,
  },
  data() {
    return {
      arrayComments: [],
      addChildComment: false,
      showComments: false,
      addComment: false,
      message: "",
      loading: false,
      newComment: {},
      showNewComment: false,
      notAuthorization: false,
      errorText: "",
      childCommentID: "",
    };
  },
  methods: {
    clickMe() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    getStatusAuthorization(childComment = false, id = "") {
      if (!localStorage.getItem("token")) {
        this.notAuthorization = true;
      }
      if (childComment) {
        this.addChildComment = !this.addChildComment;
        this.childCommentID = id;
      } else {
        this.addComment = !this.addComment;
      }
    },
    getCountComment(countCommentProps, lengthArrayComments) {
      if (lengthArrayComments === 0 && countCommentProps >= 10) {
        return `Больше 10 комментариев`;
      }
      const countComment =
        lengthArrayComments > 0 ? lengthArrayComments : countCommentProps;
      if (countComment === 0) {
        return `Комментариев нет`;
      } else if (
        countComment === 1 ||
        (countComment % 10 === 1 && countComment % 11 !== 0)
      ) {
        return `${countComment} Комментарий`;
      } else if (
        countComment === 2 ||
        (countComment % 10 === 2 && countComment % 12 !== 0) ||
        countComment === 3 ||
        (countComment % 10 === 3 && countComment % 13 !== 0) ||
        countComment === 4 ||
        (countComment % 10 === 4 && countComment % 14 !== 0)
      ) {
        return `${countComment} Комментария`;
      } else {
        return `${countComment} Комментариев`;
      }
    },
    async handlePutComment(postId, parentPost = 0) {
      if (!localStorage.getItem("token")) {
        this.notAuthorization = true;
      } else {
        const validationToken = await checkToken();
        if (validationToken.statusText === "OK") {
          const getUserData = await fetch(
            "http://chub96u7.beget.tech/wp-json/wp/v2/users/me?_fields=id,name",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const userData = getUserData.json();
          const createComment = await fetch(
            "http://chub96u7.beget.tech/wp-json/wp/v2/comments",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json;charset=utf-8",
              },
              body: JSON.stringify({
                author: userData.id,
                author_name: userData.name,
                content: this.message,
                post: postId,
                parent: parentPost,
              }),
            }
          );
          this.message = "";
          const responseCreateComment = await createComment.json();
          if (responseCreateComment.status === "approved") {
            const datePublication = new Date(Date.parse(responseCreateComment.date))
            this.newComment = {
              avatar: responseCreateComment.author_avatar_urls[24],
              author_name: responseCreateComment.author_name,
              content: responseCreateComment.content.rendered,
              date: `${datePublication.getDate()} ${new Intl.DateTimeFormat("ru-RU", {month: "long",}).format(datePublication)} ${datePublication.getFullYear()}`,
              time: `${datePublication.getHours()}:${datePublication.getMinutes()}`,
              parent: responseCreateComment.parent,
              post: responseCreateComment.post,
            };
            this.errorText = "";
            this.getComments(postId);
            this.showComments = true;
          } else {
            this.errorText = responseCreateComment.message;
          }
        }
      }
    },
    async getComments(postID) {
      this.showComments = true;
      this.arrayComments = [];
      try {
        const getCommentsData = await fetch(
          `http://chub96u7.beget.tech/wp-json/wp/v2/comments?post=${postID}&per_page=40`
        );
        const commentData = await getCommentsData.json();

        commentData.reverse().forEach((i) =>{
        const datePublication = new Date(Date.parse(i.date));
          this.arrayComments.push({
            id: i.id,
            parent: i.parent,
            author_name: i.author_name,
            content: i.content.rendered,
            date: `${datePublication.getDate()} ${new Intl.DateTimeFormat("ru-RU", {month: "long",}).format(datePublication)} ${datePublication.getFullYear()}`,
            time: `${datePublication.getHours()}:${datePublication.getMinutes()}`,
            avatar: i.author_avatar_urls["24"],
          })
      });
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.commentator {
  display: flex;
  height: 30px;
  align-items: center;
}
</style>
