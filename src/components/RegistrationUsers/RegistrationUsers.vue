<template>
  <div>
    <LoadingPage v-if="loadingData" />
    <v-container v-if="!authorization">
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
  </v-container>
  <v-container v-else><h3>Вы авторизованы</h3></v-container>
  </div>
</template>

<script>
import LoadingPage from '../LoadingPage';
import { mapMutations } from 'vuex';
export default {
name : 'RegistrationUsers',
components: {LoadingPage},
data: () => ({
    valid: true,
    name: '',
    loadingData: true,
    showPassword : false,
    authorization : false,
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
  created (){
    this.checkAuthorization()
   },
  methods: {
    ...mapMutations(['getUserlogin']),
    async checkAuthorization() {
      if (!localStorage.getItem('token')){
        this.loadingData = false
        return
      } else if (localStorage.getItem('token')){
      const validationToken = await fetch('http://chub96u7.beget.tech/wp-json/jwt-auth/v1/token/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    if (validationToken.statusText === 'OK'){
      this.authorization = true
      this.loadingData = false
    }
  }
    },
    async submit () {
      if(this.$refs.form.validate()) {
      //   console.log(JSON.stringify({
      //   username : this.name,
      //   email : this.email,
      //   locale : 'en_US',
      //   password : this.password
      // }))
      const getTokenRegistration = await fetch('http://chub96u7.beget.tech/api/get_nonce/?controller=user&method=register')
      const tokenRegistration = await getTokenRegistration.json()
      console.log(tokenRegistration.nonce)
const rezult = await fetch(`http://chub96u7.beget.tech/api/user/register/?username=${this.name}&email=${this.email}&nonce=${tokenRegistration.nonce}&display_name=${this.name}&user_pass=${this.password}&insecure=cool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      // body: JSON.stringify({
      //   username : this.name,
      //   email : this.email,
      //   user_pass : this.password,
      //   display_name : this.name,
      //   insecure : 'cool',
      //   nonce : tokenRegistration.nonce
      // })
    })
    console.log(rezult.ok)
      if (rezult.ok){
        this.saveTokenLocalstore()
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
    this.getUserlogin(this.name)
    this.authorization = true
    }
  },
}
</script>

<style>

</style>