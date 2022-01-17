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

export class Bishop implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName = "fas fa-chess-bishop fa-2x";
  pieceColor: allPieceColorType;
  king: King;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "BISHOP";
    this.king =
      this.pieceColor === "WHITE" ? new King("WHITE") : new King("BLACK");
  }
  availableMovements(
    x: number,
    y: number,
    boardState: moveState,
    prevMove?: MoveInfo
  ) {
    let output: Position[] = [];
    const rowDirection: Array<number> = [1, -1];
    const colDirection: Array<number> = [1, -1];
    for (let i = 0; i < rowDirection.length; i++) {
      for (let j = 0; j < colDirection.length; j++) {
        let tempX = x + rowDirection[i];
        let tempY = y + colDirection[j];
        while (tempX >= 0 && tempX < 8 && tempY >= 0 && tempY < 8) {
          let pos: Position = { x: tempX, y: tempY };
          if (
            boardState.chessBoard[tempX][tempY].pieceColor === null &&
            boardState.chessBoard[tempX][tempY].pieceName === null
          ) {
            output.push(pos);
          } else if (
            boardState.chessBoard[tempX][tempY].pieceColor !== this.pieceColor
          ) {
            output.push(pos);
            break;
          } else {
            break;
          }
          tempX += rowDirection[i];
          tempY += colDirection[j];
        }
      }
    }
    let modifiedOutput: Position[] = [];
    for (let i of output) {
      let modifiedBoard: SquareInfo[][] = updateBoard(
        { x: x, y: y, pieceColor: this.pieceColor, pieceName: "BISHOP" },
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
