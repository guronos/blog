import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    URLBACKEND : 'http://chub96u7.beget.tech/',
    PERMALINKS : 'wp-json',
    APIPOSTS : '/wp/v2/posts',
    APIPAGE : '/wp/v2/pages',
    FILTERDATA : '?_fields=title,date,content.rendered,_links.wp:attachment.0', // фильтр запрашиваемых значений
    posts : [],
    pages : [],
    loading : true,
  },
  getters: {
    showPosts: state => state.posts,
    showPages: state => state.pages,
    routeToPages: state => state.APIPAGE,
    routeToPosts: state => state.APIPOSTS,
    loadingData: state => state.loading
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
    }
  },
  actions: {
    async requestPosts(ctx, route, post=1, page=1) {
      ctx.commit('resetLoadStatus')
      console.log(`action ${post}, ${page}`)
      const rawResponse = await fetch(ctx.state.URLBACKEND + ctx.state.PERMALINKS + route + ctx.state.FILTERDATA + `&per_page=${post}` + `&page=${page}`)
      const quantityPost = rawResponse.headers.get('X-WP-Total') // кол-во постов на сервере для пагинации
      console.log(quantityPost)
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
    'color' : regExpContent(...arrayImage)
})
}
async function requestImage(indexArrayPosts) {
  const dataLinkImage = processedResponse[indexArrayPosts]._links['wp:attachment'][0].href //wp:attachment - изображение всегда под 0 индексом
  console.log(dataLinkImage)
  const rawResponseImageLink = await fetch(dataLinkImage + '&_fields=source_url') //запрашиваем только поле source_url
  const processedResponseImage = await rawResponseImageLink.json()
  const arrayImage = []
  for (let imageLink of processedResponseImage) {
    arrayImage.push(imageLink.source_url)
  } 
  return arrayImage
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
