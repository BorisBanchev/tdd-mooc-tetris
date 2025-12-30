export class TetrominoMover {
  constructor() {
    this.dirs = { left: [0, -1], right: [0, 1], down: [1, 0] };
  }
  moveLeft(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (board.canMoveTetromino("left", f, occupied)) {
        board.executeMove("left", f, occupied);
      }
    } else {
      if (board.canMoveBlock("left", f, null)) {
        board.executeMove("left", f, null);
      }
    }
  }
  moveRight(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (board.canMoveTetromino("right", f, occupied)) {
        board.executeMove("right", f, occupied);
      }
    } else {
      if (board.canMoveBlock("right", f, null)) {
        board.executeMove("right", f, null);
      }
    }
  }
  moveDown(board) {
    const f = board.falling;
    if (!f) return;
    if (f.shape && board.isTetromino(f.value)) {
      const occupied = board.getOccupiedCells(f.shape, f.row, f.col);
      if (board.canMoveTetromino("down", f, occupied)) {
        board.executeMove("down", f, occupied);
      } else {
        board.settleTetromino();
      }
    } else {
      if (board.canMoveBlock("down", f, null)) {
        board.executeMove("down", f, null);
      } else {
        board.falling = null;
      }
    }
  }
}