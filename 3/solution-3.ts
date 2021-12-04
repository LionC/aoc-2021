import { error, input } from "../utils.ts";
import { maxBy, minBy, partition } from "../deps.ts";

function parseBinaryNumber(bits: number[]): number {
  const joined = bits
    .map((it) => String(it))
    .join("");

  return parseInt(joined, 2);
}

const parsed = input
  .map((it) => it.split("").map((raw) => parseInt(raw)));

const gamma = parsed
  .reduce((acc, cur) => acc.map((num, index) => num + cur[index]))
  .map((count) => count > input.length / 2 ? 1 : 0);

const epsilon = gamma.map((bit) => bit === 1 ? 0 : 1);
const answer = parseBinaryNumber(epsilon) * parseBinaryNumber(gamma);

console.log(answer);

function calcLifeSupportRating(
  numbers: number[][],
  defaultBit: 0 | 1,
  index = 0,
): number[] {
  const choosePartition = defaultBit === 0 ? minBy : maxBy;
  const partitions = partition(numbers, (it) => it[index] === defaultBit);
  const chosen = choosePartition(partitions, (it) => it.length) ??
    error("Input emmpty");

  if (chosen.length === 1) {
    return chosen[0];
  }

  return calcLifeSupportRating(
    chosen,
    defaultBit,
    index + 1,
  );
}

const oxygen = calcLifeSupportRating(parsed, 1);
const co2 = calcLifeSupportRating(parsed, 0);

const answer2 = parseBinaryNumber(oxygen) * parseBinaryNumber(co2);

console.log(answer2);
