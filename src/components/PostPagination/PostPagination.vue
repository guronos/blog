<template>
  <v-select
    class="mt-2"
    :items="quantityShowPost"
    @input="$emit('handleShowQuantityPosts', $event)"
    label="Постов на странице"
    outlined
    background-color="#c1d9ee"
    hide-selected
  ></v-select>
</template>

<script>
export default {
  name: "PostPagination",
  props: {
    quantityShowPost: Array,
  },
};
</script>
