<template>
  <div id="app">
    <v-app height="90vh">
      <v-card>
        <v-app-bar
        
          absolute
          color="#6A76AB"
          dark
  
  
          src="https://picsum.photos/1920/1080?random"
          fade-img-on-scroll
          scroll-target="#scrolling-techniques-4"
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
            ></v-img>
          </template>
    
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    
          <v-toolbar-title>Мой блог</v-toolbar-title>
    
          <v-spacer></v-spacer>
    
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
    
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="yellow"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
    
            <v-list>
              <v-list-item>
                <v-list-item-title>Click Me 1</v-list-item-title>
              </v-list-item>
    
              <v-list-item>
                <v-list-item-title>Click Me 2</v-list-item-title>
              </v-list-item>
    
              <v-list-item>
                <v-list-item-title>Click Me 3</v-list-item-title>
              </v-list-item>
    
              <v-list-item>
                <v-list-item-title>Click Me 4</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <template v-slot:extension>
            <v-tabs align-with-title>
              <v-tab to="/">Обо мне</v-tab>
    
              <v-tab to="blog">Мои посты</v-tab>
    
              <v-tab to="registration">Регистрация</v-tab>
              <v-tab to="authorization">Вход</v-tab>
            </v-tabs>
          </template>
        </v-app-bar>
        <v-sheet
          id="scrolling-techniques-4"
          height="10vh"
        >
        <v-sheet
        height="11.5vh"
        style="position: relative;"
      >
        <v-container class="fill-height">
          <v-row
            align="center"
            justify="center"
          >
          </v-row>
        </v-container>
    
        <v-navigation-drawer
          v-model="drawer"
          absolute
          temporary
        >
          <v-list-item @click.stop="drawer = !drawer">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
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
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'App',
  data () {
    return {
      drawer: null,
      items: [
        { title: 'Обратная связь', icon: 'mdi-forum' },
      ],
    }
  },
  // async created () {
  //   this.getValidationToken()
  // },
  // methods : {
  //   ...mapMutations(['getUserlogin']),
//     async getValidationToken() {
//       if (!localStorage.getItem('token')){
//         await this.getTokenGuest ()
//       console.log('tokena nebulo' + localStorage.getItem('token'))
//     } else {
//       const validationToken = await fetch('http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token/validate', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       }
//     })
//     if (validationToken.statusText === 'OK'){
//       return
//     } else {
//       await this.getTokenGuest ()
//     }
//     }
// },
//  async getTokenGuest () {
//   const getToken = await fetch('http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//         'username': 'guest',
//         'password' : '(&k48USThweOvW%aMGGbyQ8#'
//       })
//     })
//       const showToken = await getToken.json()
//       await localStorage.setItem('token', showToken.token)
//       console.log('getTokenGuest '+localStorage.getItem('token'))

//       this.getUserlogin('guest')
//  }
//  },
 computed: {
  ...mapGetters(['showUserlogin'])
 }
 };
</script>
<style>

</style>