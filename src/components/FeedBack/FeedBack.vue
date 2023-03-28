<template>
  <div class="d-flex justify-center align-center">
    <v-card class="mt-12 feedback-card" color="#B0C4DE">
      <v-card-title class="title-card white--text">Обратная связь</v-card-title>
      <div v-if="serverMessageOk">
        <v-alert type="success">{{ serverMessageOk }}</v-alert>
      </div>
      <div v-if="serverMessageErr">
        <v-alert type="error">{{ serverMessageErr }}</v-alert>
      </div>
      <v-form class="pa-4" ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="emailBody['your-name']"
          :counter="20"
          :rules="nameRules"
          label="Имя"
          required
        ></v-text-field>

        <v-text-field
          v-model="emailBody['your-email']"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="emailBody['your-message']"
          :rules="messageRules"
          label="Введите текст сообщения"
          required
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="#5c8eebe7"
          class="ma-4 white--text"
          @click="createFeedback"
        >
          Отправить
        </v-btn>

        <v-btn color="error" class="mr-4" @click="reset">
          Очистить форму
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "FeedBack",
  data: () => ({
    valid: true,
    emailBody: {
      "your-name": "",
      "your-message": "",
      "your-email": "",
    },
    nameRules: [
      (v) => !!v || "Укажите имя",
      (v) => (v && v.length <= 20) || "Name must be less than 10 characters",
    ],

    emailRules: [
      (v) => !!v || "Укажите E-mail",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    messageRules: [(v) => !!v || "Укажите сообщение"],
    serverMessageOk: "",
    serverMessageErr: "",
  }),
  created() {},
  methods: {
    async createFeedback() {
      if (this.$refs.form.validate()) {
        const dataFeedback = new FormData();
        for (const field in this.emailBody) {
          dataFeedback.append(field, this.emailBody[field]);
        }
        const postFeedback = await fetch(
          "https://audiocut.ru/wp-json/contact-form-7/v1/contact-forms/5/feedback",
          {
            method: "POST",
            body: dataFeedback,
          }
        );
        const statusPostFeedback = await postFeedback.json();
        if (statusPostFeedback.status === "mail_sent") {
          this.serverMessageOk = statusPostFeedback.message;
        } else {
          this.serverMessageErr = statusPostFeedback.message;
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-card {
  width: 800px;
  @media (max-width: 720px) {
    width: 400px;
  }
}
.title-card {
  background: #5c8eebe7;
}
</style>
