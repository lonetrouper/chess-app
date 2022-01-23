import { moveState, updateBoard } from "../components/ChessComponent";
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
  iconName = "fas fa-chess-king fa-3x";
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
            boardState.chessBoard[newPos.x][newPos.y] === null ||
            boardState.chessBoard[newPos.x][newPos.y].pieceColor !==
              this.pieceColor
          ) {
            output.push(newPos);
          }
        }
      }
    }
    let modifiedOutput: Position[] = [];
    for (let i of output) {
      let modifiedBoard: SquareInfo[][] = updateBoard(
        { x: x, y: y, pieceColor: this.pieceColor, pieceName: "KING" },
        i,
        boardState
      );
      if (this.isKingCheck(i, modifiedBoard).length === 0) {
        modifiedOutput.push(i);
      }
    }
    modifiedOutput.push(...this.getCastlingMoves(boardState));
    return modifiedOutput;
  }
  getCastlingMoves = (prevState: moveState): Position[] => {
    let output: Position[] = [];
    if (this.pieceColor === "WHITE") {
      if (!prevState.whiteKingHasMoved && !prevState.leftWhiteRookHasMoved) {
        if (
          prevState.chessBoard[0][4].pieceName === null &&
          prevState.chessBoard[0][5].pieceName === null &&
          prevState.chessBoard[0][6].pieceName === null
        ) {
          let kingPos: Position = prevState.whiteKingPos;
          let modifiedBoard: SquareInfo[][] = updateBoard(
            {
              ...kingPos,
              pieceColor: "WHITE",
              pieceName: "KING",
            } as SquareInfo,
            { x: kingPos.x, y: kingPos.y + 1 } as Position,
            prevState
          );
          let checks: Position[] = this.isKingCheck(
            { x: kingPos.x, y: kingPos.y + 1 },
            modifiedBoard
          );
          modifiedBoard = updateBoard(
            { ...kingPos, pieceColor: "WHITE", pieceName: "KING" },
            { x: kingPos.x, y: kingPos.y + 2 },
            prevState
          );
          checks.push(
            ...this.isKingCheck(
              { x: kingPos.x, y: kingPos.y + 2 },
              modifiedBoard
            )
          );
          modifiedBoard = updateBoard(
            { ...kingPos, pieceColor: "WHITE", pieceName: "KING" },
            { x: kingPos.x, y: kingPos.y + 3 },
            prevState
          );
          checks.push(
            ...this.isKingCheck(
              { x: kingPos.x, y: kingPos.y + 3 },
              modifiedBoard
            )
          );
          if (checks.length === 0) {
            output.push({ x: 0, y: 5 });
          }
        }
      }
      if (!prevState.whiteKingHasMoved && !prevState.rightWhiteRookHasMoved) {
        console.log("inside else if");
        if (
          prevState.chessBoard[0][1].pieceName === null &&
          prevState.chessBoard[0][2].pieceName === null
        ) {
          let kingPos: Position = prevState.whiteKingPos;
          let modifiedBoard: SquareInfo[][] = updateBoard(
            {
              ...kingPos,
              pieceColor: "WHITE",
              pieceName: "KING",
            } as SquareInfo,
            { x: kingPos.x, y: kingPos.y - 1 } as Position,
            prevState
          );
          let checks: Position[] = this.isKingCheck(
            { x: kingPos.x, y: kingPos.y - 1 },
            modifiedBoard
          );
          modifiedBoard = updateBoard(
            { ...kingPos, pieceColor: "WHITE", pieceName: "KING" },
            { x: kingPos.x, y: kingPos.y - 2 },
            prevState
          );
          checks.push(
            ...this.isKingCheck(
              { x: kingPos.x, y: kingPos.y - 2 },
              modifiedBoard
            )
          );
          console.log("castling checks", checks);
          if (checks.length === 0) {
            output.push({ x: 0, y: 1 });
          }
        }
      }
    } else {
      if (!prevState.blackKingHasMoved && !prevState.rightBlackRookHasMoved) {
        if (
          prevState.chessBoard[7][4].pieceName === null &&
          prevState.chessBoard[7][5].pieceName === null &&
          prevState.chessBoard[7][6].pieceName === null
        ) {
          let kingPos: Position = prevState.blackKingPos;
          let modifiedBoard: SquareInfo[][] = updateBoard(
            {
              ...kingPos,
              pieceColor: "BLACK",
              pieceName: "KING",
            } as SquareInfo,
            { x: kingPos.x, y: kingPos.y + 1 } as Position,
            prevState
          );
          let checks: Position[] = this.isKingCheck(
            { x: kingPos.x, y: kingPos.y + 1 },
            modifiedBoard
          );
          modifiedBoard = updateBoard(
            { ...kingPos, pieceColor: "BLACK", pieceName: "KING" },
            { x: kingPos.x, y: kingPos.y + 2 },
            prevState
          );
          checks.push(
            ...this.isKingCheck(
              { x: kingPos.x, y: kingPos.y + 2 },
              modifiedBoard
            )
          );
          modifiedBoard = updateBoard(
            { ...kingPos, pieceColor: "BLACK", pieceName: "KING" },
            { x: kingPos.x, y: kingPos.y + 3 },
            prevState
          );
          checks.push(
            ...this.isKingCheck(
              { x: kingPos.x, y: kingPos.y + 3 },
              modifiedBoard
            )
          );
          if (checks.length === 0) {
            output.push({ x: 7, y: 5 });
          }
        }
      }
      if (!prevState.blackKingHasMoved && !prevState.leftBlackRookHasMoved) {
        if (
          prevState.chessBoard[7][1].pieceName === null &&
          prevState.chessBoard[7][2].pieceName === null
        ) {
          let kingPos: Position = prevState.blackKingPos;
          let modifiedBoard: SquareInfo[][] = updateBoard(
            {
              ...kingPos,
              pieceColor: "BLACK",
              pieceName: "KING",
            } as SquareInfo,
            { x: kingPos.x, y: kingPos.y - 1 } as Position,
            prevState
          );
          let checks: Position[] = this.isKingCheck(
            { x: kingPos.x, y: kingPos.y - 1 },
            modifiedBoard
          );
          modifiedBoard = updateBoard(
            { ...kingPos, pieceColor: "BLACK", pieceName: "KING" },
            { x: kingPos.x, y: kingPos.y - 2 },
            prevState
          );
          checks.push(
            ...this.isKingCheck(
              { x: kingPos.x, y: kingPos.y - 2 },
              modifiedBoard
            )
          );
          console.log("castling checks", checks);
          if (checks.length === 0) {
            output.push({ x: 7, y: 1 });
          }
        }
      }
    }

    return output;
  };
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
    let xleft = kingPos.x - 1;
    let xright = kingPos.x + 1;
    let yleft = kingPos.y - 1;
    let yright = kingPos.y + 1;
    while (xleft >= 0) {
      if (
        (boardState[xleft][kingPos.y].pieceName === "ROOK" ||
          boardState[xleft][kingPos.y].pieceName === "QUEEN") &&
        boardState[xleft][kingPos.y].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[xleft][kingPos.y]);
        break;
      } else if (
        boardState[xleft][kingPos.y].pieceColor !== null &&
        boardState[xleft][kingPos.y].pieceName !== null
      ) {
        break;
      }
      xleft--;
    }
    while (xright < 8) {
      if (
        (boardState[xright][kingPos.y].pieceName === "ROOK" ||
          boardState[xright][kingPos.y].pieceName === "QUEEN") &&
        boardState[xright][kingPos.y].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[xright][kingPos.y]);
        break;
      } else if (
        boardState[xright][kingPos.y].pieceColor !== null &&
        boardState[xright][kingPos.y].pieceName !== null
      ) {
        break;
      }
      xright++;
    }
    while (yleft >= 0) {
      if (
        (boardState[kingPos.x][yleft].pieceName === "ROOK" ||
          boardState[kingPos.x][yleft].pieceName === "QUEEN") &&
        boardState[kingPos.x][yleft].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[kingPos.x][yleft]);
        break;
      } else if (
        boardState[kingPos.x][yleft].pieceColor !== null &&
        boardState[kingPos.x][yleft].pieceName !== null
      ) {
        break;
      }
      yleft--;
    }
    while (yright < 8) {
      if (boardState[kingPos.x][yright].pieceColor === this.pieceColor) break;
      else if (
        (boardState[kingPos.x][yright].pieceName === "ROOK" ||
          boardState[kingPos.x][yright].pieceName === "QUEEN") &&
        boardState[kingPos.x][yright].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[kingPos.x][yright]);
        break;
      }
      if (
        (boardState[kingPos.x][yright].pieceName === "ROOK" ||
          boardState[kingPos.x][yright].pieceName === "QUEEN") &&
        boardState[kingPos.x][yright].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[kingPos.x][yright]);
        break;
      } else if (
        boardState[kingPos.x][yright].pieceColor !== null &&
        boardState[kingPos.x][yright].pieceName !== null
      ) {
        break;
      }
      yright++;
    }
    return output;
  }
  bishopAndQueenChecks(kingPos: Position, boardState: SquareInfo[][]) {
    let output: SquareInfo[] = [];
    let currX = kingPos.x + 1;
    let currY = kingPos.y + 1;
    while (currX < 8 && currY < 8) {
      if (
        (boardState[currX][currY].pieceName === "BISHOP" ||
          boardState[currX][currY].pieceName === "QUEEN") &&
        boardState[currX][currY].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[currX][currY]);
        break;
      } else if (
        boardState[currX][currY].pieceColor !== null &&
        boardState[currX][currY].pieceName !== null
      )
        break;
      currX++;
      currY++;
    }
    currX = kingPos.x + 1;
    currY = kingPos.y - 1;
    while (currX < 8 && currY >= 0) {
      if (
        (boardState[currX][currY].pieceName === "BISHOP" ||
          boardState[currX][currY].pieceName === "QUEEN") &&
        boardState[currX][currY].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[currX][currY]);
        break;
      } else if (
        boardState[currX][currY].pieceColor !== null &&
        boardState[currX][currY].pieceName !== null
      )
        break;
      currX++;
      currY--;
    }
    currX = kingPos.x - 1;
    currY = kingPos.y + 1;
    while (currX >= 0 && currY < 8) {
      if (
        (boardState[currX][currY].pieceName === "BISHOP" ||
          boardState[currX][currY].pieceName === "QUEEN") &&
        boardState[currX][currY].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[currX][currY]);
        break;
      } else if (
        boardState[currX][currY].pieceColor !== null &&
        boardState[currX][currY].pieceName !== null
      )
        break;
      currX--;
      currY++;
    }
    currX = kingPos.x - 1;
    currY = kingPos.y - 1;
    while (currX >= 0 && currY >= 0) {
      if (
        (boardState[currX][currY].pieceName === "BISHOP" ||
          boardState[currX][currY].pieceName === "QUEEN") &&
        boardState[currX][currY].pieceColor !== this.pieceColor
      ) {
        output.push(boardState[currX][currY]);
        break;
      } else if (
        boardState[currX][currY].pieceColor !== null &&
        boardState[currX][currY].pieceName !== null
      )
        break;
      currX--;
      currY--;
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
