import { input } from "../utils.ts"
import { mapKeys, sumOf } from "../deps.ts"

const DAYS_TO_SIMULATE = 256

let generations = input[0]
    .split(",")
    .reduce<{ [age: string]: number }>(
        (acc, cur) => ({
            ...acc,
            [cur]: (acc[cur] ?? 0) + 1,
        }),
        {},
    )

for (let i = 0; i < DAYS_TO_SIMULATE; i++) {
    const birthed = generations["0"] ?? 0
    delete generations["0"]
    generations["7"] = birthed + (generations["7"] ?? 0)
    generations = mapKeys(generations, it => String(Number(it) - 1))
    generations["8"] = birthed
}

const answer = sumOf(
    Object.values(generations),
    it => it,
)

console.log(answer)
