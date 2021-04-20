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
        console.time("Begin Search for Move")
        this.playerturn_wins = 0
        this.opponent_wins = 0
        this.draws = 0
        this.count = 0
        this.recommendedMove = -1
        let score = Board.minimax(boardState.squares,0,boardState.playerTurn)
        console.timeEnd("Begin Search for Move")
        console.log("POSSIBLE MOVES=", this.count)
        console.log("PLAYER WINS=", this.playerturn_wins)
        console.log("OPPONENT WINS=", this.opponent_wins)
        console.log("DRAWS=", this.draws)
        console.log("TOTALGAMES=", this.playerturn_wins+this.opponent_wins+this.draws)

        // get max points
        console.log("RECOMMENDED MOVE:",this.recommendedMove)
        return this.recommendedMove
    }

    // use the minimax algorithm to select a move
    static minimax(squares,depth,maximizePlayer,maximize=true,alpha=-1000,beta=1000) {
        let opponent = Board.getAlternatePlayer(maximizePlayer)
        let possibleMoves = Board.getAllowedMoves(squares) 
        let playerTurn = (maximize?maximizePlayer:opponent)   

        // console.log("BOARD=",squares," DEPTH=",depth," PLAYER_TURN=",playerTurn, " MAX?=",maximize, "OPPONENT=",opponent)
        // console.log("POSSIBLE_MOVES=",possibleMoves)

        if (Board.verifyWin(squares,maximizePlayer)) {
            //console.log(squares,playerTurn," has won")
            this.playerturn_wins++
            return +10 - depth
        }

        if (Board.verifyWin(squares,opponent)) {
            //console.log(squares,opponent," has won")
            this.opponent_wins++
            return -10 + depth
        }

        if (possibleMoves.length==0) {
            this.draws++
            return 0
        }

        let scores = new Array(possibleMoves)

        if (maximize) {
            let maxEval = -10000
            for(let i=0;i<possibleMoves.length;i++) {
                //console.log("PLAYING MOVE=",possibleMoves[i], "PLAYER=", playerTurn)
                this.count++
                let cloneSquares = JSON.parse(JSON.stringify(squares))
                cloneSquares[possibleMoves[i]] = playerTurn
                //console.log("BOARD AFTER PLAY=",cloneSquares)
                scores[i] = Board.minimax(cloneSquares,depth+1,maximizePlayer,false,alpha,beta)
                maxEval = Math.max(maxEval,scores[i])
                alpha = Math.max(alpha,scores[i])
                if (beta <= alpha)
                    break  
            }
            //maxEval = Math.max(maxEval,...scores)
            this.recommendedMove = possibleMoves[scores.indexOf(maxEval)]
            //console.log("SCORES=",scores," MAXEVAL=",maxEval," RECOMM=",this.recommendedMove," index=",scores.indexOf(maxEval))

            return maxEval
        } else {
            let minEval = +10000
            for(let i=0;i<possibleMoves.length;i++) {
                //console.log("PLAYING MOVE=",possibleMoves[i], "PLAYER=", playerTurn)
                this.count++
                let cloneSquares = JSON.parse(JSON.stringify(squares))
                cloneSquares[possibleMoves[i]] = playerTurn
                //console.log("BOARD AFTER PLAY=",cloneSquares)
                scores[i] = Board.minimax(cloneSquares,depth+1,maximizePlayer,true,alpha,beta)
                minEval = Math.min(minEval,scores[i])
                beta = Math.min(beta,scores[i])
                if (beta<=alpha)
                    break
            }
            //minEval = Math.min(minEval,...scores)
            this.recommendedMove = possibleMoves[scores.indexOf(minEval)]
            //console.log("SCORES=",scores," MINEVAL=",minEval," RECOMM=",this.recommendedMove," index=",scores.indexOf(minEval))

            return minEval
        }
    }

    static play(boardState,pos) {
        pos = parseInt(pos)
        // game has already ended
        if (boardState.ended)
            return

        // check the position is empty for a piece 
        if (Board.getPieceAt(boardState,pos)!=0) {
            console.warn("Position not allowed, there already is a piece at ",pos)
            return
        }

        if (pos<0 || pos>8) {
            console.warn("Invalid Move=",pos)
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