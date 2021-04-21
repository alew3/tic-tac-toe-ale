
import { PIECETYPE } from "@/constants.js";

export class BoardState {

    constructor(squares) {
        this.resetVars()
        console.log("init state",squares)
        if (squares!=null)
            for (let i=0;i<squares.length;i++) {
                switch (squares[i]) {
                case "x":
                    this.squares[i]=PIECETYPE.CROSS
                    break;
                case "o":
                    this.squares[i]=PIECETYPE.CIRCLE
                    break
                case null:
                case "":
                    this.squares[i]=PIECETYPE.NONE
                    break;
                }
            }
        console.log("SQUARES",this.squares)
    }

    resetVars() {
        this.squares = [0,0,0,0,0,0,0,0,0]
        this.playerTurn = PIECETYPE.CROSS
        this.ended = false
        this.winner = PIECETYPE.NONE
    }
}