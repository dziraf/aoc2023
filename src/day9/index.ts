import { readInput } from "../utils/read-input.js";

const { lines: inputLines } = await readInput('day9');

const readings = inputLines.map((line) => line.split(' ').map(Number));

const sequenceFromHistory = (history: number[]) => {
  const sequence = [];

  for (let i = 1; i < history.length; i++) {
    sequence.push(history[i] - history[i - 1]);
  }

  return sequence;
}

const allSequencesFromHistory = (history: number[]): number[][] => {
  let currentSequence = history;
  const allSequences: number[][] = [currentSequence];

  while (!currentSequence.every((v) => v === 0)) {
    currentSequence = sequenceFromHistory(currentSequence);

    allSequences.push(currentSequence);
  }

  return allSequences;
}

const nextValueFromSequences = (sequences: number[][]) => {
  return sequences.reverse().reduce((memo, current) => memo + current.slice(-1)[0], 0);
}

const previousValueFromSequences = (sequences: number[][]) => {
  const originalSequences = sequences.reverse();
  return originalSequences.slice(1).reduce((memo, current) => {
    const v = current[0] - memo.slice(-1)[0];

    return [...memo, v];
  }, [0]).slice(-1)[0];
}

const answer1 = () => {
  let result = 0;

  for (const history of readings) {
    const sequences = allSequencesFromHistory(history);
    const nextValue = nextValueFromSequences(sequences);
    
    result += nextValue;
  }

  return result;
};

const answer2 = () => {
  let result = 0;

  for (const history of readings) {
    const sequences = allSequencesFromHistory(history);
    const previousValue = previousValueFromSequences(sequences);
    
    result += previousValue;
  }

  return result;
};

console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
