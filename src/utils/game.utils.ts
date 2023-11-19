export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export type PatternTypes = {
  anyLine: 'Any Line',
  diagonal: 'Diagonal',
  diamond: 'Diamond',
  coverAll: 'Coverall',
  cross: 'Cross',
  custom: 'Custom'
}

export const patternTypes: PatternTypes = {
  anyLine: 'Any Line',
  diagonal: 'Diagonal',
  diamond: 'Diamond',
  coverAll: 'Coverall',
  cross: 'Cross',
  custom: 'Custom'
}
export const getLetter = (number: number) => {
  if (number == 0) return 'BINGO'
  if (number <= 15) return 'B'
  if (number <= 30) return 'I'
  if (number <= 45) return 'N'
  if (number <= 60) return 'G'
  if (number <= 75) return 'O'
  return 'B'
}
export const getColor = (letter: string) => {
  switch (letter) {
    case "B":
      return 'blue';
    case "I":
      return 'red';
    case "N":
      return 'white';
    case "G":
      return 'green';
    case "O":
      return 'yellow';
    default:
      return 'white';
  }
}
export const getRandomBingoNumber = (start: number = 1, end: number = 75) => {
  return Math.floor(Math.random() * end) + start;
}

export const generateRandomNumbers = () => {
  const byteArray = new Uint8Array(1);
  const randomVals: number[] = [];

  while (randomVals.length < 75) {
    const randomVal = window.crypto.getRandomValues(byteArray)[0];
    if (randomVal > 0 && randomVal <= 75 && !randomVals.includes(randomVal)) {
      randomVals.push(randomVal);
    }
  }
  return randomVals
}
export type BoardItemType = {
  letter: string,
  color: string,
  number: number,
  display: string,
  called: boolean,
  active: boolean
}
export type BoardType = {
  B: BoardItemType[],
  I: BoardItemType[],
  N: BoardItemType[],
  G: BoardItemType[],
  O: BoardItemType[],
}

export const generateBingoBoard = (callsList = [] as number[]) => {
  const board: BoardType = {
    B: [],
    I: [],
    N: [],
    G: [],
    O: []
  };
  const letters = ["B", "I", "N", "G", "O"];
  let count = 1;
  letters.forEach(letter => {
    board[letter as keyof BoardType] = [];
    for (let i = 1; i <= 15; i++) {
      const obj = {
        letter: letter,
        color: getColor(letter),
        number: count,
        display: letter + count,
        called: callsList.includes(count),
        active: callsList[callsList.length - 1] === count
      }
      board[letter as keyof BoardType].push(obj);
      count++;
    }
  })


  return board;
}

export type TLastCall = {
  color: string,
  number: number,
  letter: string
}

export const getLast5Calls = (callsList: number[]) => {

  const last5Calls: TLastCall[] = []
  let filteredList: number[] = []
  if (!callsList) return filteredList
  if (callsList?.length > 5) {
    filteredList = callsList.slice(callsList.length - 6, callsList.length - 1)
  }
  else if (callsList.length > 1 && callsList.length <= 5) {
    filteredList = callsList.slice(0, callsList.length - 1)
  }
  filteredList.forEach((number) => {
    const letter = getLetter(number)
    const color = getColor(letter)
    last5Calls.push({ number, letter, color })
  })
  return last5Calls
}

export const getPresetPatterns = (pattern: string = '') => {
  switch (pattern) {
    case 'Diagonal':
      return ({
        value: "Diagonal",
        label: "Diagonal",
        unusedLetters: [],
        pattern: [
          [true, false, false, false, false],
          [false, true, false, false, false],
          [false, false, true, false, false],
          [false, false, false, true, false],
          [false, false, false, false, true],
        ]
      }
      )
    case 'Any Line':
      return ({
        value: "Any Line",
        label: "Any Line",
        unusedLetters: [],
        pattern: [
          [true, true, true, true, true],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
        ]
      }
      )
    case 'Coverall':
      return ({
        value: "Coverall",
        label: "Coverall",
        unusedLetters: [],
        pattern: [
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
        ]
      })
    case 'Cross':
      return ({
        value: "Cross",
        label: "Cross",
        unusedLetters: [],
        pattern: [
          [false, true, false, false, false],
          [false, true, false, false, false],
          [true, true, true, true, true],
          [false, true, false, false, false],
          [false, true, false, false, false],
        ]
      }
      )
    case 'Diamond':
      return ({
        value: "Diamond",
        label: "Diamond",
        unusedLetters: [],
        pattern: [
          [false, false, true, false, false],
          [false, true, false, true, false],
          [true, false, false, false, true],
          [false, true, false, true, false],
          [false, false, true, false, false],
        ]
      }
      )
    case 'Diamond Filled':
      return ({
        value: "Diamond Filled",
        label: "Diamond Filled",
        unusedLetters: [],
        pattern: [
          [false, false, true, false, false],
          [false, true, true, true, false],
          [true, true, true, true, true],
          [false, true, true, true, false],
          [false, false, true, false, false],
        ]
      }
      )
    case 'Diamond Inside':
      return ({
        value: "Diamond Inside",
        label: "Diamond Inside",
        unusedLetters: ["B", "O"],
        pattern: [
          [false, false, false, false, false],
          [false, false, true, false, false],
          [false, true, true, true, false],
          [false, false, true, false, false],
          [false, false, false, false, false],
        ]
      }
      )
    case 'Double Bingo':
      return ({
        value: "Double Bingo",
        label: "Double Bingo",
        unusedLetters: [],
        pattern: [
          [false, false, true, false, false],
          [true, true, true, true, true],
          [false, false, true, false, false],
          [false, false, true, false, false],
          [false, false, true, false, false],
        ]
      }
      )
    case 'Double X':
      return ({
        value: "Double X",
        label: "Double X",
        unusedLetters: [],
        pattern: [
          [true, false, true, false, false],
          [false, true, false, false, false],
          [true, false, true, false, true],
          [false, false, false, true, false],
          [false, false, true, false, true],
        ]
      }
      )
    case 'Flag':
      return ({
        value: "Flag",
        label: "Flag",
        unusedLetters: [],
        pattern: [
          [true, true, true, true, true],
          [true, true, true, false, false],
          [true, true, true, false, false],
          [true, true, true, false, false],
          [true, true, true, false, false],
        ]
      }
      )
    case 'Four Corners':
      return ({
        value: "Four Corners",
        label: "Four Corners",
        unusedLetters: ["I", "N", "G"],
        pattern: [
          [true, false, false, false, true],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [true, false, false, false, true],
        ]
      }
      )
    case 'Ladder':
      return ({
        value: "Ladder",
        label: "Ladder",
        unusedLetters: ["B", "O"],
        pattern: [
          [false, false, false, false, false],
          [true, true, true, true, true],
          [false, true, false, true, false],
          [true, true, true, true, true],
          [false, false, false, false, false],
        ]
      }
      )
    case 'One Away':
      return ({
        value: "One Away",
        label: "One Away",
        unusedLetters: [],
        pattern: [
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, false, true],
          [true, true, true, true, true],
        ]
      }
      )
    case 'Plus Sign':
      return ({
        value: "Plus Sign",
        label: "Plus Sign",
        unusedLetters: [],
        pattern: [
          [false, false, true, false, false],
          [false, false, true, false, false],
          [true, true, true, true, true],
          [false, false, true, false, false],
          [false, false, true, false, false],
        ]
      }
      )
    default:
      return ({
        value: "Custome",
        label: "Custome",
        unusedLetters: [],
        pattern: [
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
        ]
      })
  }
}