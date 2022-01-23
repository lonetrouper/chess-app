import { FunctionComponent, useState } from "react";
import ChessTile, { ChessTileProps, MemoChessTile } from "./ChessTile";
import "../Styles/ChessStyles.css";
import { Box, Button, Grid } from "@mui/material";
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
import { King } from "../model/King";
import { OutputFileType } from "typescript";
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
  leftWhiteRookHasMoved: boolean;
  rightWhiteRookHasMoved: boolean;
  leftBlackRookHasMoved: boolean;
  rightBlackRookHasMoved: boolean;
  blackKingHasMoved: boolean;
  whiteKingHasMoved: boolean;
  isPromotion: boolean;
  promotionSquare: Position | null;
  allPreviousStates: string[];
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
    blackKingHasMoved: false,
    whiteKingHasMoved: false,
    leftBlackRookHasMoved: false,
    rightBlackRookHasMoved: false,
    leftWhiteRookHasMoved: false,
    rightWhiteRookHasMoved: false,
    isPromotion: false,
    promotionSquare: null,
    allPreviousStates: [],
  });

  const getTile = (
    squareInfo: SquareInfo,
    availableMoves: Position[],
    isPromotion: boolean,
    promotionSquare: Position | null,
    clickHandler: (pos: Position) => void
  ) => {
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
      isPromotion: isPromotion,
      promotionSquare: promotionSquare,
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
          moveState.isPromotion,
          moveState.promotionSquare,
          clickHandler
        );
        colOutput.push(
          <Grid
            item
            sx={{ flexGrow: "1", margin: "auto" }}
            key={"ChessComponent" + i + j}
          >
            <ChessTile {...chessTileProps}></ChessTile>
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
      if (prevState.isPromotion) {
        let modifiedBoard: SquareInfo[][] = JSON.parse(
          JSON.stringify(prevState.chessBoard)
        );
        let isPromotion: boolean = prevState.isPromotion;
        let promotionSquare = prevState.promotionSquare;
        if (
          prevState.promotionSquare !== null &&
          prevState.promotionSquare.x === 7 &&
          currPos.y === prevState.promotionSquare.y
        ) {
          let difference = 7 - currPos.x;
          if (difference === 0) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "WHITE",
              pieceName: "QUEEN",
            };
            isPromotion = false;
            promotionSquare = null;
          } else if (difference === 1) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "WHITE",
              pieceName: "ROOK",
            };
            isPromotion = false;
            promotionSquare = null;
          } else if (difference === 2) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "WHITE",
              pieceName: "BISHOP",
            };
            isPromotion = false;
            promotionSquare = null;
          } else if (difference === 3) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "WHITE",
              pieceName: "KNIGHT",
            };
            isPromotion = false;
            promotionSquare = null;
          }
        } else if (
          prevState.promotionSquare !== null &&
          prevState.promotionSquare.x === 0 &&
          currPos.y === prevState.promotionSquare.y
        ) {
          let difference = currPos.x - 0;
          if (difference === 0) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "BLACK",
              pieceName: "QUEEN",
            };
            isPromotion = false;
            promotionSquare = null;
          } else if (difference === 1) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "BLACK",
              pieceName: "ROOK",
            };
            isPromotion = false;
            promotionSquare = null;
          } else if (difference === 2) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "BLACK",
              pieceName: "BISHOP",
            };
            isPromotion = false;
            promotionSquare = null;
          } else if (difference === 3) {
            modifiedBoard[prevState.promotionSquare.x][
              prevState.promotionSquare.y
            ] = {
              x: prevState.promotionSquare.x,
              y: prevState.promotionSquare.y,
              pieceColor: "BLACK",
              pieceName: "KNIGHT",
            };
            isPromotion = false;
            promotionSquare = null;
          }
        }
        return {
          ...prevState,
          chessBoard: modifiedBoard,
          isPromotion: isPromotion,
          promotionSquare: promotionSquare,
        };
      }
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
    let blackKingHasMoved: boolean = prevState.blackKingHasMoved;
    let whiteKingHasMoved: boolean = prevState.whiteKingHasMoved;
    let leftWhiteRookHasMoved: boolean = prevState.leftWhiteRookHasMoved;
    let rightWhiteRookHasMoved: boolean = prevState.rightWhiteRookHasMoved;
    let leftBlackRookHasMoved: boolean = prevState.leftBlackRookHasMoved;
    let rightBlackRookHasMoved: boolean = prevState.rightBlackRookHasMoved;

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
    let modifiedPositions: SquareInfo[][];
    if (
      prevState.selectedTile?.pieceName === "KING" &&
      prevState.selectedTile.pieceColor === "WHITE"
    ) {
      if (currPos.y - prevState.selectedTile.y === 2) {
        modifiedPositions = updateBoard(
          prevState.selectedTile,
          currPos,
          prevState
        );
        modifiedPositions = updateBoard(
          { x: 0, y: 7, pieceColor: "WHITE", pieceName: "ROOK" },
          { x: 0, y: 4 },
          { ...prevState, chessBoard: modifiedPositions }
        );
      } else if (currPos.y - prevState.selectedTile.y === -2) {
        modifiedPositions = updateBoard(
          prevState.selectedTile,
          currPos,
          prevState
        );
        modifiedPositions = updateBoard(
          { x: 0, y: 0, pieceColor: "WHITE", pieceName: "ROOK" },
          { x: 0, y: 2 },
          { ...prevState, chessBoard: modifiedPositions }
        );
      } else {
        modifiedPositions = updateBoard(
          prevState.selectedTile,
          currPos,
          prevState
        );
      }
    } else if (
      prevState.selectedTile?.pieceName === "KING" &&
      prevState.selectedTile.pieceColor === "BLACK"
    ) {
      if (currPos.y - prevState.selectedTile.y === 2) {
        modifiedPositions = updateBoard(
          prevState.selectedTile,
          currPos,
          prevState
        );
        modifiedPositions = updateBoard(
          { x: 7, y: 7, pieceColor: "BLACK", pieceName: "ROOK" },
          { x: 7, y: 4 },
          { ...prevState, chessBoard: modifiedPositions }
        );
      } else if (currPos.y - prevState.selectedTile.y === -2) {
        modifiedPositions = updateBoard(
          prevState.selectedTile,
          currPos,
          prevState
        );
        modifiedPositions = updateBoard(
          { x: 7, y: 0, pieceColor: "BLACK", pieceName: "ROOK" },
          { x: 7, y: 2 },
          { ...prevState, chessBoard: modifiedPositions }
        );
      } else {
        modifiedPositions = updateBoard(
          prevState.selectedTile,
          currPos,
          prevState
        );
      }
    } else {
      modifiedPositions = updateBoard(
        prevState.selectedTile,
        currPos,
        prevState
      );
    }

    if (
      prevState.selectedTile?.pieceColor === "WHITE" &&
      prevState.selectedTile.pieceName === "KING"
    ) {
      whiteKingHasMoved = true;
    }
    if (
      prevState.selectedTile?.pieceColor === "BLACK" &&
      prevState.selectedTile.pieceName === "KING"
    ) {
      blackKingHasMoved = true;
    }

    if (
      prevState.selectedTile?.pieceName === "ROOK" &&
      prevState.selectedTile.pieceColor === "WHITE" &&
      prevState.selectedTile.x === 0 &&
      prevState.selectedTile.y === 0
    ) {
      rightWhiteRookHasMoved = true;
    }

    if (
      prevState.selectedTile?.pieceName === "ROOK" &&
      prevState.selectedTile.pieceColor === "WHITE" &&
      prevState.selectedTile.x === 0 &&
      prevState.selectedTile.y === 7
    ) {
      leftWhiteRookHasMoved = true;
    }
    if (
      prevState.selectedTile?.pieceName === "ROOK" &&
      prevState.selectedTile.pieceColor === "BLACK" &&
      prevState.selectedTile.x === 7 &&
      prevState.selectedTile.y === 7
    ) {
      rightBlackRookHasMoved = true;
    }
    if (
      prevState.selectedTile?.pieceName === "ROOK" &&
      prevState.selectedTile.pieceColor === "BLACK" &&
      prevState.selectedTile.x === 7 &&
      prevState.selectedTile.y === 0
    ) {
      leftBlackRookHasMoved = true;
    }
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
    let isPromotion = prevState.isPromotion;
    let promotionSquare = prevState.promotionSquare;
    if (
      prevState.isWhiteTurn &&
      prevState.selectedTile?.pieceName === "PAWN" &&
      currPos.x === 7
    ) {
      isPromotion = true;
      promotionSquare = {
        x: currPos.x,
        y: currPos.y,
      };
    } else if (
      !prevState.isWhiteTurn &&
      prevState.selectedTile?.pieceName === "PAWN" &&
      currPos.x === 0
    ) {
      isPromotion = true;
      promotionSquare = {
        x: currPos.x,
        y: currPos.y,
      };
    }
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
      blackKingHasMoved: blackKingHasMoved,
      whiteKingHasMoved: whiteKingHasMoved,
      leftBlackRookHasMoved: leftBlackRookHasMoved,
      rightBlackRookHasMoved: rightBlackRookHasMoved,
      leftWhiteRookHasMoved: leftWhiteRookHasMoved,
      rightWhiteRookHasMoved: rightWhiteRookHasMoved,
      isPromotion: isPromotion,
      promotionSquare: promotionSquare,
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
    let previousMove = {
      allMoves: prevState.allMoves,
      availableMoves: [],
      blackKingHasMoved: prevState.blackKingHasMoved,
      blackKingPos: prevState.blackKingPos,
      chessBoard: prevState.chessBoard,
      gameState: prevState.gameState,
      isPromotion: prevState.isPromotion,
      isWhiteTurn: prevState.isWhiteTurn,
      leftBlackRookHasMoved: prevState.leftBlackRookHasMoved,
      leftWhiteRookHasMoved: prevState.leftWhiteRookHasMoved,
      moveNumber: prevState.moveNumber,
      promotionSquare: prevState.promotionSquare,
      rightBlackRookHasMoved: prevState.rightBlackRookHasMoved,
      rightWhiteRookHasMoved: prevState.rightWhiteRookHasMoved,
      selectedTile: null,
      whiteKingHasMoved: prevState.whiteKingHasMoved,
      whiteKingPos: prevState.whiteKingPos,
    };
    let allPreviousStates = JSON.parse(
      JSON.stringify(prevState.allPreviousStates)
    );
    allPreviousStates[prevState.moveNumber - 1] = JSON.stringify(previousMove);
    output = {
      ...output,
      gameState: gameState,
      allPreviousStates: allPreviousStates,
    };
    return output;
  };

  const getWinner = () => {
    if (moveState.gameState === GameStates.WHITE) {
      return "White wins";
    } else if (moveState.gameState === GameStates.BLACK) {
      return "Black wins";
    }
  };

  const prevMove = () => {
    setMoveState((prevState) => {
      if (prevState.moveNumber > 1) {
        let output = { ...prevState };
        if (prevState.moveNumber - 1 === prevState.allPreviousStates.length) {
          let currMove = {
            allMoves: prevState.allMoves,
            availableMoves: [],
            blackKingHasMoved: prevState.blackKingHasMoved,
            blackKingPos: prevState.blackKingPos,
            chessBoard: prevState.chessBoard,
            gameState: prevState.gameState,
            isPromotion: prevState.isPromotion,
            isWhiteTurn: prevState.isWhiteTurn,
            leftBlackRookHasMoved: prevState.leftBlackRookHasMoved,
            leftWhiteRookHasMoved: prevState.leftWhiteRookHasMoved,
            moveNumber: prevState.moveNumber,
            promotionSquare: prevState.promotionSquare,
            rightBlackRookHasMoved: prevState.rightBlackRookHasMoved,
            rightWhiteRookHasMoved: prevState.rightWhiteRookHasMoved,
            selectedTile: null,
            whiteKingHasMoved: prevState.whiteKingHasMoved,
            whiteKingPos: prevState.whiteKingPos,
          };
          output.allPreviousStates = [
            ...output.allPreviousStates,
            JSON.stringify(currMove),
          ];
        }

        let prevMove = JSON.parse(
          prevState.allPreviousStates[prevState.moveNumber - 2]
        );
        output = { ...output, ...prevMove };

        return output;
      } else {
        return prevState;
      }
    });
  };

  const nextMove = () => {
    setMoveState((prevState) => {
      if (prevState.moveNumber < prevState.allPreviousStates.length) {
        let nextState = JSON.parse(
          prevState.allPreviousStates[prevState.moveNumber]
        );
        return { ...prevState, ...nextState };
      } else {
        return prevState;
      }
    });
  };

  const resetState = () => {
    let freshState: moveState = {
      chessBoard: resetBoard(),
      availableMoves: [],
      isWhiteTurn: true,
      allMoves: [createEmptyMove()],
      moveNumber: 1,
      selectedTile: null,
      whiteKingPos: { x: 0, y: 3 } as Position,
      blackKingPos: { x: 7, y: 3 } as Position,
      gameState: GameStates.RUNNING,
      blackKingHasMoved: false,
      whiteKingHasMoved: false,
      leftBlackRookHasMoved: false,
      rightBlackRookHasMoved: false,
      leftWhiteRookHasMoved: false,
      rightWhiteRookHasMoved: false,
      isPromotion: false,
      promotionSquare: null,
      allPreviousStates: [],
    };
    setMoveState(freshState);
  };

  return (
    <div className="chess-container">
      <Box sx={{ width: "50em", height: "50em", margin: "auto" }}>
        {getGrid(clickHandler)}
        <div className="button-container-outer">
          <div className="button-container-inner">
            <div className="icon-holder">
              <i
                className="fa fa-refresh fa-2x"
                aria-hidden="true"
                onClick={resetState}
              ></i>
            </div>
            <div className="icon-holder" onClick={prevMove}>
              <i className="fa fa-arrow-left fa-2x" aria-hidden="true"></i>
            </div>
            <div className="icon-holder" onClick={nextMove}>
              <i className="fa fa-arrow-right fa-2x" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ChessComponent;
