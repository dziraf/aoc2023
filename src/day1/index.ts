import fs from 'fs/promises';
import path from 'path';

const digitRegex = /(?=(one|two|three|four|five|six|seven|eight|nine|[1-9]))/g;
const digitMapping: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const inputFile = await fs.readFile(path.resolve(
  process.cwd(),
  'src/day1',
  'input.txt',
));
const inputText = inputFile.toString();
const inputLines = inputText.split(/\r?\n/g);

const answer1 = inputLines
  .reduce((memo: number, current: string) => {
    const digits = current.split('').filter((v) => Number.isInteger(Number(v)));

    const first = digits[0];
    const last = digits.slice(-1)[0] ?? first;
    const calibrationValue = `${first}${last}`;
    
    return memo + Number(calibrationValue);
  }, 0)

const answer2 = inputLines
  .reduce((memo: number, current: string) => {
    const digits = [...current.matchAll(digitRegex)];

    const firstMatch = digits[0];
    const lastMatch = digits.slice(-1)[0];

    const first = digitMapping[firstMatch?.[1]] ?? firstMatch?.[1];
    const last = digitMapping[lastMatch?.[1]] ?? lastMatch?.[1];
    const calibrationValue = `${first}${last}`;
    
    return memo + Number(calibrationValue);
  }, 0);

console.log('p1', answer1);
console.log('p2', answer2);
