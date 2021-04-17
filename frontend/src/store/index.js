import { createStore } from "vuex";
import { BoardState } from "@/classes/BoardState";
import { Circle, Cross } from "../classes/Piece";


let boardState = new BoardState(['x','o','','x','o','','','',''])

export default createStore({
  state: {
    boardState
  },
  mutations: {},
  actions: {},
  modules: {},
});
