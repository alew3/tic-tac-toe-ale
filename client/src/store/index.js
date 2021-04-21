import { createStore } from "vuex";
import { BoardState } from "@/classes/BoardState";
import { PIECETYPE } from "../constants";


let boardState = new BoardState(['','','','','','','','','']) // (['x','o','','','o','','x','x','o'])
boardState.playerTurn = PIECETYPE.CROSS

export default createStore({
  state: {
    boardState
  },
  mutations: {},
  actions: {},
  modules: {},
});