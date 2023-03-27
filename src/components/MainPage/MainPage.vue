<template>
  <div>
    <LoadingPage v-if="loadingData" />
    <v-carousel
      hide-delimiters
      height="90vh"
      cycle
      interval="10000"
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(item, i) in showPages"
        :key="i"
        :src="item.img"
        class="cyan lighten-4"
      >
        <v-row class="fill-height" align="center" justify="center">
          <v-card
            elevation="8"
            outlined
            class="card"
            :href="item.link"
            target="_blank"
          >
            <div :class="item.color">
              <v-card-title>
                {{ item.title }}
              </v-card-title>
              <v-card-text class="text-slades">
                {{ item.content }}
              </v-card-text>
            </div>
          </v-card>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LoadingPage from "../LoadingPage/";
export default {
  name: "MainPage",
  components: { LoadingPage },
  created() {
    this.getPostsForMainPage();
  },
  computed: {
    ...mapGetters(["showPages", "loadingData"]),
  },
  methods: {
    ...mapActions(["getPostsForMainPage"]),
  },
};
</script>

<style lang="scss" scoped>
$maxWidth: 60%;
@mixin card-color(
  $oneColorBlock: white,
  $twoColorBlock: gray,
  $colorText: rgb(255, 255, 255)
) {
  background: linear-gradient(to bottom left, $oneColorBlock, $twoColorBlock);
  color: $colorText;
  margin: -1px;
}

.green-card {
  @include card-color(#206123, #039b51);
}
.blue-card {
  @include card-color(#1a0c6d, #0a597e);
}
.purple-card {
  @include card-color(#550874da, #940a94e0);
}
.red-card {
  @include card-color(#741a03de, #ce1d1d);
}
.black-card {
  @include card-color(#242323de, #3a3232);
}
.card {
  max-width: $maxWidth;
}
.text-slades {
  font-size: 18px;
}
</style>
