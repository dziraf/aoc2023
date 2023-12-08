import { readInput } from "../utils/read-input.js";

const { lines: inputLines } = await readInput('day8');

const directions = inputLines[0].split('');
const directionsIndexMap = {
  L: 0,
  R: 1
} as const;

const desertMap = inputLines.slice(2).reduce((memo: Record<string, [string, string]>, current) => {
  const [node, options] = current.split(' = ');

  memo[node] = options.replace('(', '').replace(')', '').split(', ') as [string, string];

  return memo;
}, {});

const gcd = (a: number, b: number): number => {
  if (b === 0) return a;
  return gcd(b, a % b);
}

const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
}

const answer1 = () => {
  const end = 'ZZZ';
  let currentNode = 'AAA';
  let moves = 0;

  while (true) {
    const i = moves % directions.length;
    const moveType = directions[i] as 'L' | 'R';
    const options = desertMap[currentNode];
    const nextNode = options[directionsIndexMap[moveType]];

    currentNode = nextNode;
    moves++;

    if (currentNode === end) return moves;
  }
}

const answer2 = () => {
  const currentNodes = Object.keys(desertMap).filter((key) => key.endsWith('A'));
  const movesList = [];

  for (let n = 0; n < currentNodes.length; n++) {
    let moves = 0;
    let currentNode = currentNodes[n];

    while (!currentNode.endsWith('Z')) {
      const i = moves % directions.length;
      const moveType = directions[i] as 'L' | 'R';
      const options = desertMap[currentNode];
      const nextNode = options[directionsIndexMap[moveType]];
      currentNode = nextNode;

      moves++
    }

    movesList.push(moves);
  }

  return movesList.reduce((acc, curr) => lcm(acc, curr), 1);
}

console.time('answer1');
console.log('Part 1. ', answer1());
console.timeEnd('answer1');

console.time('answer2');
console.log('Part 2. ', answer2());
console.timeEnd('answer2');
