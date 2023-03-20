<template>
  <div>
    <v-container>
        <h3>Обратная связь</h3> 
        <div v-if="serverMessageOk"><v-alert
  type="success"
>{{ serverMessageOk }}</v-alert></div>
<div v-if="serverMessageErr"><v-alert
  type="error"
>{{ serverMessageErr }}</v-alert></div>
        <v-form
        ref="form"
      v-model="valid"
      lazy-validation
    >
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
        color="success"
        class="mr-4"
        @click="createFeedback"
      >
        Отправить
      </v-btn>
  
      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        Очистить форму
      </v-btn>
    </v-form>
    </v-container>
  </div>
</template>

<script>
export default {
name: 'FeedBack',
data: () => ({
    valid: true,
    emailBody : {
    'your-name': '',
    'your-message': '',
    'your-email': '',
},
    nameRules: [
      v => !!v || 'Укажите имя',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters',
    ],
    
    emailRules: [
      v => !!v || 'Укажите E-mail',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ], messageRules: [
      v => !!v || 'Укажите сообщение'
    ],
    serverMessageOk : '',
    serverMessageErr : ''
  }),

  methods: {
    async createFeedback () {
      if (this.$refs.form.validate()) {
        console.log(this.emailBody)
        const dataFeedback = new FormData()
        for (const field in this.emailBody) {
            dataFeedback.append(field, this.emailBody[field]);
        }
        const postFeedback = await fetch('http://chub96u7.beget.tech/wp-json/contact-form-7/v1/contact-forms/15/feedback', {
        method : 'POST', 
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // }, 
        body : dataFeedback
        // {
        //     'your-name' : this.name,
        //    'your-subject' : 'FeedbackBlog',
        //     'your-email' : this.email,
        //     'your-message' : this.message
        // }
    })
    const statusPostFeedback = await postFeedback.json()
    console.log(statusPostFeedback)
    if (statusPostFeedback.status === 'mail_sent') {
        this.serverMessageOk = statusPostFeedback.message
        console.log(statusPostFeedback.message)
    } else {
        this.serverMessageErr = statusPostFeedback.message
    }
      } else {
        console.log('scdcs')
      }
    },
    reset () {
      this.$refs.form.reset()
    },

  },
}
</script>

<style>

</style>