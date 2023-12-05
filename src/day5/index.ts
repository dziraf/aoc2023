import { readInput } from "../utils/read-input.js";

const { lines: inputLines } = await readInput("day5");

interface Range {
  start: number;
  end: number;
}

const textToTokens = (text: string): [number, number, number] =>
  text.split(" ").map(Number) as [number, number, number];

const getData = async () => {
  let currentSection = null;
  const data: Record<string, [number, number, number][]> = {};

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

const sourceToDest = (from: number) => ([dest, source, range]: [number, number, number]) => from >= source && from <= source + range;
const destToSource = (from: number) => ([dest, source, range]: [number, number, number]) => from >= dest && from <= dest + range;

const move = (from: number, to: [number, number, number][], part: 1 | 2) => {
  const spot = to.find(part === 1 ? sourceToDest(from) : destToSource(from));

  if (spot) {
    const [dest, source] = spot;

    if (part === 1) {
      return from - source + dest;
    }
    return from - dest + source;
  }

  return from;
};

const finalLocation = (part: 1 | 2) => (from: number) => {
  let result = from;

  let actions = [
    "seed-to-soil",
    "soil-to-fertilizer",
    "fertilizer-to-water",
    "water-to-light",
    "light-to-temperature",
    "temperature-to-humidity",
    "humidity-to-location",
  ];

  if (part === 2) {
    actions = actions.reverse();
  }

  for (const action of actions) {
    result = move(result, data[action], part);
  }

  return result;
};

const seedToLocation = finalLocation(1);
const locationToSeed = finalLocation(2);

const getSeedRanges = (seeds: number[], part: 1 | 2): Range[] => {
  if (part === 1) {
    return seeds.reduce(
      (memo: Range[], seed: number) => [
        ...memo,
        { start: seed, end: seed },
      ],
      []
    );
  }

  return seeds.reduce((memo: Range[], current, i) => {
    if (i % 2 !== 0) return memo;
    if (!seeds[i + 1]) return memo;

    const start = current;
    const end = current + seeds[i + 1] - 1;
    memo.push({ start, end });

    return memo;
  }, []);
};

const answer1 = () => {
  const seeds = getSeedRanges(data.seeds[0], 1);

  let min = Number.MAX_SAFE_INTEGER;
  for (const range of seeds) {
    const { start, end } = range;

    for (let loc = start; loc <= end; loc++) {
      min = Math.min(seedToLocation(loc), min);
    }
  }

  return min;
};

const answer2 = () => {
  const seeds = getSeedRanges(data.seeds[0], 2);
  let min = 0;

  while (true) {
    const seed = locationToSeed(min);

    if (seeds.some((s) => seed >= s.start && seed <= s.end)) {
      return min;
    }

    min++;
  }
}

console.time("P1");
console.log("Part 1. ", answer1());
console.timeEnd("P1");

console.time("P2");
console.log("Part 2. ", answer2());
console.timeEnd("P2");
