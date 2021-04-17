<template >
      <div class="bg-gray-50 h-full w-full border-1 border-red-500 p-0 m-0" @mousedown="Clicked">
      <!-- {{index}} -->
        <Piece :pieceImage="getPieceImage()"></Piece>
      </div>
</template>

<script>
import Piece from "@/components/PieceComponent.vue";
import { mapState } from "vuex";
import { Board } from "@/classes/Board";
import { PIECETYPE } from "@/constants.js";


export default {
components: {
  Piece
},
 props: {
    index: Number,
  },
  computed: {
    ...mapState(["boardState"]),
  },
  methods: {
    Clicked() {
      Board.play(this.boardState,this.index)
    },
    getPieceImage() {
      return Board.getPieceImage(this.boardState,this.index)
    }
    
  }
}
</script>

<style>

</style>