// import { Position } from "../model/ChessModels";
// import { HashSet } from "../model/CustomDataStructures";

// export type ActionMap<M extends { [index: string]: any }> = {
//   [Key in keyof M]: M[Key] extends undefined
//     ? {
//         type: Key;
//       }
//     : {
//         type: Key;
//         payload: M[Key];
//       };
// };

// export enum Types {
//   UPDATE_AVAILABLE_MOVES,
//   CLEAR_AVAILABLE_MOVES,
//   UPDATE_WHITE_MAP,
//   UPDATE_BLACK_MAP,
// }

// type UpdateOccupiedPositionsPayload = {
//   [Types.UPDATE_AVAILABLE_MOVES]: Position[];
//   [Types.CLEAR_AVAILABLE_MOVES]: null;
// };

// type UpdateMapPayload = {
//   [Types.UPDATE_BLACK_MAP]: {};
// };

// export type UpdateAvailableMovesAction =
//   ActionMap<UpdateOccupiedPositionsPayload>[keyof ActionMap<UpdateOccupiedPositionsPayload>];

// export const UpdateAvailableMovesReducer = (
//   state: HashSet<Position>,
//   action: UpdateAvailableMovesAction
// ) => {
//   switch (action.type) {
//     case Types.UPDATE_AVAILABLE_MOVES:
//       state.clear();
//       for (let pos of action.payload) {
//         state.add(pos);
//       }
//       return state;
//     case Types.CLEAR_AVAILABLE_MOVES:
//       state.clear();
//       return state;
//     default:
//       return state;
//   }
// };
export {};
