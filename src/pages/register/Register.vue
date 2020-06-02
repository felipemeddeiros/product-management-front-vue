<template>
  <login-template>

  	<span slot="left-menu">
  		<img 
        src="https://blog.collabo.com.br/content/uploads/2016/05/cat%C3%A1logo-de-produtos-750x430.png?x39786"
        class="responsive-img">
  	</span>

  	<span slot="main-menu">
  		
  		<h2>Cadastro</h2>

      <input type="text" placeholder='Nome' v-model="name">
      <input type="text" placeholder='E-mail' v-model="email">
      <input type="password" placeholder='Senha' v-model="password">
      <input type="password" placeholder='Confirme sua senha' v-model="password_confirmation">
      <form>
        <p>
          <label>
            <input type="checkbox" class="filled-in" v-on:click="isAdmin()" />
            <span>Administrador</span>
          </label>
        </p>
      </form>
      <button class="btn" v-on:click="register()">Enviar</button>
  			
  	</span>

  </login-template>
</template>
<script>
import LoginTemplate from '@/templates/LoginTemplate'
import axios from 'axios';

export default {
  name: 'Register',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      user_group: 1 // true = admin
    }
  },
  components: {
  	LoginTemplate
  },
  methods: {
    register() {
      axios.post( process.env.API_URL + '/users', {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        user_group: this.user_group
      })
      .then(response => {
        if(response.data.token){
          // login com sucesso
          console.log('Cadastro realizado com sucesso')
          sessionStorage.setItem('user', JSON.stringify(response.data))
          this.$router.push('/')
        } else {
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
    },
    isAdmin() {
      if(this.user_group == 1) {
        this.user_group = 2;
      } else {
        this.user_group = 1;
      }
    }
  }
}
</script>
