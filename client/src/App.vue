<template>
      <h1>Tic Tac Toe - Ale</h1>
      <BoardComponent></BoardComponent>
</template>

<script>
import BoardComponent from "@/components/BoardComponent.vue"; 

export default {
  name: "App",
  components: {
    BoardComponent,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
