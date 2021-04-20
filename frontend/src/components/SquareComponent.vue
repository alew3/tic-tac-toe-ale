<template >
      <div class="bg-gray-80 h-full w-full border-1 border-red-500 p-0 m-0" @mousedown="Clicked">
        <span class="num">{{index}}</span>
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
  emits: ["board-clicked"],
  computed: {
    ...mapState(["boardState"]),
  },
  methods: {
    Clicked() {
      console.log("emiiting event",this.index)
      this.$emit("board-clicked", this.index);
    },
    getPieceImage() {
      return Board.getPieceImage(this.boardState,this.index)
    }
    
  }
}
</script>

<style scoped>
.num {
  position: absolute;
  visibility: hidden;
}
</style>