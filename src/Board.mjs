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
  canMoveTetromino(direction, falling, occupiedCells) {
    if (!falling || !falling.shape || !this.isTetromino(falling.value)) return false;
    const dirs = { left: [0, -1], right: [0, 1], down: [1, 0] };
    const d = dirs[direction];
    if (!d) return false;
    const [dr, dc] = d;

    const { row, col, shape } = falling;
    const occupied = occupiedCells || this.getOccupiedCells(shape, row, col);
    const occupiedSet = new Set(occupied.map(([r, c]) => `${r},${c}`));

    for (const [r, c] of occupied) {
      const newR = r + dr;
      const newC = c + dc;
      if (newR < 0 || newR >= this.height || newC < 0 || newC >= this.width) return false;
      const occupant = this.board[newR][newC];
      if (occupant !== null && !occupiedSet.has(`${newR},${newC}`)) return false;
    }
    return true;
  }
  canMoveBlock(direction, falling, occupiedCells) {
    if (!falling || falling.shape) return false;
    const dirs = { left: [0, -1], right: [0, 1], down: [1, 0] };
    const d = dirs[direction];
    if (!d) return false;
    const [dr, dc] = d;

    const { row, col } = falling;
    const newR = row + dr;
    const newC = col + dc;
    if (newR < 0 || newR >= this.height || newC < 0 || newC >= this.width) return false;
    return this.board[newR][newC] === null;
  }
  executeMove(direction, falling, occupiedCells) {
    if (!falling) return;
    const dirs = { left: [0, -1], right: [0, 1], down: [1, 0] };
    const d = dirs[direction];
    if (!d) return;
    const [dr, dc] = d;

    if (falling.shape && this.isTetromino(falling.value)) {
      const { row, col, shape } = falling;
      const occupied = occupiedCells || this.getOccupiedCells(shape, row, col);
      for (const [r, c] of occupied) {
        this.board[r][c] = null;
      }
      for (const [r, c] of occupied) {
        const ch = shape.grid[r - row][c - col];
        const newR = r + dr;
        const newC = c + dc;
        this.board[newR][newC] = ch;
      }
      this.falling.row = row + dr;
      this.falling.col = col + dc;
      return;
    }
    this.executeBlockMove(directionRow, directionColumn, falling)
    
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

  moveLeft() {
    if (!this.falling) return
    const f = this.falling
    if (f.shape && this.isTetromino(f.value)) {
      const occupiedCells = this.getOccupiedCells(f.shape, f.row, f.col)
      if (this.validateMove("left", f, occupiedCells)) {
        this.executeMove("left", f, occupiedCells)
      }
    } else {
      if (this.validateMove("left", f, null)) {
        this.executeMove("left", f, null)
      }
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
