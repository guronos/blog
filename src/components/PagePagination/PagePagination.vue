<template>
    <div class="text-center">
      <v-pagination
        color="light-blue accent-4"
        :value="currentPage"
        :length="quantyPages" 
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="$emit('handleChangeCurrentPage', $event)"
      ></v-pagination>

    </div>
</template>

<script>
export default {
    name : 'ItemsPaginations',
    props : {
    // quantityShowPost : Array,
    currentPage : Number,
    quantyPages : Number
    },
    data () {
    return {
        page : false,
        items: [],
    }
  },
}
</script>

<style>

</style>