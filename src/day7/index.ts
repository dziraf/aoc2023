import { readInput } from '../utils/read-input.js';

const { lines: inputLines } = await readInput('day7');

let PART = 1;

const input = inputLines.reduce((memo: [string, number][], current: string) => {
  const [hand, bidString] = current.split(' ');

  return [...memo, [hand, Number(bidString)]] as [string, number][];
}, []);

const strongestToWeakest = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const HandType = {
  FiveOfAKind: 'five-of-a-kind',
  FourOfAKind: 'four-of-a-kind',
  FullHouse: 'full-house',
  ThreeOfAKind: 'three-of-a-kind',
  TwoPair: 'two-pair',
  OnePair: 'one-pair',
  HighCard: 'high-card',
};

const handTypeStrongestToWeakest = Object.values(HandType);

const cardStrength = (card: string) => {
  if (PART === 2) {
    if (card === 'J') return -1;
    return strongestToWeakest.length - strongestToWeakest.indexOf(card);
  }

  return strongestToWeakest.length - strongestToWeakest.indexOf(card);
}

const handTypeStrength = (type: string) => handTypeStrongestToWeakest.length - handTypeStrongestToWeakest.indexOf(type);

const determineHand = (hand: string) => {
  let cardOccurrences = hand.split('').reduce((memo: Record<string, number>, curr: string) => {
    if (memo[curr]) memo[curr] += 1;
    else memo[curr] = 1;
  
    return memo;
  }, {});

  if (PART === 2 && cardOccurrences['J']) {
    let copy = { ...cardOccurrences };
    const copyEntries = Object.entries(copy).sort(([_1, v1], [_2, v2]) => v2 - v1).filter(([c]) => c !== 'J');

    if (copyEntries.length > 0) {
      copyEntries[0] = [copyEntries[0][0], copyEntries[0][1] + cardOccurrences['J']];

      cardOccurrences = copyEntries.reduce((memo: Record<string, number>, [card, occurrences]) => {
        memo[card] = occurrences;
  
        return memo;
      }, {})
    }
  }

  const cardsNum = Object.keys(cardOccurrences).length;
  if (cardsNum === 1) {
    return {
      type: HandType.FiveOfAKind,
      of: hand.charAt(0),
      strength: cardStrength(hand.charAt(0))
    }
  }

  const fourOfKind = Object.entries(cardOccurrences).find(([card, occurrences]) => occurrences === 4);
  if (fourOfKind) {
    return {
      type: HandType.FourOfAKind,
      of: fourOfKind[0],
      strength: cardStrength(fourOfKind[0]),
    }
  }

  const cardsValues = Object.values(cardOccurrences);
  const isFullHouse = cardsValues.includes(2) && cardsValues.includes(3);
  if (isFullHouse) {
    const ofCards = Object.entries(cardOccurrences).map(([card, occurences]) => ({
      type: HandType.HighCard,
      strength: cardStrength(card),
      of: card,
    }));
    return {
      type: HandType.FullHouse,
      of: ofCards,
      strength: ofCards.reduce((memo, { strength }) => memo + strength, 0),
    }
  }

  const threeOfKind = Object.entries(cardOccurrences).find(([card, occurrences]) => occurrences === 3);
  if (threeOfKind) {
    return {
      type: HandType.ThreeOfAKind,
      of: threeOfKind[0],
      strength: cardStrength(threeOfKind[0]),
    }
  }

  const isTwoPair = cardsValues.filter((v) => v === 2).length === 2;
  const isOnePair = cardsValues.filter((v) => v === 2).length === 1;
  if (isOnePair || isTwoPair) {
    const ofCards = Object.entries(cardOccurrences).filter(([_, v]) => v === 2).map(([card, occurences]) => ({
      type: HandType.HighCard,
      strength: cardStrength(card),
      of: card,
    }));
    return {
      type: isTwoPair ? HandType.TwoPair : HandType.OnePair,
      of: ofCards,
      strength: ofCards.reduce((memo, { strength }) => memo + strength, 0),
    }
  }

  const entries = Object.entries(cardOccurrences).sort(([card1], [card2]) => cardStrength(card2) - cardStrength(card1));
  const highCard = entries[0][0];

  return {
    type: HandType.HighCard,
    of: highCard,
    strength: cardStrength(highCard),
  };
}

const compareHands = (hand1: string, hand2: string) => {
  const hand1Info = determineHand(hand1);
  const hand2Info = determineHand(hand2);
  const handTypeStrength1 = handTypeStrength(hand1Info.type);
  const handTypeStrength2 = handTypeStrength(hand2Info.type);

  if (handTypeStrength1 > handTypeStrength2) return -1;
  if (handTypeStrength2 > handTypeStrength1) return 1;

  for (let i = 0; i < hand1.length; i++) {
    const card1 = cardStrength(hand1.charAt(i));
    const card2 = cardStrength(hand2.charAt(i));

    if (card1 > card2) return -1;
    if (card2 > card1) return 1;
  }

  return 0;
}

const answer1 = () => {
  PART = 1;
  const sorted = [...input].sort(([h1], [h2]) => compareHands(h1, h2));
  return sorted.reverse().reduce((memo, [_, bid], i) => memo + bid * (i + 1), 0);
};

const answer2 = () => {
  PART = 2;
  const sorted = [...input].sort(([h1], [h2]) => compareHands(h1, h2));
  return sorted.reverse().reduce((memo, [_, bid], i) => memo + bid * (i + 1), 0);
};

console.log('Part 1. ', answer1());
console.log('Part 2. ', answer2());
