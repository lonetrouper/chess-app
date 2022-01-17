import { moveState } from "../components/ChessComponent";
import { Bishop } from "./Bishop";
import {
  allPieceColorType,
  ChessPiece,
  chessPieceNameType,
  getIconHelper,
  Position,
  SquareInfo,
} from "./ChessModels";
import { Knight } from "./Knight";
import { Pawn } from "./Pawn";
import { Queen } from "./Queen";
import { Rook } from "./Rook";

export class King implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName = "fas fa-chess-king fa-2x";
  pieceColor: allPieceColorType;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "KING";
  }
  availableMovements(x: number, y: number, boardState: moveState) {
    let output: Position[] = [];
    let directions = [1, 0, -1];
    for (let i = 0; i < directions.length; i++) {
      for (let j = 0; j < directions.length; j++) {
        if (directions[i] === 0 && directions[j] === 0) {
          continue;
        }
        if (
          x + directions[i] >= 0 &&
          x + directions[i] < 8 &&
          y + directions[j] >= 0 &&
          y + directions[j] < 8
        ) {
          let newPos: Position = { x: x + directions[i], y: y + directions[j] };
          if (
            (boardState.chessBoard[newPos.x][newPos.y] === null ||
              boardState.chessBoard[newPos.x][newPos.y].pieceColor !==
                this.pieceColor) &&
            this.isKingCheck(newPos, boardState.chessBoard).length === 0
          ) {
            output.push(newPos);
          }
        }
      }
    }
    return output;
  }
  isKingCheck = (
    kingPos: Position,
    boardState: SquareInfo[][]
  ): SquareInfo[] => {
    let output: SquareInfo[] = [];
    output.push(...this.pawnChecks(kingPos, boardState));
    output.push(...this.rookAndQueenChecks(kingPos, boardState));
    output.push(...this.bishopAndQueenChecks(kingPos, boardState));
    output.push(...this.knightChecks(kingPos, boardState));
    output.push(...this.opponentKingCheck(kingPos, boardState));

    return output;
  };
  pawnChecks(kingPos: Position, boardState: SquareInfo[][]) {
    let output: SquareInfo[] = [];
    let currX;
    let currY;
    if (this.pieceColor === "BLACK") {
      // PAWN check
      currX = kingPos.x - 1;
      currY = kingPos.y - 1;
      if (
        currX >= 0 &&
        currY >= 0 &&
        boardState[currX][currY].pieceName === "PAWN" &&
        boardState[currX][currY].pieceColor === "WHITE"
      ) {
        output.push(boardState[currX][currY]);
      }
      currX = kingPos.x - 1;
      currY = kingPos.y + 1;
      if (
        currX >= 0 &&
        currY < 8 &&
        (boardState[currX][currY].pieceName === "PAWN" ||
          boardState[currX][currY].pieceName === "KING") &&
        boardState[currX][currY].pieceColor === "WHITE"
      ) {
        output.push(boardState[currX][currY]);
      }
    } else {
      currX = kingPos.x + 1;
      currY = kingPos.y - 1;
      if (
        currX >= 0 &&
        currY >= 0 &&
        (boardState[currX][currY].pieceName === "PAWN" ||
          boardState[currX][currY].pieceName === "KING") &&
        boardState[currX][currY].pieceColor === "BLACK"
      ) {
        output.push(boardState[currX][currY]);
      }
      currX = kingPos.x + 1;
      currY = kingPos.y + 1;
      if (
        currX >= 0 &&
        currY < 8 &&
        boardState[currX][currY].pieceName === "PAWN" &&
        boardState[currX][currY].pieceColor === "BLACK"
      ) {
        output.push(boardState[currX][currY]);
      }
    }
    return output;
  }
  rookAndQueenChecks(kingPos: Position, boardState: SquareInfo[][]) {
    let currX = kingPos.x - 1;
    let currY = kingPos.y;
    let output: SquareInfo[] = [];
    for (let i = 0; i < 8; i++) {
      if (i === kingPos.x) continue;
      if (
        boardState[i][kingPos.y].pieceColor !== this.pieceColor &&
        boardState[i][kingPos.y].pieceName === "ROOK"
      ) {
        output.push(boardState[i][kingPos.y]);
      }
    }
    while (currX >= 0) {
      if (boardState[currX][currY].pieceColor === this.pieceColor) break;
      if (
        (boardState[currX][currY].pieceName === "ROOK" ||
          boardState[currX][currY].pieceName === "QUEEN") &&
        boardState[currX][currY].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[currX][currY]);
        break;
      }
      currX--;
    }
    currX = kingPos.x + 1;
    while (currX < 8) {
      if (boardState[currX][currY].pieceColor === this.pieceColor) break;
      if (
        (boardState[currX][currY].pieceName === "ROOK" ||
          boardState[currX][currY].pieceName === "QUEEN") &&
        boardState[currX][currY].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[currX][currY]);
        break;
      }
      currX++;
    }
    return output;
  }
  bishopAndQueenChecks(kingPos: Position, boardState: SquareInfo[][]) {
    let output: SquareInfo[] = [];
    let currX;
    let currY;
    let diagonals = [1, -1];
    for (let i of diagonals) {
      for (let j of diagonals) {
        currX = kingPos.x + i;
        currY = kingPos.y + j;
        while (currX >= 0 && currX < 8 && currY >= 0 && currY < 8) {
          if (boardState[currX][currY].pieceColor === this.pieceColor) break;
          if (
            (boardState[currX][currY].pieceName === "BISHOP" ||
              boardState[currX][currY].pieceName === "QUEEN") &&
            boardState[currX][currY].pieceColor !== this.pieceColor
          ) {
            output.push(boardState[currX][currY]);
            break;
          }
          currX += i;
          currY += j;
        }
      }
    }
    return output;
  }
  knightChecks(kingPos: Position, boardState: SquareInfo[][]) {
    let majorDirection = [2, -2];
    let minorDirection = [1, -1];
    let currX1;
    let currY1;
    let currX2;
    let currY2;
    let output: SquareInfo[] = [];
    for (let i of majorDirection) {
      for (let j of minorDirection) {
        currX1 = kingPos.x + i;
        currY1 = kingPos.y + j;
        currX2 = kingPos.x + j;
        currY2 = kingPos.y + i;
        if (currX1 >= 0 && currX1 < 8 && currY1 >= 0 && currY1 < 8) {
          if (
            boardState[currX1][currY1].pieceName === "KNIGHT" &&
            boardState[currX1][currY1].pieceColor !== this.pieceColor
          ) {
            output.push(boardState[currX1][currY1]);
          }
        }
        if (currX2 >= 0 && currX2 < 8 && currY2 >= 0 && currY2 < 8) {
          if (
            boardState[currX2][currY2].pieceName === "KNIGHT" &&
            boardState[currX2][currY2].pieceColor !== this.pieceColor
          ) {
            output.push(boardState[currX2][currY1]);
          }
        }
      }
    }
    return output;
  }
  opponentKingCheck(kingPos: Position, boardState: SquareInfo[][]) {
    let directions = [-1, 0, 1];
    let currX;
    let currY;
    let output: SquareInfo[] = [];
    for (let i of directions) {
      currX = kingPos.x + i;
      for (let j of directions) {
        currY = kingPos.y + j;
        if (i === 0 && j === 0) continue;
        if (
          currX >= 0 &&
          currX < 8 &&
          currY >= 0 &&
          currY < 8 &&
          boardState[currX][currY].pieceName === "KING" &&
          boardState[currX][currY].pieceColor !== this.pieceColor
        ) {
          output.push(boardState[currX][currY]);
        }
      }
    }
    return output;
  }
  getIcon() {
    return getIconHelper(this.iconName, this.pieceColor);
  }
}
