import fs from 'fs/promises';
import path from 'path';

const inputFile = await fs.readFile(path.resolve(
  process.cwd(),
  'src/day3',
  'input.txt',
));
const inputText = inputFile.toString();
const inputLines = inputText.split(/\r?\n/g);

interface DataElement {
  startIndex: number;
  endIndex: number;
  row: number;
}

interface SymbolElement extends DataElement { value: string }
interface NumberElement extends DataElement { value: number }

const allNumbers: NumberElement[] = [];
const allSymbols: SymbolElement[] = [];

inputLines.forEach((current: string, index) => {
  const numMatches = [...current.matchAll(/\d{1,}/g)];
  const symbolMatches = [...current.matchAll(/(?![a-zA-Z\d\s\.])./g)];

  const currentNums = numMatches.map((m) => ({ value: Number(m[0]), startIndex: m.index!, endIndex: (m.index ?? 0) + m[0].length, row: index }));
  const currentSymbols = symbolMatches.map((m ) => ({ value: m[0], startIndex: m.index!, endIndex: (m.index ?? 0) + m[0].length, row: index }));

  allNumbers.push(...currentNums);
  allSymbols.push(...currentSymbols);
});

const asteriskSymbols = allSymbols.filter(({ value }) => value === '*');


const symbolsSurroundingANumber = (element: NumberElement, symbols: SymbolElement[]) => {
  const { startIndex, endIndex, row } = element;

  return symbols.filter((symbol) => {
    // Left
    if (symbol.row === row && symbol.startIndex === startIndex - 1) return true;
    // Right
    if (symbol.row === row && symbol.startIndex === endIndex) return true;
    // Up
    if (symbol.row === row - 1 && symbol.startIndex >= (startIndex - 1) && symbol.startIndex <= endIndex) return true;
    // Down
    if (symbol.row === row + 1 && symbol.startIndex >= (startIndex - 1) && symbol.startIndex <= endIndex) return true;

    return false;
  })
}

const answer1 = () => allNumbers.filter((el) => symbolsSurroundingANumber(el, allSymbols)?.length > 0).reduce((memo, { value }) => (memo + value), 0);

const answer2 = () => {
  const matchingSymbols: Record<string, NumberElement[]> = {};

  allNumbers.forEach((numberElement) => {
    const surroundingSymbols = symbolsSurroundingANumber(numberElement, asteriskSymbols);
    surroundingSymbols.forEach(({ startIndex, row}) => {
      const key = `${row}-${startIndex}`;
      if (matchingSymbols[key]) matchingSymbols[key].push(numberElement);
      else matchingSymbols[key] = [numberElement];
    })
  });

  return Object.entries(matchingSymbols).reduce((memo, [key, numbers]) => {
    if (numbers.length === 2) {
      return memo + numbers.reduce((m, v) => (m * v.value), 1);
    } else {
      return memo;
    }
  }, 0);
}

console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
