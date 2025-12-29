export class Board {
  width;
  height;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
    this.falling = null
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
  canMoveTetrominoDown(falling) {
    const { row, col, shape } = falling;
    const occupied = new Set(this.getOccupiedCells(shape, row, col).map(([r, c]) => `${r},${c}`));
    const grid = shape.grid;
    const { height: h, width: w } = this.getShapeDimensions(shape);

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (grid[r][c] === ".") continue;
        const newR = row + r + 1;
        const newC = col + c;
        if (newR >= this.height) return false;
        const occupant = this.board[newR][newC];
        if (occupant !== null && !occupied.has(`${newR},${newC}`)) return false;
      }
    }
    return true;
  }
  moveTetrominoDown(falling) {
    const { row, col, shape } = falling;
    const occupiedCells = this.getOccupiedCells(shape, row, col);
    // clear current cells
    for (const [r, c] of occupiedCells) {
      this.board[r][c] = null;
    }
    // set cells one row down
    for (const [r, c] of occupiedCells) {
      this.board[r + 1][c] = shape.grid[r - row][c - col];
    }
    this.falling.row = row + 1;
  }
  settleTetromino() {
    this.falling = null;
  }
  moveBlockDown(falling) {
    const { row, col, value } = falling;
    if (row + 1 < this.height && this.board[row + 1][col] === null) {
      this.board[row][col] = null;
      this.board[row + 1][col] = value;
      this.falling.row = row + 1;
    } else {
      this.falling = null;
    }
  }
  tick() {
    if (!this.falling) return;
    const f = this.falling;
    if (f.shape && this.isTetromino(f.value)) {
      if (this.canMoveTetrominoDown(f)) {
        this.moveTetrominoDown(f);
      } else {
        this.settleTetromino();
      }
    } else {
      this.moveBlockDown(f);
    }
  }
  hasFalling(){
    return !!this.falling
  }
  toString() {
    return this.board.map((row) => row.map((cell) => (cell === null ? "." : cell)).join("")).join("\n") + "\n";
  }
}
