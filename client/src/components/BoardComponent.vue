<template>
<div>
    <div>
        <button class="m-3" @click="reset">New Game</button>
        <button class="m-3">Player Turn {{PlayerTurn}}</button>
        <button class="m-3" @click="search">Computer Move</button>
        <button v-if="boardState.ended" class="m-3 bg-red-500">Game Ended</button>
        <button v-if="PlayerWon!=0" class="m-3 bg-red-500">Player WON {{PlayerWon}}</button>
    </div>

    <div class="opponent">
      <h2>Opponent:</h2> 
      <input v-model="opponent" type="radio" id="human" name="opponent" value="human" /><label for="human">Human</label> 
      <input v-model="opponent" type="radio" id="minmax" name="opponent" value="minmax" /><label for="human">MinMax AI</label> 
      <input v-model="opponent" type="radio" id="supervised" name="opponent" value="supervised" disabled="true"  /><label for="human">SuperVised Learning</label>
      <input v-model="opponent" type="radio" id="reinforcement" name="opponent" value="reinforcement" disabled="true" /><label for="human">Reinforcement Learning</label>
    </div>

    <div class="boardcontainer">
        <div class="board">
            <div> <Square :index="0" @board-clicked="onBoardClicked"></Square></div>
            <div class="border-l-2 border-r-2 border-indigo-600"><Square :index="1" @board-clicked="onBoardClicked"></Square></div>
            <div> <Square :index="2" @board-clicked="onBoardClicked"></Square></div>
            <div class="border-t-2 border-b-2 border-indigo-600"><Square :index="3" @board-clicked="onBoardClicked"></Square></div>
            <div class="border-2  border-indigo-600" > <Square :index="4" @board-clicked="onBoardClicked"></Square></div>
            <div class="border-t-2 border-b-2  border-indigo-600"> <Square :index="5" @board-clicked="onBoardClicked"></Square></div>
            <div> <Square :index="6" @board-clicked="onBoardClicked"></Square></div>
            <div class="border-l-2 border-r-2 border-indigo-600"> <Square :index="7" @board-clicked="onBoardClicked" ></Square></div>
            <div> <Square :index="8" @board-clicked="onBoardClicked"></Square></div>
        </div>
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
    data() {
      
      return {
        opponent: 'minmax'
      }
      
    },
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
        let move = Board.search(this.boardState)
        Board.play(this.boardState,move)
        console.log("END SEARCH")
      },
      onBoardClicked(move) {
        console.log("Board clicked on position",move,this.opponent)

        // don't accept clicks on positions with existing pieces
        if (this.boardState.squares[move]!=PIECETYPE.NONE) 
          return

        if (this.opponent=='human') {
          console.log("HUMAN MOVE")
          Board.play(this.boardState,move)
          return
        } 

        // computer move
        if (this.opponent=='minmax') {
          Board.play(this.boardState,move)

          let computerMove = Board.search(this.boardState)
          if (computerMove!=-1)
            Board.play(this.boardState,computerMove)
          return
        }
      }

    }
  
})
</script>

<style scoped lang="scss">


.boardcontainer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.board {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 400px;
  min-height: 400px;
  max-width: 45vw;
  max-height: 45vh;
}

.board > div {
  width: 33%;
  padding: 0;
  margin: 0;
  //background-color: grey;
}

.opponent > label {
  @apply m-3
}
</style>