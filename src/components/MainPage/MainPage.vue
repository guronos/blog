<template>
  <div>
  <LoadingPage v-if="loadingData" />
    <v-carousel hide-delimiters height="90vh" cycle interval="10000" show-arrows-on-hover>
      <v-carousel-item
        v-for="(item,i) in showPages"
        :key="i"
        :src="item.img[0]"
        class="cyan lighten-4"
      >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
          <v-card   
          elevation="8"
          outlined
          class="card"
          >
          <div 
          :class='item.color'
          >
            <v-card-title class="text-slades">
              {{ item.title }} 
            </v-card-title>
            <v-card-text>
              {{item.content}}
            </v-card-text></div>
          </v-card>
          </v-row>

    </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LoadingPage from '../LoadingPage/'
export default {
  name : 'MainPage',
  components : {LoadingPage},
  created () {
this.getRequestPosts([this.routeToPages])
  },
  computed:{
    ...mapGetters(['routeToPages', 'showPages', 'loadingData'])
  },
  methods:{
    ...mapActions(['getRequestPosts'])
  }
}
</script>

<style lang="scss" scoped>
$maxWidth:60%;
@mixin card-color($oneColorBlock:white, $twoColorBlock:gray, $colorText:black) {
  background: linear-gradient(to bottom left, $oneColorBlock, $twoColorBlock);
color: $colorText;
margin: -1px;
}

.green-card {
  @include card-color(#206123, #039b51)
}
.blue-card {
  @include card-color(#1a0c6d, #0a597e, rgb(226, 224, 224))
}
.purple-card {
  @include card-color(#550874da, #940a94e0, rgb(15, 15, 15))
}
.red-card {
  @include card-color(#741a03de, #ce1d1d, rgb(255, 253, 253))
}
.black-card {
  @include card-color(#242323de, #3a3232, rgb(255, 253, 253))
}
.card {
  max-width: $maxWidth;
}
</style>