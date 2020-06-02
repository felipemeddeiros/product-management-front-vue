<template>
  <site-template>

    <span slot='main-menu'>     

      <add-content-vue />

      <div class="products">
          <div class="tableFilters">
              <grid-vue tamanho='6'>
                <input class="input" type="text" v-model="search" placeholder="Encontre o produto"
                     @input="resetPagination()">
              </grid-vue>
              <grid-vue tamanho='6'>
                <div class="control">
                    <div class="select">
                        <select v-model="length" @change="resetPagination()">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                </div>
              </grid-vue>              
          </div>
          <datatable :columns="columns" :sortKey="sortKey" :sortOrders="sortOrders" @sort="sortBy">
              <tbody>
                  <tr v-for="product in paginated" :key="product.id">
                      <td>
                        <img class="materialboxed" width="80" :src="product.image_url">
                      </td>
                      <td>{{product.name}}</td>
                      <td>{{product.status}}</td>
                      <td>{{product.updated_at_human}}</td>
                      <td>{{product.created_at_human}}</td>
                      <td>
                        <router-link :to="'/product/'+product.id" class="waves-effect waves-light btn-small" title="Editar">
                          <i class="material-icons">edit</i>
                        </router-link>
                        <a v-on:click="removeProduct(product.id)" class="waves-effect waves-light btn-small red lighten-2" title="Excluir">
                          <i class="material-icons">cancel</i>
                        </a>
                      </td>
                  </tr>
              </tbody>
          </datatable>
          <pagination :pagination="pagination" :client="true" :filtered="filteredProducts"
                      @prev="--pagination.currentPage"
                      @next="++pagination.currentPage">
          </pagination>
      </div>

    </span>

  </site-template>
</template>

<script>
import SiteTemplate from '@/templates/SiteTemplate'
import AddContentVue from '@/components/layouts/AddContentVue'
import Datatable from '@/components/datatable/Datatable'
import Pagination from '@/components/datatable/Pagination'
import GridVue from '@/components/layouts/GridVue'
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    SiteTemplate,
    AddContentVue,
    Datatable,
    Pagination,
    GridVue
  },
  created() {
    let userSession = sessionStorage.getItem('user')
    if(userSession){
      this.user = JSON.parse(userSession)
      this.name = this.user.name
      this.email = this.user.email

      this.getProducts()
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
  data() {
        let sortOrders = {};
        let columns = [
            {width: '15%', label: 'Imagem', name: 'image'},
            {width: '15%', label: 'Produto', name: 'name'},
            {width: '15%', label: 'Status', name: 'status'},
            {width: '15%', label: 'Atualizado', name: 'updated_at_human' },
            {width: '15%', label: 'Criado', name: 'created_at_human' },
            {width: '25%', label: '' },
        ];
        columns.forEach((column) => {
           sortOrders[column.name] = -1;
        });
        return {
          user: [],
          products: [],
          columns: columns,
          sortKey: 'created_at_human',
          sortOrders: sortOrders,
          length: 10,
          search: '',
          pagination: {
              currentPage: 1,
              total: '',
              nextPage: '',
              prevPage: '',
              from: '',
              to: ''
          },
        }
    },
    methods: {
        getProducts() {
            axios({
              method: 'get',
              url: process.env.API_URL + '/products',
              headers: { 'Authorization': 'Bearer ' + this.user.token }
            })
            .then(response => {
                this.products = response.data;
                this.pagination.total = this.products.length;
            })
            .catch(e => {
              console.log(e.response)
              if(e.response.data.code == 401){
                console.log('Usuário não logado!')
                sessionStorage.clear()
                this.user = false;
                this.$router.push('/login')
              }else{
                alert('Erro! Tente novamente mais tarde')
              }
            });
        },
        removeProduct(id) {
          if(!confirm('Tem certeza?')) return
          
          axios({
            method: 'delete',
            url: process.env.API_URL + '/products/' + id,
            headers: { 'Authorization': 'Bearer ' + this.user.token }
          })
          .then(response => {
              console.log('produto excluido com sucesso')
              alert('produto excluido com sucesso')
              this.getProducts()
          })
          .catch(e => {
            console.log(e.response)
            if(e.response.data.code == 401){
              console.log('Usuário não logado!')
              sessionStorage.clear()
              this.user = false;
              this.$router.push('/login')
            }else{
              alert('Erro! Tente novamente mais tarde')
            }
          });
        },
        paginate(array, length, pageNumber) {
            this.pagination.from = array.length ? ((pageNumber - 1) * length) + 1 : ' ';
            this.pagination.to = pageNumber * length > array.length ? array.length : pageNumber * length;
            this.pagination.prevPage = pageNumber > 1 ? pageNumber : '';
            this.pagination.nextPage = array.length > this.pagination.to ? pageNumber + 1 : '';
            return array.slice((pageNumber - 1) * length, pageNumber * length);
        },
        resetPagination() {
            this.pagination.currentPage = 1;
            this.pagination.prevPage = '';
            this.pagination.nextPage = '';
        },
        sortBy(key) {
            this.resetPagination();
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1;
        },
        getIndex(array, key, value) {
            return array.findIndex(i => i[key] == value)
        },
    },
    computed: {
        filteredProducts() {
            let products = this.products;
            if (this.search) {
                products = products.filter((row) => {
                    return Object.keys(row).some((key) => {
                        return String(row[key]).toLowerCase().indexOf(this.search.toLowerCase()) > -1;
                    })
                });
            }
            let sortKey = this.sortKey;
            let order = this.sortOrders[sortKey] || 1;
            if (sortKey) {
                products = products.slice().sort((a, b) => {
                    let index = this.getIndex(this.columns, 'name', sortKey);
                    a = String(a[sortKey]).toLowerCase();
                    b = String(b[sortKey]).toLowerCase();
                    if (this.columns[index].type && this.columns[index].type === 'date') {
                        return (a === b ? 0 : new Date(a).getTime() > new Date(b).getTime() ? 1 : -1) * order;
                    } else if (this.columns[index].type && this.columns[index].type === 'number') {
                        return (+a === +b ? 0 : +a > +b ? 1 : -1) * order;
                    } else {
                        return (a === b ? 0 : a > b ? 1 : -1) * order;
                    }
                });
            }
            return products;
        },
        paginated() {
            return this.paginate(this.filteredProducts, this.length, this.pagination.currentPage);
        }
    }
}
</script>
