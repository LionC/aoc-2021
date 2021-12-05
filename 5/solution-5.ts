import { error, input, parseNumber } from "../utils.ts";
import { mapValues, partition } from "../deps.ts";

type Point = Readonly<{
  x: number;
  y: number;
}>;

const points: { [key: string]: Point } = {};
const pointsToLines = new Map<Point, Set<Point[]>>();

function pointOf(x: number, y: number): Point {
  const key = `${x},${y}`;

  return points[key] ?? (points[key] = { x, y });
}

type Line = {
  diagonal: boolean;
  line: Point[];
};
function getPointsBetween(
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point,
): Line {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  const vector = {
    x: Math.sign(xDiff),
    y: Math.sign(yDiff),
  };

  const steps = Array.from<number>({
    length: Math.max(
      Math.abs(xDiff),
      Math.abs(yDiff),
    ) + 1,
  });

  const line = steps.map((_, index) =>
    pointOf(
      x1 + vector.x * index,
      y1 + vector.y * index,
    )
  );

  const diagonal = xDiff !== 0 && yDiff !== 0;

  return { line, diagonal };
}

const lines = input
  .map((it) => /^(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)$/u.exec(it))
  .map((it) =>
    mapValues(
      it?.groups ?? error("Input did not match format"),
      parseNumber,
    )
  )
  .map(({ x1, x2, y1, y2 }) =>
    getPointsBetween(
      pointOf(x1, y1),
      pointOf(x2, y2),
    )
  );

const [diagonalLines, straightLines] = partition(lines, (it) => it.diagonal);

function registerLines(lines: Line[]) {
  lines.forEach(({ line }) => {
    line.forEach((point) => {
      pointsToLines.get(point)?.add(line) ??
        pointsToLines.set(point, new Set([line]));
    });
  });
}

function getIntersectionCount(): number {
  return [...pointsToLines.values()]
    .filter((it) => it.size > 1)
    .length;
}

registerLines(straightLines);
console.log(getIntersectionCount());

registerLines(diagonalLines);
console.log(getIntersectionCount());
