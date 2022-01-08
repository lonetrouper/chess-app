import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ChessComponent from "./components/ChessComponent";
import { ChessContext, ChessCtx } from "./context/ChessContext";
import {
  resetBlackPieces,
  resetBoard,
  resetWhitePieces,
} from "./model/ChessModels";

const chessContextImpl: ChessContext = {
  occupiedPositionsBlack: resetBlackPieces(),
  occupiedPositionsWhite: resetWhitePieces(),
};
function App() {
  console.log(chessContextImpl);
  return (
    <ChessCtx.Provider value={chessContextImpl}>
      <div className="App">
        <ChessComponent />
      </div>
    </ChessCtx.Provider>
  );
}

export default App;
