// import React, { createContext, Dispatch, useReducer } from "react";
// import {
//   chessPieceNameType,
//   Position,
//   resetBlackPieces,
//   resetBoard,
//   resetWhitePieces,
// } from "../model/ChessModels";
// import { HashMap, HashSet } from "../model/CustomDataStructures";
// import {
//   Types,
//   UpdateAvailableMovesAction,
//   UpdateAvailableMovesReducer,
// } from "./Reducers";

// export interface ChessContext {
//   occupiedPositionsWhite: HashMap<Position, chessPieceNameType>;
//   occupiedPositionsBlack: HashMap<Position, chessPieceNameType>;
//   blackKingPos: Position;
//   whiteKingPos: Position;
//   startMove: any;
//   currMove: any;
//   isWhiteTurn: boolean;
//   possibleMoves: HashSet<Position>;
// }

// const chessContextImpl: ChessContext = resetBoard();

// // export const ChessCtx = React.createContext<ChessContext>(chessContextImpl);

// const ChessCtx = createContext<{
//   state: ChessContext;
//   dispatch: Dispatch<UpdateAvailableMovesAction>;
// }>({
//   state: chessContextImpl,
//   dispatch: () => null,
// });

// const mainReducer = (
//   {
//     occupiedPositionsWhite,
//     occupiedPositionsBlack,
//     blackKingPos,
//     whiteKingPos,
//     startMove,
//     currMove,
//     isWhiteTurn,
//     possibleMoves,
//   }: ChessContext,
//   action: UpdateAvailableMovesAction
// ) => {
//   if (action.type === Types.UPDATE_AVAILABLE_MOVES) {
//     possibleMoves.clear();
//     for (let pos of action.payload) {
//       possibleMoves.add(pos);
//     }
//   } else if (action.type === Types.CLEAR_AVAILABLE_MOVES) {
//     possibleMoves.clear();
//   }

//   return {
//     occupiedPositionsWhite: occupiedPositionsWhite,
//     occupiedPositionsBlack: occupiedPositionsBlack,
//     blackKingPos: blackKingPos,
//     whiteKingPos: whiteKingPos,
//     startMove: startMove,
//     currMove: currMove,
//     isWhiteTurn: isWhiteTurn,
//     possibleMoves: possibleMoves,
//   };
// };

// const ChessContextProvider: React.FC = ({ children }) => {
//   const [state, dispatch] = useReducer(mainReducer, chessContextImpl);

//   return (
//     <ChessCtx.Provider value={{ state, dispatch }}>
//       {children}
//     </ChessCtx.Provider>
//   );
// };

// export { ChessContextProvider, ChessCtx };
export {};
