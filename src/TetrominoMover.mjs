export class TetrominoMover {
  constructor() {
    this.dirs = { left: [0, -1], right: [0, 1], down: [1, 0] };
  }
  canMoveTetromino(direction, board, falling, occupiedCells) {
    if (!falling || !falling.shape || !board.isTetromino(falling.value)) return false;
    const d = this.dirs[direction];
    if (!d) return false;
    const [dr, dc] = d;

    const { row, col, shape } = falling;
    const occupied = occupiedCells || board.getOccupiedCells(shape, row, col);
    const occupiedSet = new Set(occupied.map(([r, c]) => `${r},${c}`));

    for (const [r, c] of occupied) {
      const newR = r + dr;
      const newC = c + dc;
      if (newR < 0 || newR >= board.height || newC < 0 || newC >= board.width) return false;
      const occupant = board.board[newR][newC];
      if (occupant !== null && !occupiedSet.has(`${newR},${newC}`)) return false;
    }
    return true;
  }
  canMoveBlock(direction, board, falling) {
    if (!falling || falling.shape) return false;
    const d = this.dirs[direction];
    if (!d) return false;
    const [dr, dc] = d;

    const { row, col } = falling;
    const newR = row + dr;
    const newC = col + dc;
    if (newR < 0 || newR >= board.height || newC < 0 || newC >= board.width) return false;
    return board.board[newR][newC] === null;
  }
  executeMove(direction, board, falling, occupiedCells) {
    if (!falling) return;
    const d = this.dirs[direction];
    if (!d) return;
    const [dr, dc] = d;

    if (falling.shape && board.isTetromino(falling.value)) {
      const { row, col, shape } = falling;
      const occupied = occupiedCells || board.getOccupiedCells(shape, row, col);
      for (const [r, c] of occupied) {
        board.board[r][c] = null;
      }
      for (const [r, c] of occupied) {
        const ch = shape.grid[r - row][c - col];
        const newR = r + dr;
        const newC = c + dc;
        board.board[newR][newC] = ch;
      }
      board.falling.row = row + dr;
      board.falling.col = col + dc;
      return;
    }

    this.executeBlockMove(dr, dc, board, falling);
  }
  executeBlockMove(dr, dc, board, falling) {
    const { row, col, value } = falling;
    const newR = row + dr;
    const newC = col + dc;
    if (newR >= 0 && newR < board.height && newC >= 0 && newC < board.width && board.board[newR][newC] === null) {
      board.board[row][col] = null;
      board.board[newR][newC] = value;
      board.falling.col = newC;
      board.falling.row = newR;
    }
  }
  moveLeft(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (this.canMoveTetromino("left", board, f, occupied)) {
        this.executeMove("left", board, f, occupied);
      }
    } else {
      if (this.canMoveBlock("left", board, f)) {
        this.executeMove("left", board, f, null);
      }
    }
  }
  moveRight(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (this.canMoveTetromino("right", board, f, occupied)) {
        this.executeMove("right", board, f, occupied);
      }
    } else {
      if (this.canMoveBlock("right", board, f)) {
        this.executeMove("right", board, f, null);
      }
    }
  }
  moveDown(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (this.canMoveTetromino("down", board, f, occupied)) {
        this.executeMove("down", board, f, occupied);
      } else {
        board.settleTetromino();
      }
    } else {
      if (this.canMoveBlock("down", board, f)) {
        this.executeMove("down", board, f, null);
      } else {
        board.falling = null;
      }
    }
  }
  tick(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      if (this.canMoveTetromino("down", board, f, null)) {
        this.executeMove("down", board, f, null);
      } else {
        board.falling = null;
      }
    } else {
      if (this.canMoveBlock("down", board, f)) {
        this.executeMove("down", board, f, null);
      } else {
        board.falling = null;
      }
    }
  }
}