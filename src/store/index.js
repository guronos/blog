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
        arrayOfRequiredData.push({
          id: processedResponse[elem].id,
          title: processedResponse[elem].title.rendered,
          excerpt: getexcerpt(elem),
          content: processedResponse[elem].content.rendered,
          date: processedResponse[elem].date
            .match(/(\S+)T(\S+)/)[1]
            .split("-")
            .reverse()
            .join("."), // дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время, "переворачиваем" дату к формату ДД.ММ.ГГГГ
          time: processedResponse[elem].date.match(/(\S+)T(\S+)/)[2], // дата приходит в формате "2023-03-13T17:49:31", разбиваем строку на дату и время
          img: await getImage(elem),
          comments: await getComments(elem),
        });
      }
      function getexcerpt(indexPost) {
        try {
          return processedResponse[indexPost].excerpt.rendered.match(
            /(.+)(\[&hellip;])/
          )[1];
        } catch (e) {
          return "";
        }
      }
      async function getComments(indexPost) {
        try {
          return processedResponse[indexPost]._embedded.replies[0].length;
        } catch (e) {
          return 0;
        }
      }
      async function getImage(indexPost) {
        try {
          return processedResponse[indexPost]._embedded["wp:featuredmedia"][0]
            .source_url;
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
