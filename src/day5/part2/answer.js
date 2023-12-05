import {
  parentPort,
  workerData
} from 'worker_threads';

const destToSource = (from) => ([dest, source, range]) => from >= dest && from <= dest + range;

const move = (from, to) => {
  const spot = to.find(destToSource(from));

  if (spot) {
    const [dest, source] = spot;

    return from - dest + source;
  }

  return from;
};

const locationToSeed = (from, data) => {
  let result = from;

  let actions = [
    "seed-to-soil",
    "soil-to-fertilizer",
    "fertilizer-to-water",
    "water-to-light",
    "light-to-temperature",
    "temperature-to-humidity",
    "humidity-to-location",
  ].reverse();

  for (const action of actions) {
    result = move(result, data[action]);
  }

  return result;
};

const answer = () => {
  const { id, seeds, initialMin = 0, data } = workerData;
  console.time(`Worker ${id}`);

  let min = initialMin;

  while (true) {
    const seed = locationToSeed(min, data);

    if (seeds.some((s) => seed >= s.start && seed <= s.end)) {
      console.timeEnd(`Worker ${id}`);
      return min;
    }

    min++;
  }
}

console.log('P2.', answer());
