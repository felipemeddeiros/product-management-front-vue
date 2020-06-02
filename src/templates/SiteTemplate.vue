<template>
	<span>
		<header>
			<navbar-vue logo="Sistema" url="/" cor="brown lighten-2">
        <li v-if="!user" ><router-link to="/login">Entrar</router-link></li>
        <li v-if="!user"><router-link to="/register">Cadastre-se</router-link></li>
        <li v-if="user"><span class='user'>{{user.name}}</span></li>
        <li v-if="user"><a v-on:click="logout()">Sair</a></li>
			</navbar-vue>
		</header>

		<main>
			<div class="container">
				<slot name="main-menu"/>
			</div>
		</main>
		
	</span>
</template>

<script>
	import NavbarVue from '@/components/layouts/NavbarVue'
	import GridVue from '@/components/layouts/GridVue'
	import CardMenuVue from '@/components/layouts/CardMenuVue'

	export default {
		name: 'SiteTemplate',
		data() {
			return {
				user: false
			}
		},
		components: {
			NavbarVue,
			GridVue,
			CardMenuVue
		},
		created() {
			let userSession = sessionStorage.getItem('user');
			if(userSession){
				this.user = JSON.parse(userSession)
			}else{
				console.log('Usuário não esta logado, enviado para tela de login')
				this.$router.push('/login')
			}
		},
		methods: {
			logout() {
				sessionStorage.clear()
				this.user = false;
				this.$router.push('/login')
			}
		}
	}
</script>

<style>
	.user{
		margin: 0 10px 0 10px;
	}
</style>
