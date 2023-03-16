<template>
        <v-select
            :items="quantityShowPost"
            @input="$emit('handleShowQuantityPosts', $event)"
            label="Постов на странице"
            outlined
          ></v-select>
</template>

<script>
export default {
name : 'PostPagination',
props : {
    quantityShowPost : Array
    },
}
</script>

<style>

</style>