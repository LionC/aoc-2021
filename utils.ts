import { readLines } from "https://deno.land/std@0.117.0/io/mod.ts"

export const input = await readInput()

export async function readInput(): Promise<string[]> {
    const inputFile = await Deno.open("./input.txt")
    const lines = readLines(inputFile)
    const ret: string[] = []

    for await (const line of lines) {
        ret.push(line)
    }

    return ret
}

export function error(msg: string): never {
    throw new Error(msg)
}
