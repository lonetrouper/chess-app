import { moveState, updateBoard } from "../components/ChessComponent";
import { Bishop } from "./Bishop";
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
import { Rook } from "./Rook";

export class Queen implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName = "fas fa-chess-queen fa-3x";
  pieceColor: allPieceColorType;
  rook: ChessPiece;
  bishop: ChessPiece;
  king: King;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "QUEEN";
    if (pieceColor === "WHITE") {
      this.rook = new Rook("WHITE");
      this.bishop = new Bishop("WHITE");
      this.king = new King("WHITE");
    } else {
      this.rook = new Rook("BLACK");
      this.bishop = new Bishop("BLACK");
      this.king = new King("BLACK");
    }
  }
  availableMovements(
    x: number,
    y: number,
    boardState: moveState,
    prevMove?: MoveInfo
  ) {
    let output: Position[] = [];
    output.push(...this.bishop.availableMovements(x, y, boardState));
    output.push(...this.rook.availableMovements(x, y, boardState));
    let modifiedOutput: Position[] = [];
    for (let i of output) {
      let modifiedBoard: SquareInfo[][] = updateBoard(
        { x: x, y: y, pieceColor: this.pieceColor, pieceName: "QUEEN" },
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
