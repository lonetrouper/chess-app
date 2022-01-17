import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { ChessTileProps, MemoChessTile } from "./ChessTile";
import "../Styles/ChessStyles.css";
import { Box, Grid } from "@mui/material";
import {
  allPieceColorType,
  ChessPiece,
  chessPieceNameType,
  createEmptyMove,
  MoveInfo,
  pieceNameToClassMapBlack,
  pieceNameToClassMapWhite,
  Position,
  resetBoard,
  SquareInfo,
} from "../model/ChessModels";
import { HashMap, HashSet } from "../model/CustomDataStructures";
import { King } from "../model/King";
interface ChessComponentProps {}

export const enum ColorOptions {
  LIGHT,
  DARK,
  LIGHT_HIGHLIGHTED,
  DARK_HIGHLIGHTED,
  KING_CHECK_LIGHT,
}

const enum GameStates {
  RUNNING,
  WHITE,
  BLACK,
}

export interface moveState {
  chessBoard: SquareInfo[][];
  availableMoves: Position[];
  isWhiteTurn: boolean;
  allMoves: MoveInfo[];
  moveNumber: number;
  selectedTile: SquareInfo | null;
  whiteKingPos: Position;
  blackKingPos: Position;
  gameState: GameStates;
}

export const updateBoard = (
  selectedTile: SquareInfo | null,
  destinationPos: Position,
  prevState: moveState
) => {
  let modifiedPositions = JSON.parse(JSON.stringify(prevState.chessBoard));
  if (selectedTile !== null) {
    // remove the piece from original position
    modifiedPositions[selectedTile.x][selectedTile.y].pieceColor = null;
    modifiedPositions[selectedTile.x][selectedTile.y].pieceName = null;
  }
  modifiedPositions[destinationPos.x][destinationPos.y].pieceColor = // update piece info in the selected tile
    selectedTile?.pieceColor === undefined ? null : selectedTile.pieceColor;
  modifiedPositions[destinationPos.x][destinationPos.y].pieceName =
    selectedTile?.pieceName === undefined ? null : selectedTile.pieceName;

  //enpassant check
  if (prevState.selectedTile?.pieceName === "PAWN") {
    let pawnClass: ChessPiece = prevState.isWhiteTurn
      ? pieceNameToClassMapWhite["PAWN"]
      : pieceNameToClassMapBlack["PAWN"];
    if (
      pawnClass.isEnPassant !== undefined &&
      pawnClass.isEnPassant(
        {
          x: prevState.selectedTile.x,
          y: prevState.selectedTile.y,
        } as Position,
        destinationPos,
        prevState.allMoves[prevState.moveNumber - 1]
      )
    ) {
      // capturedPiece = "PAWN";
      if (prevState.allMoves[prevState.moveNumber - 1].endPos !== null) {
        let capturedPos: any =
          prevState.allMoves[prevState.moveNumber - 1].endPos;
        prevState.chessBoard[capturedPos.x][capturedPos.y].pieceColor = null;
        prevState.chessBoard[capturedPos.x][capturedPos.y].pieceName = null;
      }
    }
  }
  return modifiedPositions;
};

const getAvailableMovesHelper = (prevState: moveState, currPos: Position) => {
  if (prevState.isWhiteTurn) {
    let currSquare: SquareInfo = prevState.chessBoard[currPos.x][currPos.y];
    if (currSquare.pieceName !== null && currSquare.pieceColor === "WHITE") {
      let pieceName: chessPieceNameType = currSquare.pieceName;
      let possibleMoves: Position[];
      if (pieceName === "PAWN") {
        possibleMoves = pieceNameToClassMapWhite[pieceName].availableMovements(
          currPos.x,
          currPos.y,
          prevState,
          prevState.allMoves[prevState.moveNumber - 1]
        );
      } else {
        possibleMoves = pieceNameToClassMapWhite[pieceName].availableMovements(
          currPos.x,
          currPos.y,
          prevState
        );
      }
      return possibleMoves;
    } else {
      return [];
    }
  } else {
    let currSquare: SquareInfo = prevState.chessBoard[currPos.x][currPos.y];
    if (currSquare.pieceName !== null && currSquare.pieceColor === "BLACK") {
      let pieceName: chessPieceNameType = currSquare.pieceName;
      let possibleMoves: Position[];
      if (pieceName === "PAWN") {
        possibleMoves = pieceNameToClassMapBlack[pieceName].availableMovements(
          currPos.x,
          currPos.y,
          prevState,
          prevState.allMoves[prevState.moveNumber - 1]
        );
      } else {
        possibleMoves = pieceNameToClassMapBlack[pieceName].availableMovements(
          currPos.x,
          currPos.y,
          prevState
        );
      }

      return possibleMoves;
    } else {
      return [];
    }
  }
};

const movesToStopCheck = (prevState: moveState): Position[] => {
  let output: Position[] = [];
  for (let i of prevState.chessBoard) {
    for (let j of i) {
      output.push(
        ...getAvailableMovesHelper(prevState, {
          x: j.x,
          y: j.y,
        } as Position)
      );
      if (output.length > 0) {
        break;
      }
    }
  }
  console.log("checkmate");
  return output;
};
const ChessComponent: FunctionComponent<ChessComponentProps> = () => {
  const [moveState, setMoveState] = useState<moveState>({
    chessBoard: resetBoard(),
    availableMoves: [],
    isWhiteTurn: true,
    allMoves: [createEmptyMove()],
    moveNumber: 1,
    selectedTile: null,
    whiteKingPos: { x: 0, y: 3 } as Position,
    blackKingPos: { x: 7, y: 3 } as Position,
    gameState: GameStates.RUNNING,
  });

  const getTile = (
    squareInfo: SquareInfo,
    availableMoves: Position[],
    clickHandler: (pos: Position) => void
  ) => {
    let pieceName: chessPieceNameType | null;
    let pieceColor: allPieceColorType | null;
    let tileBackgroundColor: ColorOptions;
    if ((squareInfo.x + squareInfo.y) % 2 === 0) {
      tileBackgroundColor = ColorOptions.LIGHT;
      for (let pos of availableMoves) {
        if (pos.x === squareInfo.x && pos.y === squareInfo.y) {
          tileBackgroundColor = ColorOptions.LIGHT_HIGHLIGHTED;
          break;
        }
      }
    } else {
      tileBackgroundColor = ColorOptions.DARK;
      for (let pos of availableMoves) {
        if (pos.x === squareInfo.x && pos.y === squareInfo.y) {
          tileBackgroundColor = ColorOptions.DARK_HIGHLIGHTED;
          break;
        }
      }
    }

    let chessTileProps: ChessTileProps = {
      ...squareInfo,
      clickHandler: clickHandler,
      tileBackgroundColor: tileBackgroundColor,
    };
    return chessTileProps;
  };

  const getGrid = (clickHandler: (pos: Position) => void) => {
    let rowOutput = [];
    for (let i = 0; i < 8; i++) {
      let colOutput = [];
      for (let j = 0; j < 8; j++) {
        let chessTileProps: ChessTileProps = getTile(
          moveState.chessBoard[i][j],
          moveState.availableMoves,
          clickHandler
        );
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

  const currPosInAvailableMoves = (prevState: moveState, currPos: Position) => {
    for (let pos of moveState.availableMoves) {
      if (pos.x === currPos.x && pos.y === currPos.y) {
        return true;
      }
    }
    return false;
  };

  const clickHandler = (currPos: Position) => {
    setMoveState((prevState) => {
      if (currPosInAvailableMoves(prevState, currPos)) {
        return registerMove(currPos, prevState);
      } else {
        let possibleMoves: Position[] = getAvailableMovesHelper(
          prevState,
          currPos
        );
        let selectedTile: SquareInfo =
          prevState.chessBoard[currPos.x][currPos.y];
        return {
          ...prevState,
          availableMoves: possibleMoves,
          selectedTile: selectedTile,
        };
      }
    });
  };

  const registerMove = (currPos: Position, prevState: moveState) => {
    let currSquare = prevState.chessBoard[currPos.x][currPos.y];
    let capturedPiece: chessPieceNameType | null = null;
    if (currSquare.pieceColor !== null && currSquare.pieceName !== null) {
      capturedPiece = currSquare.pieceName;
    }
    if (prevState.selectedTile?.pieceName === "PAWN") {
      let pawnClass: ChessPiece = prevState.isWhiteTurn
        ? pieceNameToClassMapWhite["PAWN"]
        : pieceNameToClassMapBlack["PAWN"];
      if (
        pawnClass.isEnPassant !== undefined &&
        pawnClass.isEnPassant(
          {
            x: prevState.selectedTile.x,
            y: prevState.selectedTile.y,
          } as Position,
          currPos,
          prevState.allMoves[prevState.moveNumber - 1]
        )
      ) {
        capturedPiece = "PAWN";
      }
    }
    let allMoves: MoveInfo[] = JSON.parse(JSON.stringify(prevState.allMoves));
    let startPos: Position | null =
      prevState.selectedTile !== null
        ? { x: prevState.selectedTile.x, y: prevState.selectedTile.y }
        : null;
    let blackKingPos = prevState.blackKingPos;
    let whiteKingPos = prevState.whiteKingPos;
    if (prevState.selectedTile?.pieceName === "KING") {
      if (prevState.isWhiteTurn) {
        whiteKingPos = currPos;
      } else {
        blackKingPos = currPos;
      }
    }
    let modifiedPositions = updateBoard(
      prevState.selectedTile,
      currPos,
      prevState
    );
    allMoves.push({
      isWhiteTurn: prevState.isWhiteTurn,
      endPos: currPos,
      pieceCaptured: capturedPiece,
      pieceName:
        prevState.selectedTile?.pieceName === undefined
          ? null
          : prevState.selectedTile.pieceName,
      startPos: startPos,
    });
    let output = {
      ...prevState,
      allMoves: allMoves,
      availableMoves: [],
      isWhiteTurn: prevState.isWhiteTurn ? false : true,
      moveNumber: prevState.moveNumber + 1,
      selectedTile: null,
      chessBoard: modifiedPositions,
      blackKingPos: blackKingPos,
      whiteKingPos: whiteKingPos,
    } as moveState;
    let gameState: GameStates = prevState.gameState;
    if (prevState.isWhiteTurn) {
      let king: King = new King("BLACK");
      if (
        king.isKingCheck(output.blackKingPos, modifiedPositions).length > 0 &&
        movesToStopCheck(output).length === 0
      ) {
        gameState = GameStates.WHITE;
      }
    } else {
      let king: King = new King("WHITE");
      if (
        king.isKingCheck(output.whiteKingPos, modifiedPositions).length > 0 &&
        movesToStopCheck(output).length === 0
      ) {
        gameState = GameStates.BLACK;
      }
    }
    output = { ...output, gameState: gameState };
    return output;
  };

  return (
    <div className="chess-container">
      <Box sx={{ width: "50em", height: "50em", margin: "auto" }}>
        {getGrid(clickHandler)}
      </Box>
    </div>
  );
};

export default ChessComponent;
