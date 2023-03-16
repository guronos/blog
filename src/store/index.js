import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    URLBACKEND : 'http://chub96u7.beget.tech/',
    PERMALINKS : 'wp-json',
    APIPOSTS : '/wp/v2/posts',
    APIPAGE : '/wp/v2/pages',
    FILTERDATA : '?_fields=title,date,content.rendered,_links.wp:term.0.href,_links.wp:term.1.href,_links.wp:featuredmedia.0', // фильтр запрашиваемых значений (заголовок, дата, контент,категория, теги, изображения)
    posts : [],
    pages : [],
    loading : true,
    quantityPostsOnServer : 0,
    authenticationData : {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }}
      
  },
  getters: {
    showPosts: state => state.posts,
    showPages: state => state.pages,
    routeToPages: state => state.APIPAGE,
    routeToPosts: state => state.APIPOSTS,
    loadingData: state => state.loading,
    showQuantityPostsOnServer: state => state.quantityPostsOnServer,

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
    }
  },
  actions: {
    async getRequestPosts(ctx, params) {
      let route = params[0];
      let arrowFunc =(p, pach) => p!==undefined ? pach + p : '';
      let post = arrowFunc(params[1], '&per_page=')
      
      let page = arrowFunc(params[2], '&page=') 
      ctx.commit('resetLoadStatus')
      // console.log(`${ctx.state.authorizationDataProd.headers}`)
      const rawResponse = await fetch(ctx.state.URLBACKEND + ctx.state.PERMALINKS + route + ctx.state.FILTERDATA + post + page, ctx.state.authenticationData)
      const createQuantityPostsOnServer = rawResponse.headers.get('X-WP-Total') // кол-во постов на сервере для пагинации
      // const createQuantityPageOnServer = rawResponse.headers.get('X-WP-TotalPages')
      ctx.commit('getQuantityPostsOnServer', createQuantityPostsOnServer)
      const processedResponse = await rawResponse.json()
      console.log(processedResponse)
      const arrayOfRequiredData = []
for (let elem in processedResponse) {
  let arrayImage = await requestImage(elem)
  arrayOfRequiredData.push({
    'title' : processedResponse[elem].title.rendered,
    'content' : processedResponse[elem].content.rendered,
    'date' : processedResponse[elem].date.match(/(\S+)\T(\S+)/)[1], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
    'time' : processedResponse[elem].date.match(/(\S+)\T(\S+)/)[2], //дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
    'img' : arrayImage,
    'color' : arrayImage ? regExpContent(...arrayImage) : ''
})
}
async function requestImage(indexArrayPosts) {
  try{const dataLinkImage = processedResponse[indexArrayPosts]._links['wp:featuredmedia'][0].href //wp:attachment - изображение всегда под 0 индексом
  console.log('dfgzfg'+dataLinkImage)
  
  const rawResponseImageLink = await fetch(dataLinkImage + '?_fields=guid.rendered') //запрашиваем только поле source_url
  const processedResponseImage = await rawResponseImageLink.json()
  const arrayImage = []
  // for (let imageLink of processedResponseImage) {
    arrayImage.push(processedResponseImage.guid.rendered)
  // } 
  return arrayImage
} catch (e){
  return
}
  }
  function regExpContent (content) {
    let regExpSearchColor = /(\w+)\d+.(\w+$)/; //цвет фона карты указан в наименовании изображения. Маска - /color*.jpg, где * - номер порядковый номер изображения
    try {
    return content.match(regExpSearchColor)[1] + '-card'
    } catch {
      return 'white'
    }
  }
  if (route === '/wp/v2/posts') {
  ctx.commit('addPosts', arrayOfRequiredData)
  } else if (route === '/wp/v2/pages') {
    ctx.commit('addPages', arrayOfRequiredData.reverse()) // новые странницы должны добавлятся в конец списка
  }

    }, 
   
  },
  modules: {
  }
})
