import React, { FunctionComponent, useState } from "react";
import { ChessTileProps, MemoChessTile } from "./ChessTile";
import "../Styles/ChessStyles.css";
import { Box, Grid } from "@mui/material";
import {
  allPieceColorType,
  chessPieceNameType,
  MoveInfo,
  pieceNameToClassMapBlack,
  pieceNameToClassMapWhite,
  Position,
  resetBoard,
} from "../model/ChessModels";
import { HashMap, HashSet } from "../model/CustomDataStructures";
interface ChessComponentProps {}

export interface ChessContext {
  occupiedPositionsWhite: HashMap<Position, chessPieceNameType>;
  occupiedPositionsBlack: HashMap<Position, chessPieceNameType>;
  blackKingPos: Position;
  whiteKingPos: Position;
  selectedPos: Position | null;
  startMove: MoveInfo;
  currMove: MoveInfo;
  currTurn: allPieceColorType | null;
  possibleMoves: HashSet<Position>;
}

export const enum ColorOptions {
  LIGHT,
  DARK,
  LIGHT_HIGHLITED,
  DARK_HIGHLIGTED,
  KING_CHECK_LIGHT,
}

const getTile = (
  state: ChessContext,
  i: number,
  j: number,
  clickHandler: (pos: Position) => void
) => {
  let currPos: Position = { x: i, y: j };
  let pieceName: chessPieceNameType | undefined;
  let pieceColor: allPieceColorType | undefined;
  if (state.occupiedPositionsBlack.has(currPos)) {
    pieceColor = "BLACK";
    pieceName = state.occupiedPositionsBlack.get(currPos);
  } else if (state.occupiedPositionsWhite.has(currPos)) {
    pieceColor = "WHITE";
    pieceName = state.occupiedPositionsWhite.get(currPos);
  } else {
    pieceColor = undefined;
    pieceName = undefined;
  }
  let tileBackgroundColor: ColorOptions;
  if ((i + j) % 2 === 0) {
    tileBackgroundColor = ColorOptions.LIGHT;
    if (state.possibleMoves.has(currPos))
      tileBackgroundColor = ColorOptions.LIGHT_HIGHLITED;
  } else {
    tileBackgroundColor = ColorOptions.DARK;
    if (state.possibleMoves.has(currPos))
      tileBackgroundColor = ColorOptions.DARK_HIGHLIGTED;
  }

  let chessTileProps: ChessTileProps = {
    x: i,
    y: j,
    pieceName: pieceName,
    pieceColor: pieceColor,
    tileBackgroundColor: tileBackgroundColor,
    clickHandler: clickHandler,
  };
  return chessTileProps;
};

const getGrid = (
  state: ChessContext,
  clickHandler: (pos: Position) => void
) => {
  let rowOutput = [];
  for (let i = 0; i < 8; i++) {
    let colOutput = [];
    for (let j = 0; j < 8; j++) {
      let chessTileProps: ChessTileProps = getTile(state, i, j, clickHandler);
      colOutput.push(
        <Grid
          item
          sx={{ flexGrow: "1", margin: "auto" }}
          key={"ChessComponent" + i + j}
        >
          <MemoChessTile {...chessTileProps}></MemoChessTile>
        </Grid>
      );
    }
    rowOutput.push(
      <Grid
        container
        spacing={0}
        sx={{ width: "100%" }}
        key={"GridContainer" + i}
      >
        {colOutput}
      </Grid>
    );
  }
  return rowOutput;
};

const updateAvailableMoves = (
  currPos: Position | null,
  allPositions: Position[],
  setState: React.Dispatch<React.SetStateAction<ChessContext>>
) => {
  setState((prevState) => {
    let updatedMoves = Object.assign({}, prevState.possibleMoves);
    updatedMoves.store = new Set(prevState.possibleMoves.store);
    updatedMoves.clear();
    for (let aPos of allPositions) {
      updatedMoves.add(aPos);
    }

    return {
      ...prevState,
      possibleMoves: updatedMoves,
      selectedPos: currPos,
    };
  });
};

const registerMove = (
  currPos: Position,
  setState: React.Dispatch<React.SetStateAction<ChessContext>>
) => {
  setState((prevState) => {
    let modifiedWhitePositions = Object.assign(
      {},
      prevState.occupiedPositionsWhite
    );
    modifiedWhitePositions.store = new Map(
      prevState.occupiedPositionsWhite.store
    );
    let modifiedBlackPositions = Object.assign(
      {},
      prevState.occupiedPositionsBlack
    );
    modifiedBlackPositions.store = new Map(
      prevState.occupiedPositionsBlack.store
    );
    if (prevState.currTurn === "WHITE") {
      let currPieceName: chessPieceNameType | undefined;
      if (prevState.selectedPos !== null) {
        currPieceName = modifiedWhitePositions.get(prevState.selectedPos);
        modifiedWhitePositions.delete(prevState.selectedPos);
      }

      let capturedPieceName = modifiedBlackPositions.get(currPos);
      modifiedBlackPositions.delete(currPos);
      if (currPieceName !== undefined) {
        modifiedWhitePositions.set(currPos, currPieceName);
      }
      console.log(
        "difference: ",
        modifiedWhitePositions,
        prevState.occupiedPositionsWhite
      );
      // let move: MoveInfo = {
      //   endPos: currPos,
      //   currTurn: prevState.currTurn,
      //   nextMove: prevState.currMove,
      //   pieceCaptured:
      //     capturedPieceName !== undefined ? capturedPieceName : null,
      //   pieceName: currPieceName !== undefined ? currPieceName : null,
      //   prevMove: null,
      //   startPos: prevState.selectedPos,
      // };

      // let currMoveModified: MoveInfo = Object.assign({}, prevState.currMove);
      // if (currMoveModified.prevMove?.nextMove != null) {
      //   currMoveModified.prevMove.nextMove = move;
      //   move.prevMove = currMoveModified.prevMove;
      //   move.nextMove = currMoveModified;
      //   currMoveModified.prevMove = move;
      // }
      // let isWhiteTurn = state.isWhiteTurn ? false : true;
      // console.log(isWhiteTurn);
      // updateAvailableMoves(null, [], prevState, setState);
      // let updatedState: ChessContext = Object.assign({}, prevState);
      // updatedState.occupiedPositionsBlack = modifiedBlackPositions;
      // updatedState.occupiedPositionsWhite = modifiedWhitePositions;
      // updatedState.currMove = currMoveModified;
      // updatedState.currTurn = "BLACK";
      // console.log("isWhiteTurn", state.isWhiteTurn);
      return {
        ...prevState,
        occupiedPositionsWhite: modifiedWhitePositions,
        occupiedPositionsBlack: modifiedBlackPositions,
        // currMove: currMoveModified,
        currTurn: "WHITE",
        selectedPos: null,
        // possibleMoves: prevState.possibleMoves.clear(),
      } as ChessContext;
      // setState(updatedState);
    } else {
      let currPieceName: chessPieceNameType | undefined;
      if (prevState.selectedPos !== null) {
        currPieceName = modifiedBlackPositions.get(prevState.selectedPos);
        modifiedBlackPositions.delete(prevState.selectedPos);
      }
      let capturedPieceName = modifiedWhitePositions.get(currPos);
      modifiedWhitePositions.delete(currPos);
      if (currPieceName !== undefined) {
        modifiedBlackPositions.set(currPos, currPieceName);
      }
      let move: MoveInfo = {
        endPos: currPos,
        currTurn: prevState.currTurn,
        nextMove: prevState.currMove,
        pieceCaptured:
          capturedPieceName !== undefined ? capturedPieceName : null,
        pieceName: currPieceName !== undefined ? currPieceName : null,
        prevMove: null,
        startPos: prevState.selectedPos,
      };

      let currMoveModified: MoveInfo = Object.assign({}, prevState.currMove);
      if (currMoveModified.prevMove?.nextMove != null) {
        currMoveModified.prevMove.nextMove = move;
        move.prevMove = currMoveModified.prevMove;
        move.nextMove = currMoveModified;
        currMoveModified.prevMove = move;
      }
      // let isWhiteTurn = state.isWhiteTurn ? false : true;
      // console.log(isWhiteTurn);
      // updateAvailableMoves(null, [], prevState, setState);
      // let updatedState: ChessContext = Object.assign({}, state);
      // updatedState.occupiedPositionsBlack = modifiedBlackPositions;
      // updatedState.occupiedPositionsWhite = modifiedWhitePositions;
      // updatedState.currMove = currMoveModified;
      // updatedState.isWhiteTurn = !updatedState.isWhiteTurn;
      // console.log("isWhiteTurn", state.isWhiteTurn);
      return {
        ...prevState,
        occupiedPositionsWhite: modifiedWhitePositions,
        occupiedPositionsBlack: modifiedBlackPositions,
        currMove: currMoveModified,
        currTurn: "BLACK",
        selectedPos: null,
        possibleMoves: prevState.possibleMoves.clear(),
      } as ChessContext;
    }
  });
};

const clickHandleHelper = (
  currPos: Position,
  state: ChessContext,
  setState: React.Dispatch<React.SetStateAction<ChessContext>>
) => {
  console.log(state);
  if (state.possibleMoves.has(currPos)) {
    //dispatch action to register move

    registerMove(currPos, setState);
  } else {
    if (
      state.occupiedPositionsBlack.has(currPos) &&
      state.currTurn === "BLACK"
    ) {
      //update possible moves
      let currPieceName: chessPieceNameType | undefined =
        state.occupiedPositionsBlack.get(currPos);
      if (currPieceName != undefined) {
        let pieceClass = pieceNameToClassMapBlack.get(currPieceName);
        let movements = pieceClass?.availableMovements(
          currPos.x,
          currPos.y,
          state.occupiedPositionsWhite,
          state.occupiedPositionsBlack
        );
        if (movements != undefined) {
          updateAvailableMoves(currPos, movements, setState);
        }
      }
    } else if (
      state.occupiedPositionsWhite.has(currPos) &&
      state.currTurn === "WHITE"
    ) {
      //update possible moves
      let currPieceName: chessPieceNameType | undefined =
        state.occupiedPositionsWhite.get(currPos);
      if (currPieceName != undefined) {
        let pieceClass = pieceNameToClassMapWhite.get(currPieceName);
        let movements = pieceClass?.availableMovements(
          currPos.x,
          currPos.y,
          state.occupiedPositionsWhite,
          state.occupiedPositionsBlack
        );
        if (movements != undefined) {
          updateAvailableMoves(currPos, movements, setState);
        }
      }
    } else {
      updateAvailableMoves(null, [], setState);
    }
  }
};

const ChessComponent: FunctionComponent<ChessComponentProps> = () => {
  const [chessContextState, setChessContextState] = useState<ChessContext>(
    resetBoard()
  );
  const clickHandler = (pos: Position) => {
    clickHandleHelper(pos, chessContextState, setChessContextState);
  };
  return (
    <div className="chess-container">
      <Box sx={{ width: "50em", height: "50em", margin: "auto" }}>
        {getGrid(chessContextState, clickHandler)}
      </Box>
    </div>
  );
};

export default ChessComponent;
