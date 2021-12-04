import { readInput } from "../utils.ts";
import { slidingWindows, sumOf } from "../deps.ts";

const input = await readInput();
const numbers = input.map((it) => parseInt(it));
const answer = slidingWindows(numbers, 2)
  .filter(([a, b]) => a < b)
  .length;

console.log(answer);

const windows = slidingWindows(numbers, 3)
  .map((it) => sumOf(it, (it) => it));
const answer2 = slidingWindows(windows, 2)
  .filter(([a, b]) => a < b)
  .length;

console.log(answer2);
