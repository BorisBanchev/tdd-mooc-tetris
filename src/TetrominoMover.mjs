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
  moveLeft(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (this.canMoveTetromino("left", board, f, occupied)) {
        board.executeMove("left", f, occupied);
      }
    } else {
      if (this.canMoveBlock("left", board, f)) {
        board.executeMove("left", f, null);
      }
    }
  }
  moveRight(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (this.canMoveTetromino("right", board, f, occupied)) {
        board.executeMove("right", f, occupied);
      }
    } else {
      if (this.canMoveBlock("right", board, f)) {
        board.executeMove("right", f, null);
      }
    }
  }
  moveDown(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (this.canMoveTetromino("down", board, f, occupied)) {
        board.executeMove("down", f, occupied);
      } else {
        board.settleTetromino();
      }
    } else {
      if (this.canMoveBlock("down", board, f)) {
        board.executeMove("down", f, null);
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
        board.executeMove("down", f, null);
      } else {
        board.falling = null;
      }
    } else {
      if (this.canMoveBlock("down", board, f)) {
        board.executeMove("down", f, null);
      } else {
        board.falling = null;
      }
    }
  }
}