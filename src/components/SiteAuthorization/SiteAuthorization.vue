<template>
  <div class="d-flex justify-center align-center main">
    <LoadingPage v-if="loadingData" />
    <v-card
      color="#B0C4DE"
      v-if="notAuthorization"
      class="entry-form"
      @click="form = 'entry'"
      :class="{ 'no-transform': form === 'entry' }"
    >
      <v-container class="card-head white--text">Вход</v-container>
      <v-container
        >Для предоставления более расширенного функционала блога, Вам необходимо
        авторизоваться</v-container
      >
      <v-container
        ><v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            :counter="10"
            :rules="nameRules"
            label="Логин"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            name="input-10-1"
            counter
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-btn color="error" class="mr-4" @click="reset">
            Очистить форму
          </v-btn>
          <v-btn
            :disabled="!valid"
            color="#5c8eebe7"
            class="mr-4 white--text"
            @click="submit"
          >
            Отправить
          </v-btn>
        </v-form></v-container
      >
    </v-card>
    <RegistrationUsers
      :form="form"
      @thisForm="thisForm"
      v-if="notAuthorization"
    />
    <v-card
      v-if="!notAuthorization"
      color="#B0C4DE"
      class="d-flex justify-center align-center authorization-card"
      ><span class="authorization-true">Вы авторизованы</span></v-card
    >
  </div>
</template>
<script>
import LoadingPage from "../LoadingPage";
import RegistrationUsers from "../RegistrationUsers";
import { mapMutations } from "vuex";
import router from "@/router";
export default {
  name: "SiteAuthorization",
  components: { LoadingPage, RegistrationUsers },
  data: () => ({
    valid: true,
    notAuthorization: true,
    loadingData: true,
    name: "",
    form: "entry",
    showPassword: false,
    nameRules: [
      (v) => !!v || "Укажите логин",
      (v) =>
        (v && v.length <= 10) || "Длина логина не может превышать 10 символов",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Укажите пароль",
      (v) => (v && v.length >= 5) || "Пароль не может быть менее 5 символов",
    ],
  }),
  created() {
    this.checkAuthorization();
  },

  methods: {
    ...mapMutations(["addUserlogin"]),
    async checkAuthorization() {
      if (!localStorage.getItem("token")) {
        this.loadingData = false;
      } else if (localStorage.getItem("token")) {
        const validationToken = await fetch(
          "http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token/validate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (validationToken.statusText === "OK") {
          this.notAuthorization = false;
          this.loadingData = false;
        }
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        const getUserToken = await fetch(
          "http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
              username: this.name,
              password: this.password,
            }),
          }
        );
        const userToken = await getUserToken.json();
        localStorage.setItem("token", userToken.token);
        this.addUserlogin(this.name);
        this.notAuthorization = false;
        this.reset();
        router.push({ path: "/blog" });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    thisForm(event) {
      this.form = event;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  @media (max-width: 720px) {
    flex-direction: column;
  }
}
.entry-form {
  position: fixed;
  top: 0;
  width: 600px;
  margin-top: 10%;
  margin-right: 10%;
  opacity: 0.4;

  @media (max-width: 720px) {
    position: relative;
    width: 90%;
    margin-right: 0;
    margin-top: 10%;
  }
}
.no-transform {
  z-index: 1;
  opacity: 1;
  animation-duration: 0.2s;
  animation-name: entry;
  animation-iteration-count: 1;
  animation-direction: alternate;
  animation-fill-mode: forwards;
  @media (max-width: 720px) {
    animation-name: off;
  }
  @keyframes entry {
    from {
      right: 30%;
    }
    50% {
      right: 40%;
    }
    to {
      right: 25%;
    }
  }
}
.card-head {
  background: #5c8eebe7;
}
.authorization-card {
  margin-top: 10%;
  .authorization-true {
    color: #161515c4;
    font-size: 32px;
    font-weight: 600;
    padding: 3%;
    text-align: center;
  }
}
</style>
