import React from "react";
import {
  chessPieceNameType,
  Position,
  resetBlackPieces,
  resetWhitePieces,
} from "../model/ChessModels";
import { HashMap } from "../model/CustomDataStructures";

export interface ChessContext {
  occupiedPositionsWhite: HashMap<Position, chessPieceNameType>;
  occupiedPositionsBlack: HashMap<Position, chessPieceNameType>;
  // blackKingPosition: Position;
  // whiteKingPosition: Position;
}

const chessContextImpl: ChessContext = {
  occupiedPositionsBlack: resetBlackPieces(),
  occupiedPositionsWhite: resetWhitePieces(),
};

export const ChessCtx = React.createContext<ChessContext | null>(
  chessContextImpl
);
