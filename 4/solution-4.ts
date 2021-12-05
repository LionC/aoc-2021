import { input, parseNumber } from "../utils.ts";
import { chunk } from "../deps.ts";
import "https://cdn.skypack.dev/@tensorflow/tfjs-backend-cpu";
import * as tf from "https://cdn.skypack.dev/@tensorflow/tfjs-core";

await tf.ready();

// Parse input

const BOARD_SIZE = 5;
const [drawLine, _, ...boardLines] = input;

const draws = drawLine
  .split(",")
  .map(parseNumber);

const parsedBoardLines = boardLines
  .filter((it) => it.length > 0)
  .map((it) =>
    it
      .trim()
      .split(/\s+/)
      .map(parseNumber)
  );

const chunked = chunk(parsedBoardLines, BOARD_SIZE);
const boardCount = chunked.length;

// Solve

const boards = tf.tensor3d(chunked);
let boardChecks = tf.fill(boards.shape, false);

function hasBoardWon(board: tf.Tensor): boolean {
  const rows = tf.split(board, BOARD_SIZE, 0);
  const columns = tf.split(board, BOARD_SIZE, 1);

  return [...rows, ...columns]
    .map((it: tf.Tensor) => tf.squeeze(it))
    .map((it: tf.Tensor) => tf.all(it).arraySync())
    .some((it: number) => it === 1);
}

const boardsDone = new Array<boolean>(boardCount).fill(false);
let winnerCount = 0;
let firstBoardWon = false;

for (const draw of draws) {
  const drawTensor = tf.fill(boards.shape, draw);
  const hits = tf.equal(drawTensor, boards);
  boardChecks = tf.logicalOr(boardChecks, hits);

  const unstacked = tf.unstack(boardChecks) as tf.Tensor[];
  const wonIndexes = unstacked
    .map((it, index) => [index, it] as const)
    .filter(([index]) => !boardsDone[index])
    .filter(([_, it]) => hasBoardWon(it))
    .map(([index]) => index);

  for (const wonIndex of wonIndexes) {
    boardsDone[wonIndex] = true;
    winnerCount += 1;

    if (firstBoardWon && winnerCount !== boardCount) {
      continue;
    }

    firstBoardWon = true;

    const [winnerBoard, winnerChecks] = [boards, boardChecks]
      .map((it) => tf.slice3d(it, wonIndex, [1]))
      .map((it) => tf.squeeze(it));

    const masked = await tf.booleanMaskAsync(
      winnerBoard,
      tf.logicalNot(winnerChecks),
    );
    const sum = tf.sum(masked).arraySync();

    console.log(sum * draw);
  }
}
