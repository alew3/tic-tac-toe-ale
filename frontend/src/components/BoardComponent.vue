<template>
    <div>
        <button class="m-2" @click="reset">Reset Board</button>
        <button class="m-2">Player Turn {{PlayerTurn}}</button>
        <button class="m-2">Ended {{boardState.ended}}</button>
        <button class="m-2" @click="search">Search Tree</button>

        <button v-if="PlayerWon!=0" class="m-2 bg-red-500">Player WON {{PlayerWon}}</button>
    </div>

    <div class="opponent">
      <h2>Opponent</h2> 
      <input type="radio" id="human" name="opponent" value="human"  checked="checked"><label for="human">Human</label> 
      <input type="radio" id="minmax" name="opponent" value="minmax"><label for="human">MinMax</label> 
      <input type="radio" id="supervised" name="opponent" value="supervised"><label for="human">SuperVised</label>
      <input type="radio" id="reinforcement" name="opponent" value="reinforcement"><label for="human">Reinforcement</label>
    </div>

    <div class="boardcontainer">
        <div class="board">
            <div> <Square :index="0"></Square></div>
            <div class="border-l-2 border-r-2 border-fuchsia-600"><Square :index="1"></Square></div>
            <div> <Square :index="2"></Square></div>
            <div class="border-t-2 border-b-2 border-fuchsia-600"><Square :index="3"></Square></div>
            <div class="border-2"> <Square :index="4"></Square></div>
            <div class="border-t-2 border-b-2"> <Square :index="5"></Square></div>
            <div> <Square :index="6"></Square></div>
            <div class="border-l-2 border-r-2"> <Square :index="7"></Square></div>
            <div> <Square :index="8"></Square></div>
        </div>
    </div>

</template>

<script>
import { defineComponent } from "vue";
import Square from "@/components/SquareComponent.vue";
import { Board } from "@/classes/Board";
import { PIECETYPE} from "@/constants.js"

import { mapState } from "vuex";

export default defineComponent({
    components: {
      Square
    },
      computed: {
      ...mapState(["boardState"]),
      PlayerTurn() {
        return Board.getPieceName(this.boardState.playerTurn)
      },
      
      PlayerWon() {
        return Board.getPieceName(this.boardState.winner)
      }
    },
    methods: {
      reset() {
        Board.resetBoard(this.boardState)
      },
      search() {
        console.log("BEGIN SEARCH")
        console.log("Found possible paths",Board.search(this.boardState,PIECETYPE.CROSS))
        console.log("END SEARCH")
      }
    }
  
})
</script>

<style scoped lang="scss">

.board {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 500px;
  min-height: 500px;
  max-width: 50vw;
  max-height: 50vh;
}

.board > div {
  @apply w-4/12 p-0 m-0;
}

.boardcontainer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.wrapper {
  text-align: center;
  width: 33%;
  height: 33%;
  padding: 0;
  margin: 0;
  background-color: grey;
}

.opponent > label {
  @apply m-3
}
</style>