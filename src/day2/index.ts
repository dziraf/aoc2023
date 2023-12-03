import fs from 'fs/promises';
import path from 'path';

const inputFile = await fs.readFile(path.resolve(
  process.cwd(),
  'src/day2',
  'input.txt',
));
const inputText = inputFile.toString();
const inputLines = inputText.split(/\r?\n/g);

interface GameInfo {
  id: number;
  sets: {
    green?: number;
    red?: number;
    blue?: number;
  }[];
}

const games: GameInfo[] = inputLines.reduce((memo: any[], current, index) => {
  const cubeSetsTokens = current.replace(/Game \d{1,}: /, '').split(/; ?/);
  const sets = cubeSetsTokens.map((set) => {
    const cubeDraws = set.split(/, ?/);
    const countAndColorPairs = cubeDraws.map((d) => d.split(' '));

    return countAndColorPairs.reduce((o, [count, color]) => ({ ...o, [color]: Number(count) }), {});
  });

  const gameInfo = {
    id: index + 1,
    sets,
  };

  memo.push(gameInfo);
  return memo;
}, []);

const maxCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const colorExceedsMax = (sets: GameInfo['sets'], color: keyof GameInfo['sets'][0]) => {
  return sets.some((set) => (set[color] ?? 0) > maxCubes[color]);
};

const isGamePossible = (game: GameInfo) => {
  const { sets } = game;

  if (colorExceedsMax(sets, 'red')) return false;
  if (colorExceedsMax(sets, 'green')) return false;
  if (colorExceedsMax(sets, 'blue')) return false;

  return true;
};

const answer1 = () => {
  const possibleGames = games.filter(isGamePossible);

  return possibleGames.map(({ id }) => id).reduce((memo, id) => (memo + id), 0);
};

const minColor = (color: keyof GameInfo['sets'][0], sets: GameInfo['sets']) => {
  let minimum = Number.MIN_SAFE_INTEGER;
  for (const set of sets) {
    if (set[color] && set[color]! > minimum) minimum = set[color]!;
  }

  return minimum;
}

const answer2 = () => {
  return games.map(({ sets }) => {
    const minRed = minColor('red', sets);
    const minGreen = minColor('green', sets);
    const minBlue = minColor('blue', sets);

    return minRed * minGreen * minBlue;
  }).reduce((memo, v) => (memo + v), 0);
}

console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
