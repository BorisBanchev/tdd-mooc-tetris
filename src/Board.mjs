import { TetrominoMover } from "./TetrominoMover.mjs";

export class Board {
  width;
  height;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
    this.falling = null
    this.mover = new TetrominoMover()
  }

  drop(value) {
    if (this.falling) throw new Error("already falling")
    if (this.isTetromino(value)){
      this.dropTetromino(value)
    } else {
      this.dropBlock(value)
    }
  }
  isTetromino(value) {
    return value && typeof value.currentIndex === "number" &&
      Array.isArray(value.orientations) && value.orientations[value.currentIndex] &&
      Array.isArray(value.orientations[value.currentIndex].grid)
  }
  dropTetromino(tetromino){
    const shape = tetromino.orientations[tetromino.currentIndex];
    const { height: shapeHeight, width: shapeWidth } = this.getShapeDimensions(shape);
    const col = Math.floor((this.width - shapeWidth) / 2);
    const row = 0;
    this.falling = { value: tetromino, row, col, shape };
    this.placeShape(shape, row, col);
  }
  dropBlock(value) {
    const col = Math.floor(this.width / 2);
    this.falling = { value, row: 0, col };
    this.board[0][col] = value;
  }
  getShapeDimensions(shape) {
    const grid = shape.grid;
    return { height: grid.length, width: grid[0].length };
  }
  placeShape(shape, topRow, leftCol) {
    const grid = shape.grid;
    const { height: h, width: w } = this.getShapeDimensions(shape);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const ch = grid[r][c];
        const br = topRow + r;
        const bc = leftCol + c;
        if (ch !== "." && br >= 0 && br < this.height && bc >= 0 && bc < this.width) {
          this.board[br][bc] = ch;
        }
      }
    }
  }
  getOccupiedCells(shape, topRow, leftCol) {
    const cells = [];
    const grid = shape.grid;
    const { height: h, width: w } = this.getShapeDimensions(shape);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (grid[r][c] !== ".") {
          cells.push([topRow + r, leftCol + c]);
        }
      }
    }
    return cells;
  }

  executeBlockMove(directionRow, directionColumn, falling) {
    const { row, col, value } = falling;
    const newR = row + directionRow;
    const newC = col + directionColumn;
    if (newR >= 0 && newR < this.height && newC >= 0 && newC < this.width && this.board[newR][newC] === null) {
      this.board[row][col] = null;
      this.board[newR][newC] = value;
      this.falling.col = newC;
      this.falling.row = newR;
    }
  }
  
  settleTetromino() {
    this.falling = null;
  }

  moveLeft() {
    this.mover.moveLeft(this)
  }
  moveRight() {
    this.mover.moveRight(this)
  }
  moveDown() {
    this.mover.moveDown(this)
  }
  tick() {
    this.mover.tick(this)
  }
  hasFalling(){
    return !!this.falling
  }
  toString() {
    return this.board.map((row) => row.map((cell) => (cell === null ? "." : cell)).join("")).join("\n") + "\n";
  }
}
