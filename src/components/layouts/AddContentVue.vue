<template>
  <div class="row">
      <p>
        <grid-vue tamanho="4 offset-s8">
          <router-link to="/product" class="btn-large right">
            <i class="material-icons left">add</i>Produto
          </router-link>
        </grid-vue>
      </p>
    </div>
</template>

<script>
import GridVue from '@/components/layouts/GridVue'

export default {
  name: 'AddContentVue',
  components: {
    GridVue
  }
}
</script>