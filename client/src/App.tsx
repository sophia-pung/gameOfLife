import * as React from "react";
//import the Button component from MUI
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import "./App.css";
import { jsx } from "@emotion/react";
import  {useState} from "react";
import _ from 'lodash';
const HEIGHT = 10;
const WIDTH = 20; 

//i > height, j > width 

enum Color {
  GRAY='gray',
  BLUE='blue',
  RED='red',
}

enum State {
  ALIVE = 'alive',
  DEAD = 'dead'
}

class Cell {
  color: Color;
  state: State;
  numAlive: number; // num neighbors of cell alive
  numBlue: number;
  numRed: number;
  
  constructor() {
    this.color = Color.GRAY;
    this.state = State.DEAD;
  }
}

const gridStyles = {
  backgroundColor: "gray",
  marginLeft: "auto",
  marginRight: "auto",
  paddingRight: 1,
  paddingBottom: 1
};

// function redClick(cellColor) {
//   console.log("I clicked the red button")
//   if (cellColor === Redcellcolor.GRAY) {
//     cellColor = Redcellcolor.RED;
//     blueClick('blue');
//   } else if (cellColor === Redcellcolor.RED) {
//     cellColor = Redcellcolor.GRAY;
//   }
//   //default to blue 
//   //if red button === gray > turn red, blue button turn gray
//   //else if red button === red > turn gray, blue button turn blue
// }

// function blueClick(cellColor) {
//   console.log("I clicked the blue button")
//   if (cellColor === Bluecellcolor.GRAY) {
//     cellColor = Bluecellcolor.BLUE;
//     redClick('red');
//   } else if (cellColor === Bluecellcolor.BLUE) {
//     cellColor = Bluecellcolor.GRAY;
//   }
// }

function getNeighbors(grid, i, j) {
  const cell = grid[i][j];
  // console.log("cell: ", cell);
  const N = i > 0 ? grid[i - 1][j] : null;
  const S = i < HEIGHT - 1 ? grid[i + 1][j] : null;
  const W = j > 0 ? grid[i][j - 1] : null;
  const E = j < WIDTH - 1 ? grid[i][j + 1] : null;
  const NW = i > 0 && j > 0 ? grid[i - 1][j - 1] : null;
  const NE = i > 0 && j < WIDTH - 1 ? grid[i - 1][j + 1] : null;
  const SW = i < HEIGHT - 1 && j > 0 ? grid[i + 1][j - 1] : null;
  const SE = i < HEIGHT - 1 && j < WIDTH - 1 ? grid[i + 1][j + 1] : null;
  const neighbors = [N, S, W, E, NW, NE, SW, SE];
  // console.log("hey! my neighbord are", neighbors);
  return neighbors.filter((neighbor) => neighbor !== null);
}

const ConwayGrid = (props) => {
  const setupGrid = () => {
    const grid : Cell[][]= []
    for(let i=0; i < HEIGHT; i++) {
      grid.push([])
      for(let j = 0; j< WIDTH; j++) {
          grid[i].push( new Cell() )
      }
      }
      return grid;
    }

  const [grid, setGrid] = useState<Cell[][]>(setupGrid());
  const [activeColor, setActiveColor] = useState<Color>(Color.BLUE);

  function update(grid: Cell[][]) {
    console.log("I'm updating!");
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        const neighbors = getNeighbors(grid, i, j);
        let cell = grid[i][j];
        cell.numAlive = neighbors.filter((neighbor) => neighbor.state === State.ALIVE)
          .length;
        cell.numBlue = neighbors.filter((neighbor) => neighbor.color === Color.BLUE)
          .length;
        cell.numRed = neighbors.filter((neighbor) => neighbor.color === Color.RED).length
      }
    }
  
    // update each cell depending on its neighbors
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        let cell = grid[i][j];
        if (cell.state === State.ALIVE) {
          if (cell.numAlive < 2 || cell.numAlive > 3) {
            cell.state = State.DEAD;
            cell.color = Color.GRAY;
          }
        } else {
          if (cell.numAlive === 3) {
            cell.state = State.ALIVE;
            if (cell.numBlue > cell.numRed) {
              cell.color = Color.BLUE;
            } else if (cell.numRed > cell.numBlue) {
              cell.color = Color.RED;
            }
          }
        }
      }
    }
    const newGrid = _.clone(grid);
    setGrid(newGrid);
  };

  const onClick = (cell: Cell,i,j) => {
    getNeighbors(grid, i, j);
    console.log(cell,i,j);
    if (cell.state===State.ALIVE){
      cell.state=State.DEAD;
      cell.color=Color.GRAY;
    } else if (cell.state===State.DEAD){
      cell.state=State.ALIVE;
      cell.color=activeColor;
    }
  //   const newCell = new Cell();
  //   newCell.state = cell.state;
  //   newCell.color = cell.color;
  //   setGrid([...grid.slice(0,i),
  //   [...grid[i].slice(0,j), cell, ...grid[i].slice(j+1)],
  // ...grid.slice(i+1)]);
  const newGrid = _.clone(grid);
  setGrid(newGrid);
    console.log('hurray, we set cell', {i,j})
  }

  const changeClick = (cellColor: Color) => {
    setActiveColor(cellColor);
  }

  const getBgColor = (cellColor: Color) => {
    return cellColor === activeColor ? cellColor : Color.GRAY;
  }

  return (
    <div className="outer">
    <button onClick={() => update(grid)} className="button">test</button>
    <div className="colorToggle">
      <div onClick={() => {changeClick(Color.BLUE)}} style={{backgroundColor: getBgColor(Color.BLUE)}} className="blue cell"></div>
      <div onClick={() => {changeClick(Color.RED)}} style={{backgroundColor: getBgColor(Color.RED)}} className="red cell"></div>
    </div>
    {/* TODO: ADD TOGGLE BUTTON IN THE MIDDLE OF PAGE<div></div> */}
    {/* TODO: ADD GRID LINE IN THE MIDDLE OF THE GRID <div className="centerLine"> </div> */}
    <div className="main">
      <div className="fullGrid">
        <div className="leftGrid">
          <Grid container spacing={1} columns={20}>
            {grid.map((row, i) => (
              row.map((cell, j) => (
              <Grid onClick={() => onClick(cell,i,j)} item xs={1} sm={1} md={1} key={`${i},${j}`} color={cell.color}>
                <Item className="cell" sx={{ border: 2 }} style={{backgroundColor: cell.color}}></Item>
              </Grid>
              )
            )))}
          </Grid>
        </div>
        {/* <div className="gap">
          <div className="centerLine"> </div>
        </div> */}
      </div>
    </div>
    </div>
  );
}

function App() {
  return <ConwayGrid></ConwayGrid>
}

export default App;
