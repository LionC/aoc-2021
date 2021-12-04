import { input } from "../utils.ts"
import { partition, sumOf } from "../deps.ts"

function sumMoves(moves: (readonly [string, number])[]): number {
    return sumOf(moves, ([_, it]) => it)
}

const moves = input
    .map(line => line.split(" "))
    .map(([direction, amountRaw]) => [direction, parseInt(amountRaw)] as const)

const [hMoves, vMoves] = partition(moves, ([direction]) => direction === "forward")
const [upMoves, downMoves] = partition(vMoves, ([direction]) => direction === "up")

const answer = (sumMoves(downMoves) - sumMoves(upMoves)) * sumMoves(hMoves)

console.log(answer)

const [depth, horizontalPos] = moves
    .reduce<[number, number, number]>(
        ([vPos, hPos, aim], [direction, amount]) => {
            switch (direction) {
                case "down":
                    return [vPos, hPos, aim + amount]
                case "up":
                    return [vPos, hPos, aim - amount]
                default:
                    return [vPos + amount * aim, hPos + amount, aim]
            }
        },
        [0, 0, 0],
    )

console.log(depth * horizontalPos)
