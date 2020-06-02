<template>
    <nav class="pagination brown lighten-2" v-if="!client">
        <span class="page-stats">{{pagination.from}} - {{pagination.to}} de {{pagination.total}}</span>
        <a v-if="pagination.prevPageUrl" class="btn brown lighten-2 is-small pagination-previous" @click="$emit('prev');">
            Próximo
        </a>
        <a class="btn brown lighten-2 is-small pagination-previous" v-else :disabled="true">
           Próximo
        </a>

        <a v-if="pagination.nextPageUrl" class="btn brown lighten-2 is-small pagination-next" @click="$emit('next');">
            Anterior
        </a>
        <a class="btn brown lighten-2 is-small pagination-next" v-else :disabled="true">
            Anterior
        </a>
    </nav>

    <nav class="pagination brown lighten-2" v-else>
        <span class="page-stats">
            {{pagination.from}} - {{pagination.to}} de {{filtered.length}}
            <span v-if="filtered.length < pagination.total">(filtradas de um total de {{pagination.total}})</span>
        </span>
        <span class='right'>
            <a v-if="pagination.prevPage" class="btn brown lighten-2 is-small pagination-previous margin" @click="$emit('prev');">
                Anterior
            </a>
            <a class="btn brown lighten-2 is-small pagination-previous" v-else :disabled="true">
               Anterior
            </a>

            <a v-if="pagination.nextPage" class="btn brown lighten-2 is-small pagination-next" @click="$emit('next');">
                Próximo
            </a>
            <a class="btn brown lighten-2 is-small pagination-next" v-else :disabled="true">
                Próximo
            </a>
        </span>
    </nav>
</template>

<script>
    import GridVue from '@/components/layouts/GridVue'

    export default {
        props: ['pagination', 'client', 'filtered'],
        components: {
            GridVue
        }
    }
</script>

<style>
.pagination {
  justify-content: flex-end !important;
}
.pagination .page-stats {
  align-items: center;
  margin-right: 5px;
  margin-left: 30px !important;
}
.pagination i {
  color: #3273dc !important;
}
.pagination-previous,.pagination-next {
    margin-right: 30px !important;
}
</style>