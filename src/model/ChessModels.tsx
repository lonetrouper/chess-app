import { HashMap, HashSet } from "./CustomDataStructures";

export const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];

const chessPieceName = ["PAWN", "ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING"];
export type chessPieceNameType = typeof chessPieceName[number];

const allPieceColors = ["BLACK", "WHITE"];
export type allPieceColorType = typeof allPieceColors[number];

export interface ChessPiece {
  pieceName: chessPieceNameType;
  iconName: string;
  pieceColor: allPieceColorType;
  availableMovements(
    x: number,
    y: number,
    boardState: SquareInfo[][],
    prevMove?: any
  ): Position[];
  getIcon: () => string;
}

export interface Position {
  x: number;
  y: number;
}

const getIconHelper = (iconName: string, pieceColor: allPieceColorType) => {
  if (pieceColor === "BLACK") {
    return iconName + " black";
  }
  return iconName + " white";
};

class Pawn implements ChessPiece {
  pieceName: chessPieceNameType;
  iconName: string = "fas fa-chess-pawn fa-2x piece-style";
  pieceColor: allPieceColorType;
  constructor(pieceColor: allPieceColorType) {
    this.pieceColor = pieceColor;
    this.pieceName = "PAWN";
  }
  availableMovements(x: number, y: number, boardState: SquareInfo[][]) {
    let output = [];
    if (this.pieceColor === "BLACK") {
      let front: Position = { x: x - 1, y: y };
      let diagonals: Position[] = [
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
      ];
      if (x - 1 >= 0 && boardState[x - 1][y].pieceName === null) {
        output.push({ x: x - 1, y: y });
      }
      if (
        x - 1 >= 0 &&
        y + 1 < 8 &&
        boardState[x - 1][y + 1].pieceName !== null &&
        boardState[x - 1][y + 1].pieceColor === "WHITE"
      ) {
        output.push({ x: x - 1, y: y + 1 });
      }
      if (
        x - 1 >= 0 &&
        y - 1 >= 0 &&
        boardState[x - 1][y - 1].pieceName !== null &&
        boardState[x - 1][y - 1].pieceColor === "WHITE"
      ) {
        output.push({ x: x - 1, y: y + 1 });
      }
      if (
        x === 6 &&
        boardState[x - 2][y].pieceColor === null &&
        boardState[x - 2][y].pieceName === null
      ) {
        output.push({ x: x - 2, y });
      }
    } else {
      let front: Position = { x: x - 1, y: y };
      let diagonals: Position[] = [
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
      ];
      if (x + 1 < 8 && boardState[x + 1][y].pieceName === null) {
        output.push({ x: x + 1, y: y });
      }
      if (
        x + 1 < 8 &&
        y + 1 < 8 &&
        boardState[x + 1][y + 1].pieceName !== null &&
        boardState[x + 1][y + 1].pieceColor === "BLACK"
      ) {
        output.push({ x: x + 1, y: y + 1 });
      }
      if (
        x + 1 < 8 &&
        y - 1 >= 0 &&
        boardState[x + 1][y - 1].pieceName !== null &&
        boardState[x + 1][y - 1].pieceColor === "BLACK"
      ) {
        output.push({ x: x + 1, y: y - 1 });
      }
      if (
        x === 1 &&
        boardState[x + 2][y].pieceColor === null &&
        boardState[x + 2][y].pieceName === null
      ) {
        output.push({ x: x + 2, y });
      }
    }
    return output;
  }
  getIcon() {
    return getIconHelper(this.iconName, this.pieceColor);
  }
}

// class Knight implements ChessPiece {
//   pieceName: chessPieceNameType;
//   iconName = "fas fa-chess-knight fa-2x";
//   pieceColor: allPieceColorType;
//   constructor(pieceColor: allPieceColorType) {
//     this.pieceColor = pieceColor;
//     this.pieceName = "KNIGHT";
//   }
//   availableMovements(
//     x: number,
//     y: number,
//     occupiedPositionsWhite: HashMap<Position, chessPieceNameType>,
//     occupiedPositionsBlack: HashMap<Position, chessPieceNameType>
//   ) {
//     let output: Position[] = [];
//     let majorMovement = [-2, 2];
//     let minorMovement = [1, -1];
//     if (this.pieceColor === "WHITE") {
//       output.push(
//         ...this.getMovementHelper(
//           majorMovement,
//           minorMovement,
//           x,
//           y,
//           occupiedPositionsWhite
//         )
//       );
//       output.push(
//         ...this.getMovementHelper(
//           minorMovement,
//           majorMovement,
//           x,
//           y,
//           occupiedPositionsWhite
//         )
//       );
//     } else {
//       output.push(
//         ...this.getMovementHelper(
//           majorMovement,
//           minorMovement,
//           x,
//           y,
//           occupiedPositionsBlack
//         )
//       );
//       output.push(
//         ...this.getMovementHelper(
//           minorMovement,
//           majorMovement,
//           x,
//           y,
//           occupiedPositionsBlack
//         )
//       );
//     }
//     return output;
//   }

//   getMovementHelper(
//     majorMovement: number[],
//     minorMovement: number[],
//     x: number,
//     y: number,
//     opponentOccupiedPositions: HashMap<Position, chessPieceNameType>
//   ): Position[] {
//     let output: Position[] = [];
//     for (let i = 0; i < minorMovement.length; i++) {
//       for (let j = 0; j < majorMovement.length; j++) {
//         if (
//           x + minorMovement[i] >= 0 &&
//           x + minorMovement[i] < 8 &&
//           y + majorMovement[j] >= 0 &&
//           y + majorMovement[j] < 8
//         ) {
//           let pos: Position = {
//             x: x + minorMovement[i],
//             y: y + majorMovement[j],
//           };
//           if (!opponentOccupiedPositions.has(pos)) output.push(pos);
//         }
//       }
//     }
//     return output;
//   }
//   getIcon() {
//     return getIconHelper(this.iconName, this.pieceColor);
//   }
// }

// class Rook implements ChessPiece {
//   pieceName: chessPieceNameType;
//   iconName = "fas fa-chess-rook fa-2x";
//   pieceColor: allPieceColorType;
//   constructor(pieceColor: allPieceColorType) {
//     this.pieceColor = pieceColor;
//     this.pieceName = "ROOK";
//   }
//   availableMovements(
//     x: number,
//     y: number,
//     occupiedPositionsWhite: HashMap<Position, chessPieceNameType>,
//     occupiedPositionsBlack: HashMap<Position, chessPieceNameType>
//   ) {
//     let output: Position[] = [];
//     let direction = [1, -1];
//     if (this.pieceColor === "WHITE") {
//       for (let i = 0; i < direction.length; i++) {
//         let currX = x + direction[i];
//         while (currX >= 0 && currX < 8) {
//           let pos: Position = { x: currX, y };
//           if (!occupiedPositionsWhite.has(pos)) {
//             output.push(pos);
//             if (occupiedPositionsBlack.has(pos)) break;
//           } else break;
//           currX += direction[i];
//         }
//         let currY = y + direction[i];
//         while ((currY = 0 && currY < 8)) {
//           let pos: Position = { x, y: currY };
//           if (!occupiedPositionsWhite.has(pos)) {
//             output.push(pos);
//             if (occupiedPositionsBlack.has(pos)) break;
//           } else break;
//           currY += direction[i];
//         }
//       }
//     } else {
//       for (let i = 0; i < direction.length; i++) {
//         let currX = x + direction[i];
//         while (currX >= 0 && currX < 8) {
//           let pos: Position = { x: currX, y };
//           if (!occupiedPositionsBlack.has(pos)) {
//             output.push(pos);
//             if (occupiedPositionsWhite.has(pos)) break;
//           }
//           currX += direction[i];
//         }
//         let currY = y + direction[i];
//         while ((currY = 0 && currY < 8)) {
//           let pos: Position = { x, y: currY };
//           if (!occupiedPositionsBlack.has(pos)) {
//             output.push(pos);
//             if (occupiedPositionsWhite.has(pos)) break;
//           }
//           currY += direction[i];
//         }
//       }
//     }
//     return output;
//   }
//   getIcon() {
//     return getIconHelper(this.iconName, this.pieceColor);
//   }
// }

// class Bishop implements ChessPiece {
//   pieceName: chessPieceNameType;
//   iconName = "fas fa-chess-bishop fa-2x";
//   pieceColor: allPieceColorType;
//   constructor(pieceColor: allPieceColorType) {
//     this.pieceColor = pieceColor;
//     this.pieceName = "BISHOP";
//   }
//   availableMovements(
//     x: number,
//     y: number,
//     occupiedPositionsWhite: HashMap<Position, chessPieceNameType>,
//     occupiedPositionsBlack: HashMap<Position, chessPieceNameType>
//   ) {
//     let output: Position[] = [];
//     const rowDirection: Array<number> = [1, -1];
//     const colDirection: Array<number> = [1, -1];
//     for (let i = 0; i < rowDirection.length; i++) {
//       for (let j = 0; j < colDirection.length; j++) {
//         let tempX = x + rowDirection[i];
//         let tempY = y + colDirection[j];
//         while (tempX >= 0 && tempX < 8 && tempY >= 0 && tempY < 8) {
//           let pos: Position = { x: tempX, y: tempY };
//           if (this.pieceColor === "WHITE") {
//             if (occupiedPositionsWhite.has(pos)) {
//               break;
//             } else {
//               output.push(pos);
//               if (occupiedPositionsBlack.has(pos)) break;
//             }
//           } else {
//             if (occupiedPositionsBlack.has(pos)) break;
//             else {
//               output.push(pos);
//               if (occupiedPositionsWhite.has(pos)) break;
//             }
//           }
//           tempX += rowDirection[i];
//           tempY += colDirection[j];
//         }
//       }
//     }

//     return output;
//   }
//   getIcon() {
//     return getIconHelper(this.iconName, this.pieceColor);
//   }
// }

// class Queen implements ChessPiece {
//   pieceName: chessPieceNameType;
//   iconName = "fas fa-chess-queen fa-2x";
//   pieceColor: allPieceColorType;
//   rook: ChessPiece;
//   bishop: ChessPiece;
//   constructor(pieceColor: allPieceColorType) {
//     this.pieceColor = pieceColor;
//     this.pieceName = "QUEEN";
//     if (pieceColor === "WHITE") {
//       this.rook = new Rook("WHITE");
//       this.bishop = new Bishop("WHITE");
//     } else {
//       this.rook = new Rook("BLACK");
//       this.bishop = new Bishop("BLACK");
//     }
//   }
//   availableMovements(
//     x: number,
//     y: number,
//     occupiedPositionsWhite: HashMap<Position, chessPieceNameType>,
//     occupiedPositionsBlack: HashMap<Position, chessPieceNameType>
//   ) {
//     let output: Position[] = [];
//     output.push(
//       ...this.bishop.availableMovements(
//         x,
//         y,
//         occupiedPositionsWhite,
//         occupiedPositionsBlack
//       )
//     );
//     output.push(
//       ...this.rook.availableMovements(
//         x,
//         y,
//         occupiedPositionsWhite,
//         occupiedPositionsBlack
//       )
//     );
//     return output;
//   }
//   getIcon() {
//     return getIconHelper(this.iconName, this.pieceColor);
//   }
// }

// class King implements ChessPiece {
//   pieceName: chessPieceNameType;
//   iconName = "fas fa-chess-king fa-2x";
//   pieceColor: allPieceColorType;
//   pawn: ChessPiece;
//   knight: ChessPiece;
//   bishop: ChessPiece;
//   rook: ChessPiece;
//   queen: ChessPiece;
//   // opponentKing: ChessPiece;
//   constructor(pieceColor: allPieceColorType) {
//     this.pieceColor = pieceColor;
//     this.pieceName = "KING";
//     if (pieceColor === "BLACK") {
//       this.pawn = new Pawn("WHITE");
//       this.knight = new Knight("WHITE");
//       this.bishop = new Bishop("WHITE");
//       this.rook = new Rook("WHITE");
//       this.queen = new Queen("WHITE");
//       // this.opponentKing = new King("WHITE");
//     } else {
//       this.pawn = new Pawn("BLACK");
//       this.knight = new Knight("BLACK");
//       this.bishop = new Bishop("BLACK");
//       this.rook = new Rook("BLACK");
//       this.queen = new Queen("BLACK");
//       // this.opponentKing = new King("BLACK");
//     }
//   }
//   availableMovements(
//     x: number,
//     y: number,
//     occupiedPositionsWhite: HashMap<Position, chessPieceNameType>,
//     occupiedPositionsBlack: HashMap<Position, chessPieceNameType>
//   ) {
//     let output: Position[] = [];
//     let directions = [1, 0, -1];
//     for (let i = 0; i < directions.length; i++) {
//       for (let j = 0; j < directions.length; j++) {
//         if (directions[i] === 0 && directions[j] === 0) {
//           continue;
//         }
//         if (
//           x + directions[i] > 0 &&
//           x + directions[i] < 8 &&
//           y + directions[j] >= 0 &&
//           y + directions[j] < 8
//         ) {
//           let newPos: Position = { x: x + directions[i], y: y + directions[j] };
//           if (this.pieceColor === "WHITE") {
//             if (
//               !occupiedPositionsWhite.has(newPos) &&
//               !this.isKingCheck(
//                 newPos,
//                 occupiedPositionsWhite,
//                 occupiedPositionsBlack
//               )
//             ) {
//               output.push(newPos);
//             }
//           } else {
//             if (
//               !occupiedPositionsBlack.has(newPos) &&
//               !this.isKingCheck(
//                 newPos,
//                 occupiedPositionsWhite,
//                 occupiedPositionsBlack
//               )
//             ) {
//               output.push(newPos);
//             }
//           }
//         }
//       }
//     }
//     return output;
//   }
//   isKingCheck = (
//     pos: Position,
//     occupiedPositionsWhite: HashMap<Position, chessPieceNameType>,
//     occupiedPositionsBlack: HashMap<Position, chessPieceNameType>
//   ): boolean => {
//     let allOpponentPieceMovements: HashSet<Position> = new HashSet();
//     let allPositions: Position[];
//     let opponentOccupiedPositions: HashMap<Position, chessPieceNameType>;
//     if (this.pieceColor === "BLACK") {
//       allPositions = occupiedPositionsWhite.getKeys();
//       opponentOccupiedPositions = occupiedPositionsWhite;
//     } else {
//       allPositions = occupiedPositionsBlack.getKeys();
//       opponentOccupiedPositions = occupiedPositionsBlack;
//     }
//     for (let i = 0; i < allPositions.length; i++) {
//       //TODO create a better Map Iterator
//       let pieceAtCurrPos: chessPieceNameType | undefined =
//         opponentOccupiedPositions.get(allPositions[i]);
//       let allMovesOfCurrPiece: Position[] = [];
//       if (pieceAtCurrPos != undefined) {
//         if (pieceAtCurrPos === "PAWN") {
//           allMovesOfCurrPiece = this.pawn.availableMovements(
//             allPositions[i].x,
//             allPositions[i].y,
//             occupiedPositionsWhite,
//             occupiedPositionsBlack
//           );
//         } else if (pieceAtCurrPos === "ROOK") {
//           allMovesOfCurrPiece = this.rook.availableMovements(
//             allPositions[i].x,
//             allPositions[i].y,
//             occupiedPositionsWhite,
//             occupiedPositionsBlack
//           );
//         } else if (pieceAtCurrPos === "KNIGHT") {
//           allMovesOfCurrPiece = this.knight.availableMovements(
//             allPositions[i].x,
//             allPositions[i].y,
//             occupiedPositionsWhite,
//             occupiedPositionsBlack
//           );
//         } else if (pieceAtCurrPos === "BISHOP") {
//           allMovesOfCurrPiece = this.bishop.availableMovements(
//             allPositions[i].x,
//             allPositions[i].y,
//             occupiedPositionsWhite,
//             occupiedPositionsBlack
//           );
//         } else if (pieceAtCurrPos === "QUEEN") {
//           allMovesOfCurrPiece = this.queen.availableMovements(
//             allPositions[i].x,
//             allPositions[i].y,
//             occupiedPositionsWhite,
//             occupiedPositionsBlack
//           );
//         } else if (pieceAtCurrPos === "KING") {
//           // allMovesOfCurrPiece = this.opponentKing.availableMovements(
//           //   allPositions[i].x,
//           //   allPositions[i].y,
//           //   occupiedPositionsWhite,
//           //   occupiedPositionsBlack
//           // );
//         }
//       }
//       for (let pos of allMovesOfCurrPiece) {
//         allOpponentPieceMovements.add(pos);
//       }
//     }
//     return allOpponentPieceMovements.has(pos);
//   };
//   getIcon() {
//     return getIconHelper(this.iconName, this.pieceColor);
//   }
// }
let WhitePawn: ChessPiece = new Pawn("WHITE");
let BlackPawn: ChessPiece = new Pawn("BLACK");
// let BlackKnight: ChessPiece = new Knight("BLACK");
// let WhiteKnight: ChessPiece = new Knight("WHITE");
// let BlackRook: ChessPiece = new Rook("BLACK");
// let WhiteRook: ChessPiece = new Rook("WHITE");
// let BlackBishop: ChessPiece = new Bishop("BLACK");
// let WhiteBishop: ChessPiece = new Bishop("WHITE");
// let BlackQueen: ChessPiece = new Queen("BLACK");
// let WhiteQueen: ChessPiece = new Queen("WHITE");
// let BlackKing: ChessPiece = new King("BLACK");
// let WhiteKing: ChessPiece = new King("WHITE");

export const pieceNameToClassMapBlack: Record<chessPieceNameType, ChessPiece> =
  {
    PAWN: BlackPawn,
  };
// ["KNIGHT", BlackKnight],
// ["ROOK", BlackRook],
// ["BISHOP", BlackBishop],
// ["QUEEN", BlackQueen],
// ["KING", BlackKing],

export const pieceNameToClassMapWhite: Record<chessPieceNameType, ChessPiece> =
  {
    PAWN: WhitePawn,
  };
// ["KNIGHT", WhiteKnight],
// ["ROOK", WhiteRook],
// ["BISHOP", WhiteBishop],
// ["QUEEN", WhiteQueen],
// ["KING", WhiteKing],

export const createEmptyMove = (): MoveInfo => ({
  endPos: null,
  isWhiteTurn: null,
  pieceCaptured: null,
  pieceName: null,
  startPos: null,
});

export const resetBoard = (): SquareInfo[][] => {
  let output: SquareInfo[][] = [];
  for (let i = 0; i < 8; i++) {
    let row: SquareInfo[] = [];
    for (let j = 0; j < 8; j++) {
      let currSquare: SquareInfo = {
        x: i,
        y: j,
        pieceColor: null,
        pieceName: null,
      };
      row.push(currSquare);
    }
    output.push(row);
  }
  resetPawns(output);
  // resetRooks(output);
  // resetKnights(output);
  // resetBishops(output);
  // resetQueens(output);
  // resetKings(output);
  return output;
};

const resetPawns = (input: SquareInfo[][]) => {
  for (let i = 0; i < 8; i++) {
    input[1][i] = { ...input[1][i], pieceColor: "WHITE", pieceName: "PAWN" };
    input[6][i] = { ...input[6][i], pieceColor: "BLACK", pieceName: "PAWN" };
  }
};

const resetRooks = (input: SquareInfo[][]) => {
  input[0][0] = { ...input[0][0], pieceColor: "BLACK", pieceName: "ROOK" };
  input[0][7] = { ...input[0][7], pieceColor: "BLACK", pieceName: "ROOK" };
  input[7][0] = { ...input[7][0], pieceColor: "WHITE", pieceName: "ROOK" };
  input[7][7] = { ...input[7][7], pieceColor: "WHITE", pieceName: "ROOK" };
};

const resetBishops = (input: SquareInfo[][]) => {
  input[0][2] = { ...input[0][2], pieceColor: "BLACK", pieceName: "BISHOP" };
  input[0][5] = { ...input[0][5], pieceColor: "BLACK", pieceName: "BISHOP" };
  input[7][2] = { ...input[7][2], pieceColor: "WHITE", pieceName: "BISHOP" };
  input[7][5] = { ...input[7][5], pieceColor: "WHITE", pieceName: "BISHOP" };
};

const resetKnights = (input: SquareInfo[][]) => {
  input[0][1] = { ...input[0][1], pieceColor: "BLACK", pieceName: "KNIGHT" };
  input[0][6] = { ...input[0][6], pieceColor: "BLACK", pieceName: "KNIGHT" };
  input[7][1] = { ...input[7][1], pieceColor: "WHITE", pieceName: "KNIGHT" };
  input[7][6] = { ...input[7][6], pieceColor: "WHITE", pieceName: "KNIGHT" };
};

const resetQueens = (input: SquareInfo[][]) => {
  input[0][3] = { ...input[0][3], pieceColor: "BLACK", pieceName: "QUEEN" };
  input[7][3] = { ...input[7][3], pieceColor: "WHITE", pieceName: "QUEEN" };
};

const resetKings = (input: SquareInfo[][]) => {
  input[0][4] = { ...input[0][4], pieceColor: "BLACK", pieceName: "KING" };
  input[7][4] = { ...input[7][4], pieceColor: "WHITE", pieceName: "KING" };
};

export interface SquareInfo {
  x: number;
  y: number;
  pieceName: chessPieceNameType | null;
  pieceColor: allPieceColorType | null;
}

export interface MoveInfo {
  pieceName: chessPieceNameType | null;
  isWhiteTurn: boolean | null;
  startPos: Position | null;
  endPos: Position | null;
  pieceCaptured: chessPieceNameType | null;
}
