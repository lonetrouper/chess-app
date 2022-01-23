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

export class Rook implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName = "fas fa-chess-rook fa-3x";
  pieceColor: allPieceColorType;
  king: King;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "ROOK";
    this.king =
      this.pieceColor === "WHITE" ? new King("WHITE") : new King("BLACK");
  }
  availableMovements(x: number, y: number, boardState: moveState) {
    let output: Position[] = [];
    let direction = [1, -1];
    for (let i = 0; i < direction.length; i++) {
      let currX = x + direction[i];
      while (currX >= 0 && currX < 8) {
        let pos: Position = { x: currX, y };
        if (
          boardState.chessBoard[pos.x][pos.y].pieceColor === null &&
          boardState.chessBoard[pos.x][pos.y].pieceName === null
        ) {
          output.push(pos);
        } else if (
          boardState.chessBoard[pos.x][pos.y].pieceColor !== this.pieceColor
        ) {
          output.push(pos);
          break;
        } else break;
        currX += direction[i];
      }
      let currY = y + direction[i];
      while (currY >= 0 && currY < 8) {
        let pos: Position = { x, y: currY };
        currY += direction[i];
        if (
          boardState.chessBoard[pos.x][pos.y].pieceColor === null &&
          boardState.chessBoard[pos.x][pos.y].pieceName === null
        ) {
          output.push(pos);
        } else if (
          boardState.chessBoard[pos.x][pos.y].pieceColor !== this.pieceColor
        ) {
          output.push(pos);
          break;
        } else break;
      }
    }
    let modifiedOutput: Position[] = [];
    for (let i of output) {
      let modifiedBoard: SquareInfo[][] = updateBoard(
        { x: x, y: y, pieceColor: this.pieceColor, pieceName: "ROOK" },
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
}
