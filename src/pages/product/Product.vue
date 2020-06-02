<template>
  <site-template>

  	<span slot="main-menu">

        <div class="row">
          <grid-vue tamanho='8'>

            <h3>Produto</h3>

            <input type="text" placeholder='Nome' v-model="name">

            <div class="file-field input-field">
              <div class="btn">
                <span>Imagem</span>
                <input type="file" v-on:change="saveImage">
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text">
              </div>
            </div>

            <p>
              <label>
                <input :disabled="verifyPermission(1)" type="radio" value="1" v-model="status"/>
                <span>Pendente</span>
              </label>
            </p>
            <p>
              <label>
                <input :disabled="verifyPermission(2)" type="radio" value="2" v-model="status" />
                <span>Em Análise</span>
              </label>
            </p>
            <p>
              <label>
                <input :disabled="verifyPermission(3)" type="radio" value="3" v-model="status"/>
                <span>Aprovado</span>
              </label>
            </p>
            <p>
              <label>
                <input :disabled="verifyPermission(4)" type="radio" value="4" v-model="status"/>
                <span>Reprovado</span>
              </label>
            </p>

            <button class="btn btn-save" v-on:click="saveOrUpdate()">Salvar</button>

          </grid-vue>
          <grid-vue tamanho='4'>
            <card-menu-vue>
              <span>
                <img class="materialboxed responsive-img" :src="image">
              </span>
            </card-menu-vue>
          </grid-vue>
        </div>

  	</span>

  </site-template>
</template>
<script>
import SiteTemplate from '@/templates/SiteTemplate'
import GridVue from '@/components/layouts/GridVue'
import CardMenuVue from '@/components/layouts/CardMenuVue'
import axios from 'axios';

export default {
  name: 'Product',
  props: ['id'],
  components: {
    SiteTemplate, GridVue, CardMenuVue
  },
  data () {
    return {
      user: false,
      product: false,
      name: '',
      image: process.env.IMG_PROD_DEFAULT,
      status: false,
      newImage: 0
    }
  },
  created() {
    let userSession = sessionStorage.getItem('user');
    if(userSession){
      this.user = JSON.parse(userSession)
    }

    //get the product if it exists
    if(this.$route.params.id){
      this.getProduct(this)
    }else{
      this.status = 1
    }
  },
  mounted() {
    //loading material box to the images
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
  },
  updated() {
    //loading material box to the images
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
  },
  methods: {
    saveImage(e) {
      let file = e.target.files || e.dataTransfer.files
      if(!file.length){
        return;
      }

      let reader = new FileReader()
      reader.onloadend = (e) => {
        this.image = e.target.result
      }
      reader.readAsDataURL(file[0])
      this.newImage = 1;
    },
    verifyPermission(status){
      //user_group: 2 = administrator
      if(this.user.user_group == 2) return false

      //status: 3 = aprovado; 4 = reprovado
      if(status == 3 || status == 4) return true

      //this.product = current product values
      if(this.product.status_number == 3 || this.product.status_number == 4) {
        return true
      }

      return false
    },
    getProduct(ref) {
      axios({
        method: 'get',
        url: process.env.API_URL + '/products/' + ref.$route.params.id,
        headers: { 'Authorization': 'Bearer ' + ref.user.token }
      })
      .then(response => {
          console.log('Produto carregado')
          console.log(response)
          ref.name = response.data.name
          ref.image = response.data.image_url
          ref.status = response.data.status_number
          ref.product = response.data
      })
      .catch(e => {
        console.log(e.response.data)
        alert('Aconteceu um erro, por favor tente mais tarde!')
      });
    },
    saveOrUpdate() {
      if(this.$route.params.id){
        this.updateProduct()
      }else{
        this.saveProduct()
      }
    },
    saveProduct() {
      axios({
        method: 'post',
        url: process.env.API_URL + '/products',
        data: {
          name: this.name,
          image: this.image,
          status: this.status,
          newImage: this.newImage
        },
        headers: { 'Authorization': 'Bearer ' + this.user.token }
      })
      .then(response => {
          console.log('Produto salvo com sucesso')
          alert('Produto salvo')
          this.$router.push('/')
      })
      .catch(e => {
        console.log(e.response.data)
        if(e.response.data.code == 401) {
          sessionStorage.clear()
          this.user = false;
          this.$router.push('/login')
        }
        let erros = ''
        for(let erro of Object.values(e.response.data.error)) {
          erros += erro +" ";
        }
        alert(erros);
      });
    },
    updateProduct() {
      axios({
        method: 'put',
        url: process.env.API_URL + '/products/' + this.$route.params.id,
        data: {
          name: this.name,
          image: this.image,
          status: this.status,
          newImage: this.newImage
        },
        headers: { 'Authorization': 'Bearer ' + this.user.token }
      })
      .then(response => {
          console.log('Produto salvo com sucesso')
          alert('Produto Atualizado');
          this.$router.push('/')
      })
      .catch(e => {
        console.log(e.response.data)
        let erros = ''
        for(let erro of Object.values(e.response.data.error)) {
          erros += erro +" ";
        }
        alert(erros);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn-save{
    margin-top: 30px;
  }
</style>
