import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    URLBACKEND : 'http://chub96u7.beget.tech/',
    PERMALINKS : 'wp-json',
    APIBLOGPOSTS : '/wp/v2/posts?categories=5&_fields=title,date,content.rendered,_links.wp:featuredmedia.0,_links.replies&_embed=replies, wp:featuredmedia',
    APIMAINPAGEPOSTS : '/wp/v2/posts?categories=4&_fields=title,content.rendered,acf.color,_links.wp:featuredmedia.0&_embed=wp:featuredmedia', // фильтр запрашиваемых значений (заголовок, дата, контент,категория, теги, изображения) categories=4 --для главной
    posts : [],
    pages : [],
    loading : true,
    quantityPostsOnServer : 0,
    // authenticationData : {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   }},
      loginUser : 'Unknown'
      
  },
  getters: {
    showPosts: state => state.posts,
    showPages: state => state.pages,
    // routeToPages: state => state.APIPAGE,
    // routeToPosts: state => state.APIPOSTS,
    loadingData: state => state.loading,
    showQuantityPostsOnServer: state => state.quantityPostsOnServer,
    showUserlogin: state => state.loginUser,
    showauthenticationData: state => state.authenticationData

  },
  mutations: {
    addPosts(state, processedResponse) {
      state.posts = processedResponse
      state.loading = false
    },
    addPages (state, processedResponse) {
      state.pages = processedResponse
      state.loading = false
    },
    resetLoadStatus (state) {
      state.loading = true
    },
    getQuantityPostsOnServer (state, quantityPosts) {
      state.quantityPostsOnServer =  quantityPosts
    },
    getUserlogin (state, newLogin) {
      state.loginUser = newLogin
    }

  },
  actions: {
    async getRequestPosts(ctx, params) {
      let arrowFunc =(p, pach) => p!==undefined ? pach + p : '';
      let post = arrowFunc(params[0], '&per_page=')
      console.log('vuex')
      let page = arrowFunc(params[1], '&page=') 
      ctx.commit('resetLoadStatus')
      // await getValidationToken()
      const rawResponse = await fetch(ctx.state.URLBACKEND + ctx.state.PERMALINKS + ctx.state.APIBLOGPOSTS + post + page//, {
        // method: 'GET',
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // }}
        )
      const createQuantityPostsOnServer = rawResponse.headers.get('X-WP-Total') // кол-во постов на сервере для пагинации
      // const createQuantityPageOnServer = rawResponse.headers.get('X-WP-TotalPages')
      ctx.commit('getQuantityPostsOnServer', createQuantityPostsOnServer)
      const processedResponse = await rawResponse.json()
      console.log(processedResponse)
      const arrayOfRequiredData = []
for (let elem in processedResponse) {
  // let arrayImage = await requestImage(elem)
  // let arrayComments = await getComments (elem)
  arrayOfRequiredData.push({
    'title' : processedResponse[elem].title.rendered,
    'content' : processedResponse[elem].content.rendered,
    'date' : processedResponse[elem].date.match(/(\S+)\T(\S+)/)[1].split('-').reverse().join('.'), //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время, "переворачиваем" дату к формату ДД.ММ.ГГГГ
    'time' : processedResponse[elem].date.match(/(\S+)\T(\S+)/)[2], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
    'img' : await getImage(elem),
    'comments' : await getComments(elem)
})
console.log(arrayOfRequiredData[elem])
}
async function getComments(indexPost) {
  try{
console.log('Ниже что-то есть?', processedResponse[indexPost]._embedded.replies[0]);
let arrayComments = [];
processedResponse[indexPost]._embedded.replies[0].forEach(i=>arrayComments.push({
  'id' : i.id,
  'parent' : i.parent,
  'author_name' : i.author_name,
  'content' : i.content.rendered,
  'date' : i.date.match(/(\S+)\T(\S+)/)[1].split('-').reverse().join('.'), //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время, "переворачиваем" дату к формату ДД.ММ.ГГГГ
  'time' : i.date.match(/(\S+)\T(\S+)/)[2], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
  'avatar' : i.author_avatar_urls['24']
}));
// console.log('arrcom', arrayComments)
  return arrayComments
} catch (e){
  return []
}
  }
  async function getImage(indexPost) {
    try{
    return processedResponse[indexPost]._embedded['wp:featuredmedia'][0]['source_url']
  } catch (e){
    return ''
  }
    }

  ctx.commit('addPosts', arrayOfRequiredData)
 
//   async function getValidationToken() {
//     if (!localStorage.getItem('token')){
//       await getTokenGuest ()
//     console.log('tokena nebulo' + localStorage.getItem('token'))
//   } else {
//     const validationToken = await fetch('http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token/validate', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     }
//   })
//   if (validationToken.statusText === 'OK'){
//     return
//   } else {
//     await getTokenGuest()
//   }
//   }
// }
// async function getTokenGuest () {
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
//       localStorage.setItem('token', showToken.token)
//       console.log('getTokenGuest '+localStorage.getItem('token'))
//  }
    }, 
    async getPostsForMainPage(ctx) {
      // let route = params[0];
      // let arrowFunc =(p, pach) => p!==undefined ? pach + p : '';
      // let post = arrowFunc(params[1], '&per_page=')
      // console.log('vuex')
      // let page = arrowFunc(params[2], '&page=') 
      ctx.commit('resetLoadStatus')
      // await getValidationToken()
      const rawResponse = await fetch(ctx.state.URLBACKEND + ctx.state.PERMALINKS + ctx.state.APIMAINPAGEPOSTS//, {
        // method: 'GET',
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // }}
        )
      const processedResponse = await rawResponse.json()
      console.log(processedResponse)
      const arrayOfRequiredData = []
for (let elem in processedResponse) {
  // let arrayImage = await requestImage(elem)
  arrayOfRequiredData.push({
    'title' : processedResponse[elem].title.rendered,
    'content' : processedResponse[elem].content.rendered,
    // 'date' : processedResponse[elem].date.match(/(\S+)\T(\S+)/)[1], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
    // 'time' : processedResponse[elem].date.match(/(\S+)\T(\S+)/)[2], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
    'img' : processedResponse[elem]._embedded['wp:featuredmedia'][0]['source_url'],
    'color' : processedResponse[elem].acf.color + '-card'
})
console.log('img ' + processedResponse[elem].acf.color)
}
// async function requestImage(indexArrayPosts) {
//   try{
//     const dataLinkImage = processedResponse[indexArrayPosts]._links['wp:featuredmedia'][0].href //wp:attachment - изображение всегда под 0 индексом
//       const rawResponseImageLink = await fetch(dataLinkImage + '?_fields=guid.rendered') //запрашиваем только поле source_url
//     const processedResponseImage = await rawResponseImageLink.json()
//     console.log('dfgzfg '+processedResponseImage.guid.rendered)
//     return processedResponseImage.guid.rendered
// } catch (e){
//   console.log(e)
//   return
// }
//   }
    ctx.commit('addPages', arrayOfRequiredData.reverse()) // новые странницы должны добавлятся в конец списка
}
   
  },
  modules: {
  }
})
