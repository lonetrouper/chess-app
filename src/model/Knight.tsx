import { moveState, updateBoard } from "../components/ChessComponent";
import {
  allPieceColorType,
  ChessPiece,
  chessPieceNameType,
  getIconHelper,
  Position,
  SquareInfo,
} from "./ChessModels";
import { King } from "./King";

export class Knight implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName = "fas fa-chess-knight fa-3x";
  pieceColor: allPieceColorType;
  king: King;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "KNIGHT";
    if (this.pieceColor === "WHITE") {
      this.king = new King("WHITE");
    } else {
      this.king = new King("BLACK");
    }
  }
  availableMovements(x: number, y: number, boardState: moveState) {
    let output: Position[] = [];
    let majorMovement = [-2, 2];
    let minorMovement = [1, -1];
    if (this.pieceColor === "WHITE") {
      output.push(
        ...this.getMovementHelper(
          majorMovement,
          minorMovement,
          x,
          y,
          boardState.chessBoard
        )
      );
      output.push(
        ...this.getMovementHelper(
          minorMovement,
          majorMovement,
          x,
          y,
          boardState.chessBoard
        )
      );
    } else {
      output.push(
        ...this.getMovementHelper(
          majorMovement,
          minorMovement,
          x,
          y,
          boardState.chessBoard
        )
      );
      output.push(
        ...this.getMovementHelper(
          minorMovement,
          majorMovement,
          x,
          y,
          boardState.chessBoard
        )
      );
    }
    let modifiedOutput: Position[] = [];
    for (let i of output) {
      let modifiedBoard: SquareInfo[][] = updateBoard(
        { x: x, y: y, pieceColor: this.pieceColor, pieceName: "KNIGHT" },
        i,
        boardState
      );
      if (
        this.king.isKingCheck(
          boardState.isWhiteTurn
            ? boardState.whiteKingPos
            : boardState.blackKingPos,
          modifiedBoard
        ).length === 0
      ) {
        modifiedOutput.push(i);
      }
    }
    return modifiedOutput;
  }

  getMovementHelper(
    majorMovement: number[],
    minorMovement: number[],
    x: number,
    y: number,
    boardState: SquareInfo[][]
  ): Position[] {
    let output: Position[] = [];
    for (let i = 0; i < minorMovement.length; i++) {
      for (let j = 0; j < majorMovement.length; j++) {
        if (
          x + minorMovement[i] >= 0 &&
          x + minorMovement[i] < 8 &&
          y + majorMovement[j] >= 0 &&
          y + majorMovement[j] < 8
        ) {
          let currX = x + minorMovement[i];
          let currY = y + majorMovement[j];
          let currPos = { x: currX, y: currY };
          if (
            boardState[currX][currY].pieceName === null &&
            boardState[currX][currY].pieceColor === null
          ) {
            output.push(currPos);
          } else if (boardState[currX][currY].pieceColor !== this.pieceColor) {
            output.push(currPos);
          }
        }
      }
    }
    return output;
  }
  getIcon() {
    return getIconHelper(this.iconName, this.pieceColor);
  }
}
