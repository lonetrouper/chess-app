import { Paper, styled } from "@mui/material";
import React, { FunctionComponent } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChessContext, ChessCtx } from "../context/ChessContext";
import "../Styles/ChessStyles.css";
import {
  allPieceColorType,
  ChessPiece,
  chessPieceNameType,
  pieceNameToClassMapBlack,
  pieceNameToClassMapWhite,
  Position,
} from "../model/ChessModels";
import { HashMap } from "../model/CustomDataStructures";

interface ChessTileProps {
  x: number;
  y: number;
}

const Tile = styled(Paper)((prop: ChessTileProps) => {
  let darkSelect = "#646D40";
  let lightSelect = "#819669";
  let color = (prop.x + prop.y) % 2 === 0 ? "#FFCE9E" : "#D18B47"; //D18B47 "#F0D9B5" FFCE9E B58863
  return {
    background: color,
    minHeight: "6em",
    minWidth: "6em",
    // width: "7.5vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
});

const ChessTile: FunctionComponent<ChessTileProps> = (
  input: ChessTileProps
) => {
  const chessContext = React.useContext(ChessCtx);
  return (
    <Tile
      {...input}
      key={uuidv4()}
      onClick={() => {
        tileClickHelper(input, chessContext);
      }}
    >
      <div className="icon-container">
        {iconHelper({ x: input.x, y: input.y }, chessContext)}
      </div>
    </Tile>
  );
};

const iconHelper = (pos: Position, chessContext: ChessContext | null): any => {
  let className;
  if (chessContext != null && chessContext.occupiedPositionsBlack.has(pos)) {
    className = getIconUtil(pos, chessContext.occupiedPositionsBlack, "BLACK");
  } else if (
    chessContext != null &&
    chessContext.occupiedPositionsWhite.has(pos)
  ) {
    className = getIconUtil(pos, chessContext.occupiedPositionsWhite, "WHITE");
  }
  if (className != undefined) {
    return <i className={className}></i>;
  }
};

const getIconUtil = (
  pos: Position,
  inMap: HashMap<Position, chessPieceNameType>,
  pieceColor: allPieceColorType
) => {
  if (pieceColor === "BLACK") {
    let pieceName = inMap.get(pos);
    if (pieceName != undefined) {
      let pieceImpl = pieceNameToClassMapBlack.get(
        pieceName as chessPieceNameType
      );
      return pieceImpl?.getIcon();
    }
  } else {
    let pieceName = inMap.get(pos);
    if (pieceName != undefined) {
      let pieceImpl = pieceNameToClassMapWhite.get(
        pieceName as chessPieceNameType
      );
      return pieceImpl?.getIcon();
    }
  }
};

const tileClickHelper = (
  props: ChessTileProps,
  chessContext: ChessContext | null
) => {
  console.log("clicked", props);
};

export default ChessTile;
