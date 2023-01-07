import * as React from "react";
//import the Button component from MUI
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import "./App.css";
import  {useState} from "react";
//import _ from lodash to clone grid
import _ from 'lodash';
const HEIGHT = 11;
const WIDTH = 22; 

//the coordinates are (height, width) >> [i: height, j: width]

enum Color {
  GRAY='gray',
  BLUE='blue',
  RED='red',
  GREEN='green',
  LIGHTGRAY='lightgray',
  BLACK='black',
  LIGHTBLUE='purple',
  LIGHTRED='orange'
}

enum Border {
  BLACKBORDER= "black",
}

enum State {
  ALIVE = 'alive',
  DEAD = 'dead',
  GAMEOVER = 'gameOver'
}

class BlueCell {
  color: Color;
  state: State;
  numAlive: number; // num neighbors of cell alive
  numBlue: number;
  numRed: number;
  
  constructor() {
    this.color = Color.LIGHTGRAY;
    this.state = State.DEAD;
  }
}

class RedCell {
  border: Border;
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

function getNeighbors(i, j) {
  const N = `(${i + 1},${j})`; 
  const S = `(${i - 1},${j})`;
  const W = `(${i},${j - 1})`;
  const E = `(${i},${j + 1})`;
  const NW = `(${i + 1},${j - 1})`;
  const NE = `(${i + 1},${j + 1})`;
  const SW = `(${i - 1},${j - 1})`;
  const SE = `(${i - 1},${j + 1})`;
  const neighbors = [N, S, W, E, NW, NE, SW, SE];
  return neighbors;
}

console.log("getNeighbors", getNeighbors(1, 2));
let aliveNeighbors: string[] = [];
const aliveCellList = [[1, 2], [1, 3], [2, 3]];
for (let cell = 0; cell < aliveCellList.length; cell++) {
  const [i, j] = aliveCellList[cell];
  console.log("i, j", i, j)
  const neighbors = getNeighbors(i, j);
  aliveNeighbors = aliveNeighbors.concat(neighbors);
  console.log("AN", aliveNeighbors)
}
console.log("aliveNeighbors", aliveNeighbors);

const ConwayGrid = (props) => {
  const blueGoalCellY = 5; //5, 2
  const blueGoalCellX = 2;
  const redGoalCellY = 5; //5, 19
  const redGoalCellX = 19;

  const setupGrid = () => {
    const grid : Cell[][]= []
    for(let i=0; i < HEIGHT; i++) {
      grid.push([])
      for(let j = 0; j< WIDTH; j++) {
          if(j<11){
            grid[i].push( new BlueCell() )
          }else{
            grid[i].push( new RedCell() )
          }}
      }
    grid[blueGoalCellY][blueGoalCellX].border = Border.BLACKBORDER;
    grid[redGoalCellY][redGoalCellX].border = Border.BLACKBORDER;
      return grid;
    }

  const [grid, setGrid] = useState<Cell[][]>(setupGrid());
  const [activeColor, setActiveColor] = useState<Color>(Color.BLUE);

  function update(grid: Cell[][]) {
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
  
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        let cell = grid[i][j];
        if (cell.state === State.ALIVE) {
          if (cell.numAlive < 2 || cell.numAlive > 3) {
            cell.state = State.DEAD;
            if(j<11){
              cell.color=Color.LIGHTGRAY;
            }
            if(j>10){
              cell.color=Color.GRAY;
            }
          }
        } else {
          if (cell.numAlive === 3) { 
            if (cell.color!==Color.BLACK) {
              cell.state = State.ALIVE;
            }
            if (cell.numBlue > cell.numRed) {
              if (i===redGoalCellY && j===redGoalCellX) {
                cell.color = Color.LIGHTBLUE;
                console.log("CONGRATS, BLUE WON!")
              } else {
                cell.color = Color.BLUE;
              }
            } else if (cell.numRed > cell.numBlue) {
              if (i===blueGoalCellY && j===blueGoalCellX) {
                cell.color = Color.LIGHTRED;
                console.log("CONGRATS, RED WON!")
              } else {
                cell.color = Color.RED;
              }
            }
          }
        }
      }
    }
    //use clone to update within the function, react won't render the state if it's inside function, hence clone is used 
    const newGrid = _.clone(grid);
    setGrid(newGrid);
  };

  const onClick = (cell: Cell,i,j) => {
    getNeighbors(grid, i, j);
    if (cell.state===State.ALIVE){
      cell.state=State.DEAD;
      if(j<11 && activeColor === Color.BLUE){
        cell.color=Color.LIGHTGRAY;
      }
      if(j>10 && activeColor === Color.RED){
        cell.color=Color.GRAY;
      }
    //validating that the goal square isn't changed color, preventing turning goalCell.State to ALIVE
    } else if (cell.state===State.DEAD){
      cell.state=State.ALIVE;
      if(j<11 && activeColor === Color.BLUE){ 
        cell.color=Color.BLUE;
      }
      if(j>10 && activeColor === Color.RED){
        cell.color=Color.RED;
    }
  }

  const newGrid = _.clone(grid);
  setGrid(newGrid);
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
    <div className="main">
      <div className="fullGrid">
        <div className="leftGrid">
          <Grid container spacing={1} columns={22}>
            {grid.map((row, i) => (
              row.map((cell, j) => (
              <Grid onClick={() => onClick(cell,i,j)} item xs={1} sm={1} md={1} key={`${i},${j}`} border={cell.border} color={cell.color}>
                <Item className="cell" sx={{ border: 2, borderColor: cell.border}} style={{backgroundColor: cell.color}}></Item>
              </Grid>
              )
            )))}
          </Grid>
        </div>
      </div>
    </div>
    </div>
  );
}

function App() {
  return <ConwayGrid></ConwayGrid>
}

export default App;
