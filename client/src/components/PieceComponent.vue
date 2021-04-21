<template>
    <img class="piece"
    v-if="pieceImage!=0"
    :src="require(`../assets/${pieceImage}`)"
  />
</template>

<script>

export default {
  props: {
    pieceImage: String,
  },
}
</script>

<style scoped>

.piece {
  width: 100%;
  height: 100%;
}

img {
  pointer-events: none;
}

</style>