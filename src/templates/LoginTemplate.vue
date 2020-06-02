<template>
	<span>
		<header>
			<navbar-vue logo="Sistema" url="/" cor="grey lighten-1">
        <li v-if="!user" ><router-link to="/login">Entrar</router-link></li>
        <li v-if="!user"><router-link to="/register">Cadastre-se</router-link></li>
        <li v-if="user"><span class="nav-title">{{user.name}}</span></li>

        <li v-if="user"><a v-on:click="logout()">Sair</a></li>
			</navbar-vue>
		</header>

		<main>
			<div class="container">
				<div class="row">
					<grid-vue tamanho='8'>
						<card-menu-vue>
							<slot name="left-menu" />
						</card-menu-vue>
					</grid-vue>
					<grid-vue tamanho='4'>
						<slot name="main-menu" />
					</grid-vue>
				</div>
			</div>
		</main>
		
	</span>
</template>

<script>
	import NavbarVue from '@/components/layouts/NavbarVue'
	import GridVue from '@/components/layouts/GridVue'
	import CardMenuVue from '@/components/layouts/CardMenuVue'

	export default {
		name: 'LoginTemplate',
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
				this.$router.push('/')
			}
		},
		methods: {
			logout() {
				sessionStorage.clear()
				this.user = false;
			}
		}
	}
</script>
