import { readInput } from "../utils/read-input.js";

const { lines: inputLines } = await readInput("day10");

const grid: string[][] = inputLines.map((line) => line.split(""));

const directions = {
  "-": [
    [0, -1],
    [0, 1],
  ],
  "7": [
    [0, -1],
    [1, 0],
  ],
  J: [
    [-1, 0],
    [0, -1],
  ],
  "|": [
    [-1, 0],
    [1, 0],
  ],
  L: [
    [-1, 0],
    [0, 1],
  ],
  F: [
    [1, 0],
    [0, 1],
  ],
  ".": [],
  S: [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ],
} as const;

const getAvailableMoves = (
  currentCoordinates: readonly [number, number]
): [number, number][] => {
  const [row, col] = currentCoordinates;
  const currentElement = grid[row][col] as DirectionSymbol;

  const moves = directions[currentElement]
    .map((move) => {
      const [r, c] = move;

      if (
        row + r < 0 ||
        col + c < 0 ||
        row + r >= grid.length ||
        col + c >= grid[row].length
      )
        return null;

      const nextValue = grid[row + r][col + c];
      if (nextValue === "." || typeof nextValue === "undefined") return null;

      if (currentElement === 'S') {
        const coords = [row + r, col + c] as const;
        const nearbyNodeMoves = getAvailableMoves(coords);
        if (nearbyNodeMoves.some(([mR, mC]) => mR === row && mC === col)) {
          return coords;
        }

        return null;
      }

      return [row + r, col + c] as [number, number];
    })
    .filter((m) => m !== null);

  return moves as [number, number][];
};

type DirectionSymbol = keyof typeof directions;
interface GridPos {
  symbol: DirectionSymbol;
  directions: [number, number][];
  pos: [number, number];
  distance: number | null;
}
interface GridNode {
  pos: [number, number];
  distance: number;
}

const mappedGrid: GridPos[][] = grid.reduce(
  (memo: GridPos[][], columns, row) => {
    const mappedColumns = columns.map((v, col) => ({
      symbol: v as DirectionSymbol,
      directions: getAvailableMoves([row, col]),
      pos: [row, col] as [number, number],
      distance: null,
    }));

    memo.push(mappedColumns);

    return memo;
  },
  []
);

const getStart = (): GridNode => {
  const sRow = mappedGrid.findIndex((row) => row.some((c) => c.symbol === "S"));
  return mappedGrid[sRow].find((c) => c.symbol === "S") as GridNode;
};

const answer1 = () => {
  let stack: GridNode[] = [];

  const start = getStart();
  start.distance = 0;
  stack.push(start);

  while (stack.length) {
    const node = stack.shift()!;
    const {
      pos: [row, col],
      distance,
    } = node;

    if (
      mappedGrid[row][col].distance === null ||
      (mappedGrid[row][col].distance as number) >= distance
    ) {
      mappedGrid[row][col].distance = distance;

      mappedGrid[row][col].directions.forEach((move) => {
        stack.push({
          pos: move,
          distance: distance + 1,
        });
      });
    }
  }

  const distances = mappedGrid.flat().map((n) => (n.distance === null ? 0 : n.distance));

  return Math.max(...distances);
};

console.log("Part 1.", answer1());
