import { readInput } from '../utils/read-input.js';

const { lines: inputLines } = await readInput('day5');

const textToTokens = (text: string): [number, number, number] => text.split(' ').map(Number) as [number, number, number];

const getData = async () => {
  let currentSection = null;
  const data: Record<string, [number, number, number][]> = {};

  data.seeds = [textToTokens(inputLines[0].replace('seeds: ', ''))];
  for (const line of inputLines) {
    const m = line.match(/(seed-to-soil|soil-to-fertilizer|fertilizer-to-water|water-to-light|light-to-temperature|temperature-to-humidity|humidity-to-location)/g);
    if (m) currentSection = m[0];
    else if (currentSection && line.length) {
      if (data[currentSection]) {
        data[currentSection].push(textToTokens(line));
      } else {
        data[currentSection] = [textToTokens(line)];
      }
    }
  }

  return data;
}

const data = await getData();

const move = (from: number[], to: [number, number, number][]) => {
  const results = [];
  const checked = [];

  for (const coordinates of to) {
    const [dest, source, range] = coordinates;

    for (const loc of from) {
      if (loc >= source && loc <= source + range) {
        const newPos = (loc - source) + dest;
        results.push(newPos);
        checked.push(loc);
      }
    }
  }

  for (const loc of from) {
    if (!checked.includes(loc)) {
      results.push(loc);
    }
  }

  return results;
}

// console.log(data);

const makeAllMoves = (from: number[]) => {
  let result = [...from];

  result = move(result, data['seed-to-soil']);
  result = move(result, data['soil-to-fertilizer']);
  result = move(result, data['fertilizer-to-water']);
  result = move(result, data['water-to-light']);
  result = move(result, data['light-to-temperature']);
  result = move(result, data['temperature-to-humidity']);
  result = move(result, data['humidity-to-location']);

  result.sort();

  const min = result.reduce((memo, current) => Math.min(current, memo), Number.MAX_SAFE_INTEGER)

  return min;
}

const getInitialSeeds = (seeds: number[], part: number) => {
  if (part === 1) {
    return seeds.reduce(
      (memo: Record<string, number>[], seed: number) => ([...memo, { start: seed, end: seed } ]),
      [],
    );
  }

  return seeds.reduce((memo: Record<string, number>[], current, i) => {
    if (i % 2 !== 0) return memo;
    if (!seeds[i + 1]) return memo;

    const start = current;
    const end = current + seeds[i + 1] - 1;
    memo.push({ start, end });

    return memo;
  }, []);
}

const answer1 = () => {
  const seeds = data.seeds[0];
  
  return makeAllMoves(seeds);
}

const answer2 = () => {
  const seeds = data.seeds[0];
  const from = seeds.reduce((memo: Record<string, number>[], current, i) => {
    if (i % 2 !== 0) return memo;
    if (!seeds[i + 1]) return memo;

    const start = current;
    const end = current + seeds[i + 1] - 1;
    memo.push({ start, end });

    return memo;
  }, []);

  console.log(from);

  // return makeAllMoves(from);
}

console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
