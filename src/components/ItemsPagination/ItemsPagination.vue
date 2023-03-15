<template>
    <div class="text-center">
      <v-pagination
        color="light-blue accent-4"
        :value="currentPage"
        :length="4" 
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="$emit('handleChangeCurrentPage', $event)"
      ></v-pagination>
      <v-select
            :items="quantityShowPost"
            @input="$emit('handleShowQuantityPosts', $event)"
            label="Постов на странице"
            outlined
          ></v-select>
    </div>
</template>

<script>
export default {
    name : 'ItemsPaginations',
    props : {
    quantityShowPost : Array,
    currentPage : Number
    },
    data () {
    return {
        page : '',
        items: [1, 2, 5, 10],
    }
  },
}
</script>

<style>

</style>