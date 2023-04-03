<template>
  <div id="app">
    <v-app>
      <v-card>
        <v-app-bar
          absolute
          color="#6A76AB"
          dark
          src="https://picsum.photos/1920/180?random"
          fade-img-on-scroll
          scroll-target="#scrolling-techniques-4"
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
            ></v-img>
          </template>

          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>

          <v-toolbar-title class="d-none d-sm-inline"
            >{{ showUserlogin }}, добро пожаловать в Мой блог</v-toolbar-title
          >

          <v-spacer></v-spacer>
          <div>
            <a href="https://github.com/guronos/" title="Профиль на GitHub" target="_blank" class="mx-2"
              ><i
                class="fa-brands fa-github fa-fade fa-2xl"
                style="color: #fcfcfc"
              ></i
            ></a>
            <a href="https://t.me/ichschlafe" title="Ссылка на Telegram" target="_blank" class="mx-2"
              ><i
                class="fa-regular fa-paper-plane fa-beat-fade fa-xl"
                style="color: #fcfcfc"
              ></i
            ></a>
            <v-btn
              class="mx-2"
              @click="logOut()"
              v-if="showUserlogin !== 'Гость'"
            >
              Выйти
            </v-btn>
          </div>
          <template v-slot:extension>
            <v-tabs>
              <v-tab to="/">О блоге</v-tab>
              <v-tab to="blog">Мои посты</v-tab>
              <v-tab to="authorization" v-if="showUserlogin === 'Гость'"
                >Вход</v-tab
              >
            </v-tabs>
          </template>
        </v-app-bar>
        <v-sheet id="scrolling-techniques-4">
          <v-sheet style="position: relative" class="menu">
            <v-container class="fill-height">
              <v-row align="center" justify="center"> </v-row>
            </v-container>

            <v-navigation-drawer v-model="drawer" absolute temporary>
              <v-list-item @click.stop="drawer = !drawer">
                <v-list-item-avatar>
                  <v-img src="./assets/img/avtr.jpg"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ showUserlogin }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider />

              <v-list dense>
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                  to="/feedback"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
          </v-sheet>
        </v-sheet>
      </v-card>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {
      drawer: null,
      items: [{ title: "Обратная связь", icon: "mdi-forum" }],
    };
  },
  created() {
    this.getUserName();
  },
  computed: {
    ...mapGetters(["showUserlogin"]),
  },
  methods: {
    ...mapMutations(["addUserlogin"]),
    ...mapActions(["getUserName"]),
    logOut() {
      localStorage.clear();
      this.addUserlogin("Гость");
    },
  },
};
</script>
<style>
#app {
  background: #F0F8FF;
}
.menu {
  height: 113px;
}
@media (max-width:960px) {
  .menu {
  height: 100px;
}
}
</style>
