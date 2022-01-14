import { Paper, styled } from "@mui/material";
import React, { FunctionComponent } from "react";
import "../Styles/ChessStyles.css";
import {
  allPieceColorType,
  chessPieceNameType,
  Position,
} from "../model/ChessModels";
import { ChessIconProps, MemoChessIcon } from "./ChessIcon";
import { ColorOptions } from "./ChessComponent";

export interface ChessTileProps {
  x: number;
  y: number;
  pieceName: chessPieceNameType | null;
  pieceColor: allPieceColorType | null;
  tileBackgroundColor: ColorOptions;
  clickHandler: (pos: Position) => void;
}

const Tile = styled(Paper)(() => {
  return {
    minHeight: "6em",
    minWidth: "6em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
});

const getColor = (colorOption: ColorOptions) => {
  switch (colorOption) {
    case ColorOptions.LIGHT:
      return "#FFCE9E";
    case ColorOptions.DARK:
      return "#D18B47";
    case ColorOptions.LIGHT_HIGHLIGHTED:
      return "#819669";
    case ColorOptions.DARK_HIGHLIGHTED:
      return "#646D40";
  }
};

const ChessTile: FunctionComponent<ChessTileProps> = (
  input: ChessTileProps
) => {
  let chessIconProps: ChessIconProps = {
    pieceColor: input.pieceColor,
    pieceName: input.pieceName,
  };
  return (
    <Tile
      sx={{ background: getColor(input.tileBackgroundColor) }}
      key={"chessTile" + input.x + input.y}
      onClick={() => {
        input.clickHandler({ x: input.x, y: input.y });
      }}
    >
      <MemoChessIcon {...chessIconProps}></MemoChessIcon>
    </Tile>
  );
};

const propsAreEqual = (
  prevProps: ChessTileProps,
  nextProps: ChessTileProps
) => {
  let output: boolean =
    prevProps.pieceColor === nextProps.pieceColor &&
    prevProps.pieceName === nextProps.pieceName &&
    prevProps.tileBackgroundColor === nextProps.tileBackgroundColor &&
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y;
  return output;
};

export const MemoChessTile = React.memo(ChessTile, propsAreEqual);
// export const MemoChessTile = React.memo(ChessTile);
export default ChessTile;
