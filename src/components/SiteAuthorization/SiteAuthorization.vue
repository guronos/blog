<template>
 <div>
    <v-container class="green my-16">Вход</v-container> 
    <v-container>Для предоставления более расширенного функционала блога (комментирование записей), Вам необходимо войти</v-container>
    <v-container><v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
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

      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        Очистить форму
      </v-btn>
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="submit"
      >
        Отправить
      </v-btn>
  

    </v-form></v-container>

  </div>
</template>

<script>
export default {
name : 'SiteAuthorization',
data: () => ({
    valid: true,
    name: '',
    showPassword : false,
    nameRules: [
      v => !!v || 'Укажите логин',
      v => (v && v.length <= 10) || 'Длина логина не может превышать 10 символов',
    ],
    password:'',
    passwordRules: [
      v => !!v || 'Укажите пароль',
      v => (v  && v.length >= 5) || 'Пароль не может быть менее 5 символов',
    ],
  }),

  methods: {
    async submit () {
      if(this.$refs.form.validate()) {
      const getUserToken = await fetch('http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
       },
        body: JSON.stringify({
        username : this.name,
        password : this.password
      })
    })
    const userToken = await getUserToken.json()
    localStorage.setItem('token', userToken.token)
    this.reset ()
    console.log(userToken.token)
      }},
    reset () {
      this.$refs.form.reset()
    },
  }}
</script>

<style>

</style>