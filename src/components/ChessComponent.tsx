import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { ChessTileProps, MemoChessTile } from "./ChessTile";
import "../Styles/ChessStyles.css";
import { Box, Grid } from "@mui/material";
import {
  allPieceColorType,
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
interface ChessComponentProps {}

export const enum ColorOptions {
  LIGHT,
  DARK,
  LIGHT_HIGHLIGHTED,
  DARK_HIGHLIGHTED,
  KING_CHECK_LIGHT,
}

interface moveState {
  chessBoard: SquareInfo[][];
  availableMoves: Position[];
  isWhiteTurn: boolean;
  allMoves: MoveInfo[];
  moveNumber: number;
  selectedTile: SquareInfo | null;
}
const ChessComponent: FunctionComponent<ChessComponentProps> = () => {
  const [moveState, setMoveState] = useState<moveState>({
    chessBoard: resetBoard(),
    availableMoves: [],
    isWhiteTurn: true,
    allMoves: [createEmptyMove()],
    moveNumber: 1,
    selectedTile: null,
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

  const clickHandler = (currPos: Position) => {
    let modifiedMoveState: moveState | null = null;
    if (moveState.isWhiteTurn) {
      if (moveState.availableMoves.length === 0) {
        let selectedSquare: SquareInfo =
          moveState.chessBoard[currPos.x][currPos.y];
        if (selectedSquare.pieceColor === "WHITE") {
          if (selectedSquare.pieceName !== null) {
            let pieceName: chessPieceNameType = selectedSquare.pieceName;
            let possibleMoves = pieceNameToClassMapWhite[
              pieceName
            ].availableMovements(currPos.x, currPos.y, moveState.chessBoard);

            modifiedMoveState = {
              ...moveState,
              availableMoves: possibleMoves !== undefined ? possibleMoves : [],
              selectedTile: selectedSquare,
            };
          }
        }
      } else {
        for (let pos of moveState.availableMoves) {
          if (pos.x === currPos.x && pos.y === currPos.y) {
            modifiedMoveState = registerMove(currPos);
          }
        }
      }
    } else {
      console.log("here");
      if (moveState.availableMoves.length === 0) {
        let selectedSquare: SquareInfo =
          moveState.chessBoard[currPos.x][currPos.y];
        if (selectedSquare.pieceColor === "BLACK") {
          if (selectedSquare.pieceName !== null) {
            let pieceName: chessPieceNameType = selectedSquare.pieceName;
            let possibleMoves = pieceNameToClassMapBlack[
              pieceName
            ].availableMovements(currPos.x, currPos.y, moveState.chessBoard);
            modifiedMoveState = {
              ...moveState,
              availableMoves: possibleMoves !== undefined ? possibleMoves : [],
              selectedTile: selectedSquare,
            };
          }
        }
      } else {
        for (let pos of moveState.availableMoves) {
          if (pos.x === currPos.x && pos.y === currPos.y) {
            modifiedMoveState = registerMove(currPos);
          }
        }
      }
    }
    console.log("difference", moveState, modifiedMoveState);
    if (modifiedMoveState !== null) {
      setMoveState(modifiedMoveState);
    }
  };

  const registerMove = (currPos: Position) => {
    let currSquare = moveState.chessBoard[currPos.x][currPos.y];
    let capturedPiece: chessPieceNameType | null = null;
    if (currSquare.pieceColor !== null && currSquare.pieceName !== null) {
      capturedPiece = currSquare.pieceName;
    }

    let modifiedPositions = JSON.parse(JSON.stringify(moveState.chessBoard));
    if (moveState.selectedTile !== null) {
      modifiedPositions[moveState.selectedTile.x][
        moveState.selectedTile.y
      ].pieceColor = null;
      modifiedPositions[moveState.selectedTile.x][
        moveState.selectedTile.y
      ].pieceName = null;
    }
    modifiedPositions[currPos.x][currPos.y].pieceColor =
      moveState.selectedTile?.pieceColor === undefined
        ? null
        : moveState.selectedTile.pieceColor;
    modifiedPositions[currPos.x][currPos.y].pieceName =
      moveState.selectedTile?.pieceName === undefined
        ? null
        : moveState.selectedTile.pieceName;
    let allMoves = JSON.parse(JSON.stringify(moveState.chessBoard));
    allMoves.push({
      isWhiteTurn: moveState.isWhiteTurn,
      endPos: currPos,
      pieceCaptured: capturedPiece,
      pieceName: moveState.selectedTile?.pieceName,
    });
    let output = {
      ...moveState,
      allMoves: allMoves,
      availableMoves: [],
      isWhiteTurn: moveState.isWhiteTurn ? false : true,
      moveNumber: moveState.moveNumber + 1,
      selectedTile: null,
      chessBoard: modifiedPositions,
    } as moveState;
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
