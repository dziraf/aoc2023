import {
  Worker,
  isMainThread,
} from 'worker_threads';

import { readInput } from "../../utils/read-input.js";

const { lines: inputLines } = await readInput("day5");

const textToTokens = (text) =>
  text.split(" ").map(Number);

const getData = async () => {
  let currentSection = null;
  const data = {};

  data.seeds = [textToTokens(inputLines[0].replace("seeds: ", ""))];
  for (const line of inputLines) {
    const m = line.match(
      /(seed-to-soil|soil-to-fertilizer|fertilizer-to-water|water-to-light|light-to-temperature|temperature-to-humidity|humidity-to-location)/g
    );
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
};

const data = await getData();

const getSeedRanges = (seeds, part) => {
  if (part === 1) {
    return seeds.reduce(
      (memo, seed) => [
        ...memo,
        { start: seed, end: seed },
      ],
      []
    );
  }

  return seeds.reduce((memo, current, i) => {
    if (i % 2 !== 0) return memo;
    if (!seeds[i + 1]) return memo;

    const start = current;
    const end = current + seeds[i + 1] - 1;
    memo.push({ start, end });

    return memo;
  }, []);
};

const seeds = getSeedRanges(data.seeds[0], 2);

let workers = 3;

if (isMainThread) {
  for (const id of Array.from({ length: workers }, (_, i) => i)) {
    new Worker('./src/day5/part2/answer.js', { workerData: { id, seeds, initialMin: id * 100000000, data } });
    console.log(`Starting worker: #${id + 1}`);
  }
}
