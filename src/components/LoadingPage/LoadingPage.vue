<template>
<v-container class="loading d-flex justify-center align-center">
      <v-progress-circular
        :size="120"
        :width="15"
        color="indigo darken-1"
        indeterminate
      ></v-progress-circular>
    </v-container>
</template>
<script>
export default {
    name : 'LoadingPage',
}
</script>
<style scoped>
.loading {
width: 100vw;
height: 100vh;
background-image: url('../../assets/img/background.jpg');
background-size: cover;
}
</style>