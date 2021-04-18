import { PIECETYPE } from "../constants";
import { BoardState } from "./BoardState";

export class Board {

    static getPieceAt(boardState,pos) {
        return boardState.squares[pos]
    }

    static setPieceAt(boardState,pieceType,pos) {
        boardState.squares[pos] = pieceType
    }

    // get empty squares
    static getAllowedMoves(squares) {
        let alllowedMoves = new Array()

        // method 1 - fastest
        // for(let i=0;i<squares.length;i++) {
        //     if (squares[i]==PIECETYPE.NONE)
        //         alllowedMoves.push(i)
        // }

        // method 2
        //let alllowedMoves = squares.map((square, i) => square === PIECETYPE.NONE ? i : -1).filter(index => index !=-1)
        
        // method 3 - slowest
        //let alllowedMoves = squares.flatMap((square, i) => square === PIECETYPE.NONE ? i : []);

        // method 4 - fastest
        squares.forEach((square, index) => square === PIECETYPE.NONE ? alllowedMoves.push(index) : null)


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

    static search(boardState) {
        console.time("search")
        this.playerturn_wins = 0
        this.opponent_wins = 0
        this.draws = 0
        this.count = 0
        this.recommendedMove = -1
        console.log("PLAYER_TURN=",boardState.playerTurn)
        let score = Board.minimax(boardState.squares,0,boardState.playerTurn)

        
        console.timeEnd("search")
        // console.log("PLAYER WINS=", this.playerturn_wins)
        // console.log("OPPONENT WINS=", this.opponent_wins)
        // console.log("DRAWS=", this.draws)
        // console.log("TOTALGAMES=", this.playerturn_wins+this.opponent_wins+this.draws)
        // console.log("POSSIBLE PATHS=", this.count)

        // get max points
        console.log("RECOMMENDED MOVE:",this.recommendedMove)
        //console.log("AI RECOMMENDED MOVE=",possibleMoves[recommendedMove])
        return this.recommendedMove
    }


    // use the minimax algorithm to select a move
    static minimax(squares,depth,playerTurn,maximize=true) {

        let possibleMoves = Board.getAllowedMoves(squares)
        //console.log("POSSIBLE MOVES",possibleMoves," DEPTH=",depth)
        let opponent = Board.getAlternatePlayer(playerTurn)

        if (possibleMoves.length==0) {
            //console.log("it's a draw")
            this.draws++
            return 0
        }

        if (Board.verifyWin(squares,playerTurn)) {
           // console.log(squares,playerTurn," has won")
            this.playerturn_wins++
            return -10
        }

        if (Board.verifyWin(squares,opponent)) {
            //console.log(squares,opponent," has won")
            this.opponent_wins++
            return +10
        }

        if (maximize) {
            let maxEval = -1000
            let score = new Array(possibleMoves)
            for(let i=0;i<possibleMoves.length;i++) {
                let cloneSquares = JSON.parse(JSON.stringify(squares))
                cloneSquares[possibleMoves[i]] = playerTurn
                score[i] = Board.minimax(cloneSquares,depth+1,opponent,false)
            }
            maxEval = Math.max(maxEval,...score)
            this.recommendedMove = possibleMoves[score.indexOf(maxEval)]

            // console.log("MOVES:",possibleMoves)
            // console.log("SCORES:",score)
            // console.log("MAXEVAL:",maxEval)

            return maxEval
        } else {
            let minEval = +1000
            let score = new Array(possibleMoves)
            for(let i=0;i<possibleMoves.length;i++) {
                let cloneSquares = JSON.parse(JSON.stringify(squares))
                cloneSquares[possibleMoves[i]] = playerTurn
                score[i] = Board.minimax(cloneSquares,depth+1,opponent,true)
            }
            minEval = Math.min(minEval,...score)
            this.recommendedMove = possibleMoves[score.indexOf(minEval)]

            // console.log("MOVES:",possibleMoves)
            // console.log("SCORES:",score)
            // console.log("MINEVAL:",minEval)

            return minEval
        }
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
        if (Board.verifyWin(boardState.squares,boardState.playerTurn)) {
            console.warn("player:", boardState.playerTurn," has Won! End of game")
            boardState.ended = true
            boardState.winner = boardState.playerTurn
            return
        }


        // check for end of game - no more moves
        if (Board.getAllowedMoves(boardState.squares).length==0) {
            console.warn("No more moves, end of game",pos)
            boardState.ended = true
            return
        }

        // change turns
        boardState.playerTurn = Board.getAlternatePlayer(boardState.playerTurn) 
    }

    static verifyWin(squares,player) {

        let possibleWins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

        for (let i=0;i<possibleWins.length;i++) {
            if (squares[possibleWins[i][0]]==player && squares[possibleWins[i][1]]==player && squares[possibleWins[i][2]]==player) {
                //console.log("Win at ",possibleWins[i])
                return true
            }
        }

        return false
    }

    static getAlternatePlayer(player) {
        return (player==PIECETYPE.CROSS?PIECETYPE.CIRCLE:PIECETYPE.CROSS)            
    }
}