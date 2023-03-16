<template>
  <div>
    <v-container class="green my-16">Регистрация</v-container> 
    <v-container>Для предоставления более расширенного функционала блога (комментирование записей), Вам необходимо зарегистрироватся</v-container>
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
        v-model="email"
        :rules="emailRules"
        label="E-mail"
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
  
      <v-checkbox
        v-model="checkbox"
        :rules="[v => !!v || 'You must agree to continue!']"
        label="Do you agree?"
        required
      ></v-checkbox>
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
name : 'RegistrationUsers',
data: () => ({
    valid: true,
    name: '',
    showPassword : false,
    nameRules: [
      v => !!v || 'Укажите логин',
      v => (v && v.length <= 10) || 'Длина логина не должна превышать 10 символов',
    ],
    email: '',
    emailRules: [
      v => !!v || 'Укажите E-mail',
      v => /.+@.+\..+/.test(v) || 'Указан некорректный E-mail',
    ],
    password:'',
    passwordRules: [
      v => !!v || 'Укажите пароль',
      v => (v  && v.length >= 5) || 'Пароль должен быть более 5 символов',
    ],
    select: null,
    checkbox: false,
  }),

  methods: {
    async submit () {
      if(this.$refs.form.validate()) {
        console.log(JSON.stringify({
        username : this.name,
        email : this.email,
        locale : 'en_US',
        password : this.password
      }))
const rezult = await fetch('http://chub96u7.beget.tech/wp-json/wp/v2/users', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY2h1Yjk2dTcuYmVnZXQudGVjaCIsImlhdCI6MTY3ODk2MjY0MSwibmJmIjoxNjc4OTYyNjQxLCJleHAiOjE2Nzk1Njc0NDEsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.1bOwlGuSSYCO0FDfF6ZBGXvnq7VraEwTpr6QzNsfDro',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        username : this.name,
        email : this.email,
        locale : 'en_US',
        password : this.password
      })
    })
    console.log(rezult)
      if (rezult.ok){
        saveTokenLocalstore()
      }} 
    },
    reset () {
      this.$refs.form.reset()
    },
    async saveTokenLocalstore () {
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
    console.log(userToken.token)
    }
  },
}
</script>

<style>

</style>