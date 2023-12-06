import { readInput } from '../utils/read-input.js';

const { lines: inputLines } = await readInput('day6');

interface RaceInfo {
  time: number;
  distance: number;
}

const times = inputLines[0].replace('Time:', '').trim().split(/\s+/).map(Number);
const distances = inputLines[1].replace('Distance:', '').trim().split(/\s+/).map(Number);

const answer1 = () => {
  const data = times.reduce((memo: RaceInfo[], time: number, i) => {
    const o = { time, distance: distances[i] };
    return [...memo, o];
  }, []);

  const results = data.reduce((memo: number[][], current: RaceInfo) => {
    const { time: maxTime, distance: distanceToBeat } = current;
    let chargingTime = 0;

    const results = [];
    while(chargingTime <= maxTime) {
      const speed = chargingTime;
      const timeLeft = maxTime - chargingTime;
      const distanceTravelled = speed * timeLeft;

      if (distanceTravelled > distanceToBeat) results.push(chargingTime);
      chargingTime++;
    }

    memo.push(results);

    return memo;
  }, []);

  return results.reduce((memo, v) => (memo * v.length), 1);
}

const answer2 = () => {
  const data = times
    .reduce((memo: [string, string], time: number, i) => {
      const t = `${memo[0]}${time}`;
      const d = `${memo[1]}${distances[i]}`;

      return [t, d] as [string, string];
    }, ['', '']).map(Number);

  const [maxTime, distanceToBeat] = data;
  let chargingTime = 0;
  let result = 0;

  while(chargingTime <= maxTime) {
    const speed = chargingTime;
    const timeLeft = maxTime - chargingTime;
    const distanceTravelled = speed * timeLeft;

    if (distanceTravelled > distanceToBeat) result++;
    chargingTime++;
  }

  return result;
}

console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
