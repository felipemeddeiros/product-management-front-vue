<template>
  <login-template>

  	<span slot="left-menu">
  		<img 
  			src="https://blog.collabo.com.br/content/uploads/2016/05/cat%C3%A1logo-de-produtos-750x430.png?x39786"
  			class="responsive-img">
  	</span>

  	<span slot="main-menu">
  		
  		<h2>Login</h2>

	    <input type="text" placeholder='E-mail' v-model="email">
	    <input type="password" placeholder='Senha' v-model="password">
	    <button class="btn" v-on:click="login()">Entrar</button>

  	</span>

  </login-template>
</template>
<script>
import LoginTemplate from '@/templates/LoginTemplate'
import axios from 'axios';

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  components: {
  	LoginTemplate
  },
  methods: {
    login() {
      axios.post( process.env.API_URL + '/login', {
        email: this.email,
        password: this.password
      })
      .then(response => {
        if(response.data.token){
          // login com sucesso
          console.log('login realizado com sucesso')
          sessionStorage.setItem('user', JSON.stringify(response.data))
          this.$router.push('/')
        }else{
          console.log(response)
          alert('Erro! Tente novamente mais tarde')
        }
      })
      .catch(e => {
        console.log(e.response.data)
        let erros = ''
          for(let erro of Object.values(e.response.data.error)) {
            erros += erro +" ";
          }
          alert(erros);
      })
    }
  }
}
</script>
