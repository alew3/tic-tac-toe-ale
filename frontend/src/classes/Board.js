import { PIECETYPE } from "../constants";
import { BoardState } from "./BoardState";

export class Board {
    static getPieceAt(boardState,pos) {
        return boardState.squares[pos]
    }

    static setPieceAt(boardState,pieceType,pos) {
        boardState.squares[pos] = pieceType
    }

    static getAllowedMoves(boardState) {
        let alllowedMoves = new Array()
        for(let i=0;i<boardState.squares.length;i++) {
            if (boardState.squares[i]==PIECETYPE.NONE)
                alllowedMoves.push(i)
        }
        console.log(alllowedMoves)
        return alllowedMoves
    }

    static getPieceName(value) {
        if (value==PIECETYPE.CROSS) return "X"
        if (value==PIECETYPE.CIRCLE) return "O"
        if (value==PIECETYPE.NONE) return ""
    }

    static getPieceImage(boardState,pos) {
        let piece = boardState.squares[pos]
        //console.log("PIECE=",piece,boardState,pos)
        if (piece==PIECETYPE.CROSS) return "x.svg"
        if (piece==PIECETYPE.CIRCLE) return "o.svg"
        if (piece==PIECETYPE.NONE) return "none.svg"
    }

    static resetBoard(boardState) {
        boardState = boardState.resetVars()
    }

    static play(boardState,pos) {
        // game has already ended
        if (boardState.ended)
            return

        // check the position is empty for a piece 
        if (Board.getPieceAt(boardState,pos)!=0) {
            console.warn("Position not allowed, there already is a piece at ",pos)
            return
        }

        // put piece on board
        Board.setPieceAt(boardState,boardState.playerTurn,pos)

        // check for win
        if (Board.verifyWin(boardState,boardState.playerTurn)) {
            console.warn("player:", boardState.playerTurn," has Won! End of game")
            boardState.ended = true
            boardState.winner = boardState.playerTurn
            return
        }


        // check for end of game - no more moves
        if (Board.getAllowedMoves(boardState).length==0) {
            console.warn("No more moves, end of game",pos)
            boardState.ended = true
            return
        }

        // change turns
        boardState.playerTurn = (boardState.playerTurn==PIECETYPE.CROSS?PIECETYPE.CIRCLE:PIECETYPE.CROSS)            
    }

    static verifyWin(boardState,player) {

        let possibleWins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

        for (let i=0;i<possibleWins.length;i++) {
            if (Board.getPieceAt(boardState,possibleWins[i][0])==player && Board.getPieceAt(boardState,possibleWins[i][1])==player && Board.getPieceAt(boardState,possibleWins[i][2])==player) {
                console.log("Win at ",possibleWins[i])
                return true
            }
        }

        return false
    }
}