import { moveState } from "../components/ChessComponent";
import { Bishop } from "./Bishop";
import { King } from "./King";
import { Knight } from "./Knight";
import { Pawn } from "./Pawn";
import { Queen } from "./Queen";
import { Rook } from "./Rook";

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
    prevState: moveState,
    prevMove?: MoveInfo
  ): Position[];
  isEnPassant?(
    startPos: Position,
    currPos: Position,
    prevMove: MoveInfo
  ): boolean;
  getIcon: () => string;
}

export interface Position {
  x: number;
  y: number;
}

export const getIconHelper = (
  iconName: string,
  pieceColor: allPieceColorType
) => {
  if (pieceColor === "BLACK") {
    return iconName + " black";
  }
  return iconName + " white";
};

let WhitePawn: ChessPiece = new Pawn("WHITE");
let BlackPawn: ChessPiece = new Pawn("BLACK");
let BlackKnight: ChessPiece = new Knight("BLACK");
let WhiteKnight: ChessPiece = new Knight("WHITE");
let BlackRook: ChessPiece = new Rook("BLACK");
let WhiteRook: ChessPiece = new Rook("WHITE");
let BlackBishop: ChessPiece = new Bishop("BLACK");
let WhiteBishop: ChessPiece = new Bishop("WHITE");
let BlackQueen: ChessPiece = new Queen("BLACK");
let WhiteQueen: ChessPiece = new Queen("WHITE");
let BlackKing: ChessPiece = new King("BLACK");
let WhiteKing: ChessPiece = new King("WHITE");

export const pieceNameToClassMapBlack: Record<chessPieceNameType, ChessPiece> =
  {
    PAWN: BlackPawn,
    KNIGHT: BlackKnight,
    ROOK: BlackRook,
    BISHOP: BlackBishop,
    QUEEN: BlackQueen,
    KING: BlackKing,
  };

export const pieceNameToClassMapWhite: Record<chessPieceNameType, ChessPiece> =
  {
    PAWN: WhitePawn,
    KNIGHT: WhiteKnight,
    ROOK: WhiteRook,
    BISHOP: WhiteBishop,
    QUEEN: WhiteQueen,
    KING: WhiteKing,
  };

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
  resetRooks(output);
  resetKnights(output);
  resetBishops(output);
  resetQueens(output);
  resetKings(output);
  return output;
};

const resetPawns = (input: SquareInfo[][]) => {
  for (let i = 0; i < 8; i++) {
    input[1][i] = { ...input[1][i], pieceColor: "WHITE", pieceName: "PAWN" };
    input[6][i] = { ...input[6][i], pieceColor: "BLACK", pieceName: "PAWN" };
  }
};

const resetRooks = (input: SquareInfo[][]) => {
  input[0][0] = { ...input[0][0], pieceColor: "WHITE", pieceName: "ROOK" };
  input[0][7] = { ...input[0][7], pieceColor: "WHITE", pieceName: "ROOK" };
  input[7][0] = { ...input[7][0], pieceColor: "BLACK", pieceName: "ROOK" };
  input[7][7] = { ...input[7][7], pieceColor: "BLACK", pieceName: "ROOK" };
};

const resetBishops = (input: SquareInfo[][]) => {
  input[0][2] = { ...input[0][2], pieceColor: "WHITE", pieceName: "BISHOP" };
  input[0][5] = { ...input[0][5], pieceColor: "WHITE", pieceName: "BISHOP" };
  input[7][2] = { ...input[7][2], pieceColor: "BLACK", pieceName: "BISHOP" };
  input[7][5] = { ...input[7][5], pieceColor: "BLACK", pieceName: "BISHOP" };
};

const resetKnights = (input: SquareInfo[][]) => {
  input[0][1] = { ...input[0][1], pieceColor: "WHITE", pieceName: "KNIGHT" };
  input[0][6] = { ...input[0][6], pieceColor: "WHITE", pieceName: "KNIGHT" };
  input[7][1] = { ...input[7][1], pieceColor: "BLACK", pieceName: "KNIGHT" };
  input[7][6] = { ...input[7][6], pieceColor: "BLACK", pieceName: "KNIGHT" };
};

const resetQueens = (input: SquareInfo[][]) => {
  input[0][4] = { ...input[0][4], pieceColor: "WHITE", pieceName: "QUEEN" };
  input[7][4] = { ...input[7][4], pieceColor: "BLACK", pieceName: "QUEEN" };
};

const resetKings = (input: SquareInfo[][]) => {
  input[0][3] = { ...input[0][3], pieceColor: "WHITE", pieceName: "KING" };
  input[7][3] = { ...input[7][3], pieceColor: "BLACK", pieceName: "KING" };
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
