import fs from 'fs/promises';
import path from 'path';

const simpleDigitRegex = /\d/g;
const wordDigitRegex = /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g;

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

const nonEmptyMatchValue = (v: unknown) => v !== '';

const answer = (regex: RegExp) => inputLines
  .reduce((memo: number, current: string) => {
    const digits = [...current.matchAll(regex)];

    const firstMatch = digits[0];
    const lastMatch = digits.slice(-1)[0];
    const firstRawValue = firstMatch.find(nonEmptyMatchValue);
    const lastRawValue = lastMatch.find(nonEmptyMatchValue);

    const first = digitMapping[String(firstRawValue)] ?? firstRawValue;
    const last = digitMapping[String(lastRawValue)] ?? lastRawValue;
    const calibrationValue = `${first}${last}`;
    
    return memo + Number(calibrationValue);
  }, 0);

console.log('p1', answer(simpleDigitRegex));
console.log('p2', answer(wordDigitRegex));
