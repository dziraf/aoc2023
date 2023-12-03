import fs from 'fs/promises';
import path from 'path';

// Technically I could use process.argv to find out day, but
// ts-node-esm messes up process.argv
export const readInput = async (day: string) => {
  const inputFile = await fs.readFile(path.resolve(
    process.cwd(),
    'src',
    day,
    'input.txt',
  ));
  const inputText = inputFile.toString();
  const inputLines = inputText.split(/\r?\n/g);

  return {
    rawText: inputText,
    lines: inputLines,
  };
};
