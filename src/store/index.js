import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    URLBACKEND: "http://chub96u7.beget.tech/",
    PERMALINKS: "wp-json",
    APIBLOGPOSTS:
      "/wp/v2/posts?categories=5&_fields=id,title,date,content.rendered,excerpt.rendered,_links.wp:featuredmedia.0,_links.replies&_embed=replies, wp:featuredmedia",
    APIMAINPAGEPOSTS:
      "/wp/v2/posts?categories=4&_fields=title,content.rendered,acf.color,acf.link,_links.wp:featuredmedia.0&_embed=wp:featuredmedia", // фильтр запрашиваемых значений (заголовок, дата, контент,категория, теги, изображения) categories=4 --для главной
    posts: [],
    pages: [],
    loading: true,
    quantityPostsOnServer: 0,
    loginUser: "Гость",
  },
  getters: {
    showPosts: (state) => state.posts,
    showPages: (state) => state.pages,
    loadingData: (state) => state.loading,
    showQuantityPostsOnServer: (state) => state.quantityPostsOnServer,
    showUserlogin: (state) => state.loginUser,
    showauthenticationData: (state) => state.authenticationData,
  },
  mutations: {
    addPosts(state, processedResponse) {
      state.posts = processedResponse;
      state.loading = false;
    },
    addPages(state, processedResponse) {
      state.pages = processedResponse;
      state.loading = false;
    },
    resetLoadStatus(state) {
      state.loading = true;
    },
    getQuantityPostsOnServer(state, quantityPosts) {
      state.quantityPostsOnServer = quantityPosts;
    },
    addUserlogin(state, newLogin) {
      state.loginUser = newLogin;
    },
  },
  actions: {
    async getRequestPosts(ctx, params) {
      const arrowFunc = (p, pach) => (p !== undefined ? pach + p : "");
      const post = arrowFunc(params[0], "&per_page=");
      const page = arrowFunc(params[1], "&page=");
      ctx.commit("resetLoadStatus");
      const rawResponse = await fetch(
        ctx.state.URLBACKEND +
          ctx.state.PERMALINKS +
          ctx.state.APIBLOGPOSTS +
          post +
          page //, {
      );
      const createQuantityPostsOnServer = rawResponse.headers.get("X-WP-Total"); // кол-во постов на сервере для пагинации
      ctx.commit("getQuantityPostsOnServer", createQuantityPostsOnServer);
      const processedResponse = await rawResponse.json();
      const arrayOfRequiredData = [];
      for (const elem in processedResponse) {
        const datePublication = new Date(Date.parse(processedResponse[elem].date))
        arrayOfRequiredData.push({
          id: processedResponse[elem].id,
          title: processedResponse[elem].title.rendered,
          excerpt: getExcerpt(elem),
          content: processedResponse[elem].content.rendered,
          date: `${datePublication.getDate()} ${new Intl.DateTimeFormat("ru-RU", {month: "long",}).format(datePublication)} ${datePublication.getFullYear()}`,
          time: `${datePublication.getHours()}:${String(datePublication.getMinutes()).length === 1 ? String(0) + datePublication.getMinutes() : datePublication.getMinutes()}`,
          img: processedResponse[elem]._embedded?.["wp:featuredmedia"] ? processedResponse[elem]._embedded["wp:featuredmedia"][0].source_url : '',
          comments: processedResponse[elem]._embedded?.replies ? processedResponse[elem]._embedded.replies[0].length : 0,
        });
      }
      function getExcerpt(indexPost) {
        try {
          return processedResponse[indexPost].excerpt.rendered.match(
            /(.+)(\[&hellip;])/
          )[1];
        } catch (e) {
          return "";
        }
      }

      ctx.commit("addPosts", arrayOfRequiredData);
    },
    async getPostsForMainPage(ctx) {
      ctx.commit("resetLoadStatus");
      const rawResponse = await fetch(
        ctx.state.URLBACKEND + ctx.state.PERMALINKS + ctx.state.APIMAINPAGEPOSTS //, {
      );
      const processedResponse = await rawResponse.json();
      const arrayOfRequiredData = [];
      for (const elem in processedResponse) {
        arrayOfRequiredData.push({
          title: processedResponse[elem].title.rendered,
          content: processedResponse[elem].content.rendered,
          link: processedResponse[elem].acf.link,
          img: processedResponse[elem]._embedded["wp:featuredmedia"][0]
            .source_url,
          color: processedResponse[elem].acf.color + "-card",
        });
      }
      ctx.commit("addPages", arrayOfRequiredData.reverse()); // новые странницы должны добавлятся в конец списка
    },
    async getUserName({ commit }) {
      if (localStorage.getItem("token")) {
        const checkUserName = await fetch(
          "http://chub96u7.beget.tech/wp-json/wp/v2/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userName = await checkUserName.json();
        commit("addUserlogin", userName.name);
      }
    },
  },
  modules: {},
});
