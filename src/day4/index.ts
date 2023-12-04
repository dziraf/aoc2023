import { readInput } from '../utils/read-input.js';

const { lines: inputLines } = await readInput('day4');

const cards: any[] = [];

inputLines.forEach((current: string, index) => {
  const tokens = current.replace(/Card \d{1,}: /, '').split(' | ');
  const [winning, my] = tokens;

  const winningNumbers = winning.split(/\s{1}/g).filter(Boolean).map(Number);
  const myNumbers = my.split(/\s{1}/g).filter(Boolean).map(Number);

  cards.push([index + 1, winningNumbers, myNumbers]);
});

const getMatchingCards = ([id, winning, my]: [number, number[], number[]]) => {
  const matching = my.reduce((memo: number[], current: number) => {
    if (winning.includes(current)) {
      memo.push(current);
    }

    return memo;
  }, []);

  return matching;
};

const answer1 = () => {
  return cards.reduce((memo: number, card: any) => {
    const matching = getMatchingCards(card);

    return memo + (matching.length ?  Math.pow(2, matching.length - 1) : 0);
  }, 0);
};

const cache = cards.reduce((memo, card) => {
  memo[card[0]] = getMatchingCards(card);

  return memo;
}, {});

const cardsObj = cards.reduce((memo, card) => ({ ...memo, [card[0]]: card }), {});

const getSubsequentCards = (card: any) => {
  let result = 0;

  if (!card) return result;

  const [id] = card;
  result += cache[id].length;

  for (let i = id + 1; i <= id + cache[id].length; i++) {
    result += getSubsequentCards(cardsObj[i]);
  }

  return result;
}

const answer2 = () => {
  let result = 0;

  for (const card of cards) {
    result += getSubsequentCards(card) + 1;
  }

  return result;
}


console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
