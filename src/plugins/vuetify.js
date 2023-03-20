import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify);

export default new Vuetify({
 theme: {
    themes: {
      light: {
        primary: '#3f51b5',
        secondary: '#F3E5F5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
    icons: {
      iconfont: 'fa',
    },
  },
});