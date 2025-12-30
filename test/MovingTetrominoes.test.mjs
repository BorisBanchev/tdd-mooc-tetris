import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

function fallToBottom(board) {
  for (let i = 0; i < 10; i++) {
    board.tick()
  }
}
function moveToLeftCorner(board) {
  for (let i = 0; i < 10; i++) {
    board.moveLeft()
  }
}
function moveToRightCorner(board) {
  for (let i = 0; i < 10; i++) {
    board.moveRight()
  }
}
describe("Moving falling tetrominoes", () => {
  let board
  beforeEach(() => {
    board = new Board(10, 6)
  })
  test("start from the top middle", () => {
    board.drop(Tetromino.T_SHAPE);

    expect(board.toString()).to.equalShape(
      `....T.....
       ...TTT....
       ..........
       ..........
       ..........
       ..........`
    );
  });
  test("a falling tetromino can be moved left", () => {
    board.drop(Tetromino.T_SHAPE)
    board.moveLeft()
    expect(board.toString()).to.equalShape(
      `...T......
       ..TTT.....
       ..........
       ..........
       ..........
       ..........`
    )
  })
  test("a falling tetromino can be moved right", () => {
    board.drop(Tetromino.T_SHAPE);
    board.moveRight();

    expect(board.toString()).to.equalShape(
      `.....T....
       ....TTT...
       ..........
       ..........
       ..........
       ..........`
    );
  });
  test("a falling tetromino can be moved down", () => {
    board.drop(Tetromino.T_SHAPE);
    board.moveDown();

    expect(board.toString()).to.equalShape(
      `..........
       ....T.....
       ...TTT....
       ..........
       ..........
       ..........`
    );
  });
  test("it cannot be moved left beyond the board", () => {
    board.drop(Tetromino.T_SHAPE);
    for (let i = 0; i < 10; i++) board.moveLeft();
    expect(board.toString()).to.equalShape(
      `.T........
       TTT.......
       ..........
       ..........
       ..........
       ..........`
    );
  });
  test("it cannot be moved right beyond the board", () => {
    board.drop(Tetromino.T_SHAPE);
    for (let i = 0; i < 10; i++) board.moveRight();
    expect(board.toString()).to.equalShape(
      `........T.
       .......TTT
       ..........
       ..........
       ..........
       ..........`
    );
  });
  test("it cannot be moved down beyond the board (will stop falling)", () => {
    board.drop(Tetromino.T_SHAPE);
    for (let i = 0; i < 10; i++) board.moveDown();
    expect(board.toString()).to.equalShape(
      `..........
       ..........
       ..........
       ..........
       ....T.....
       ...TTT....`
    );
    expect(board.hasFalling()).to.equal(false);
  });
  test("it cannot be moved left through other blocks", () => {
    board.drop(Tetromino.T_SHAPE)
    moveToLeftCorner(board)
    fallToBottom(board)
    board.drop(Tetromino.T_SHAPE)
    moveToLeftCorner(board)
    fallToBottom(board)
    board.drop(Tetromino.T_SHAPE)
    moveToLeftCorner(board)
    fallToBottom(board)
    board.drop(Tetromino.T_SHAPE)
    moveToLeftCorner(board)
    expect(board.toString()).to.equalShape(
      `.T..T.....
       TTTTTT....
       .T........
       TTT.......
       .T........
       TTT.......`
    );
  })
})