import { moveState, updateBoard } from "../components/ChessComponent";
import {
  allPieceColorType,
  ChessPiece,
  chessPieceNameType,
  getIconHelper,
  MoveInfo,
  Position,
  SquareInfo,
} from "./ChessModels";
import { King } from "./King";

export class Pawn implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName: string = "fas fa-chess-pawn fa-2x piece-style";
  pieceColor: allPieceColorType;
  king: King;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "PAWN";
    if (this.pieceColor === "WHITE") {
      this.king = new King("WHITE");
    } else {
      this.king = new King("BLACK");
    }
  }
  availableMovements(
    x: number,
    y: number,
    boardState: moveState,
    prevMove: MoveInfo
  ): Position[] {
    let output = [];
    if (this.pieceColor === "BLACK") {
      if (x - 1 >= 0 && boardState.chessBoard[x - 1][y].pieceName === null) {
        output.push({ x: x - 1, y: y });
      }
      if (
        x - 1 >= 0 &&
        y + 1 < 8 &&
        boardState.chessBoard[x - 1][y + 1].pieceName !== null &&
        boardState.chessBoard[x - 1][y + 1].pieceColor === "WHITE"
      ) {
        output.push({ x: x - 1, y: y + 1 });
      }
      if (
        x - 1 >= 0 &&
        y - 1 >= 0 &&
        boardState.chessBoard[x - 1][y - 1].pieceName !== null &&
        boardState.chessBoard[x - 1][y - 1].pieceColor === "WHITE"
      ) {
        output.push({ x: x - 1, y: y - 1 });
      }
      if (
        x === 6 &&
        boardState.chessBoard[x - 2][y].pieceColor === null &&
        boardState.chessBoard[x - 2][y].pieceName === null
      ) {
        output.push({ x: x - 2, y });
      }
      // enPassant rule
      if (this.isEnPassant({ x: x, y: y }, { x: x - 1, y: y - 1 }, prevMove)) {
        output.push({ x: x - 1, y: y - 1 });
      }
      if (this.isEnPassant({ x: x, y: y }, { x: x - 1, y: y + 1 }, prevMove)) {
        output.push({ x: x - 1, y: y + 1 });
      }
    } else {
      let front: Position = { x: x - 1, y: y };
      let diagonals: Position[] = [
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
      ];
      if (x + 1 < 8 && boardState.chessBoard[x + 1][y].pieceName === null) {
        output.push({ x: x + 1, y: y });
      }
      if (
        x + 1 < 8 &&
        y + 1 < 8 &&
        boardState.chessBoard[x + 1][y + 1].pieceName !== null &&
        boardState.chessBoard[x + 1][y + 1].pieceColor === "BLACK"
      ) {
        output.push({ x: x + 1, y: y + 1 });
      }
      if (
        x + 1 < 8 &&
        y - 1 >= 0 &&
        boardState.chessBoard[x + 1][y - 1].pieceName !== null &&
        boardState.chessBoard[x + 1][y - 1].pieceColor === "BLACK"
      ) {
        output.push({ x: x + 1, y: y - 1 });
      }
      if (
        x === 1 &&
        boardState.chessBoard[x + 2][y].pieceColor === null &&
        boardState.chessBoard[x + 2][y].pieceName === null
      ) {
        output.push({ x: x + 2, y });
      }
      if (this.isEnPassant({ x: x, y: y }, { x: x + 1, y: y - 1 }, prevMove)) {
        output.push({ x: x + 1, y: y - 1 });
      }
      if (this.isEnPassant({ x: x, y: y }, { x: x + 1, y: y + 1 }, prevMove)) {
        output.push({ x: x + 1, y: y + 1 });
      }
    }
    let modifiedOutput: Position[] = [];
    for (let i of output) {
      let modifiedBoard: SquareInfo[][] = updateBoard(
        { x: x, y: y, pieceColor: this.pieceColor, pieceName: "PAWN" },
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
  getIcon() {
    return getIconHelper(this.iconName, this.pieceColor);
  }
  isEnPassant(
    startPos: Position,
    currPos: Position,
    prevMove: MoveInfo
  ): boolean {
    if (this.pieceColor === "WHITE") {
      if (currPos.x - 1 === startPos.x && currPos.y + 1 === startPos.y) {
        if (prevMove.pieceName !== null && prevMove.pieceName === "PAWN") {
          if (
            prevMove.endPos !== null &&
            prevMove.startPos !== null &&
            prevMove.endPos.x === startPos.x &&
            startPos.y - prevMove.endPos.y === 1 &&
            prevMove.startPos.x - prevMove.endPos.x === 2
          ) {
            return true;
          }
        }
      } else if (currPos.x - 1 === startPos.x && currPos.y - 1 === startPos.y) {
        if (prevMove.pieceName !== null && prevMove.pieceName === "PAWN") {
          if (
            prevMove.endPos !== null &&
            prevMove.startPos !== null &&
            prevMove.endPos.x === startPos.x &&
            prevMove.endPos.y - startPos.y === 1 &&
            prevMove.startPos.x - prevMove.endPos.x === 2
          ) {
            return true;
          }
        }
      }
    } else {
      if (currPos.x + 1 === startPos.x && currPos.y + 1 === startPos.y) {
        if (prevMove.pieceName !== null && prevMove.pieceName === "PAWN") {
          if (
            prevMove.endPos !== null &&
            prevMove.startPos !== null &&
            prevMove.endPos.x === startPos.x &&
            startPos.y - prevMove.endPos.y === 1 &&
            prevMove.endPos.x - prevMove.startPos.x === 2
          ) {
            return true;
          }
        }
      } else if (currPos.x + 1 === startPos.x && currPos.y - 1 === startPos.y) {
        if (prevMove.pieceName !== null && prevMove.pieceName === "PAWN") {
          if (
            prevMove.endPos !== null &&
            prevMove.startPos !== null &&
            prevMove.endPos.x === startPos.x &&
            prevMove.endPos.y - startPos.y === 1 &&
            prevMove.endPos.x - prevMove.startPos.x === 2
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
