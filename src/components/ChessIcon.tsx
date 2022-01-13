import React, { FunctionComponent } from "react";
import {
  allPieceColorType,
  chessPieceNameType,
  pieceNameToClassMapBlack,
  pieceNameToClassMapWhite,
} from "../model/ChessModels";

export interface ChessIconProps {
  pieceColor: allPieceColorType | undefined;
  pieceName: chessPieceNameType | undefined;
}

const ChessIcon: FunctionComponent<ChessIconProps> = (
  props: ChessIconProps
) => {
  return <div className="icon-container">{iconHelper(props)}</div>;
};

const iconHelper = (chessIconProps: ChessIconProps): any => {
  if (
    chessIconProps.pieceColor !== undefined &&
    chessIconProps.pieceName !== undefined
  ) {
    let className = getIconUtil(
      chessIconProps.pieceName,
      chessIconProps.pieceColor
    );
    return <i className={className}></i>;
  }
};

const getIconUtil = (
  pieceName: chessPieceNameType,
  pieceColor: allPieceColorType
) => {
  if (pieceColor === "BLACK") {
    let pieceImpl = pieceNameToClassMapBlack.get(pieceName);
    return pieceImpl?.getIcon();
  } else {
    let pieceImpl = pieceNameToClassMapWhite.get(pieceName);
    return pieceImpl?.getIcon();
  }
};

export const MemoChessIcon = React.memo(ChessIcon);

export default ChessIcon;
