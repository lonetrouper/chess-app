import React, { FunctionComponent } from "react";
import ChessTile from "./ChessTile";
import "../Styles/ChessStyles.css";
import { Box, Grid } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
interface ChessComponentProps {}

const getGrid = () => {
  let rowOutput = [];
  for (let i = 0; i < 8; i++) {
    let colOutput = [];
    for (let j = 0; j < 8; j++) {
      colOutput.push(
        <Grid item sx={{ flexGrow: "1", margin: "auto" }} key={uuidv4()}>
          {ChessTile({ x: i, y: j })}
        </Grid>
      );
    }
    rowOutput.push(
      <Grid container spacing={0} sx={{ width: "100%" }} key={uuidv4()}>
        {colOutput}
      </Grid>
    );
  }
  return rowOutput;
};

const ChessComponent: FunctionComponent<ChessComponentProps> = () => {
  return (
    <div className="chess-container">
      <Box sx={{ width: "50em", height: "50em", margin: "auto" }}>
        {getGrid()}
      </Box>
    </div>
  );
};

export default ChessComponent;
