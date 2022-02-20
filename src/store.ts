import create from 'zustand'
import { persist } from 'zustand/middleware'
import { computeGuess, getRandomWord, LetterState } from './word-utils'

export const NUMBER_OF_GUESSES = 6
export const WORD_LENGTH = 5
export const GUESS_LENGTH = 6

interface GuessRow {
  guess: string
  result?: LetterState[]
}

interface StoreState {
  answer: string
  rows: GuessRow[]
  gameState: 'playing' | 'won' | 'lost'
  keyboardLetterState: { [letter: string]: LetterState }
  addGuess: (guess: string) => void
  newGame: (intialGuess?: string[]) => void
}

export const useStore = create<StoreState>(
  persist(
    (set, get) => {
      function addGuess(guess: string) {
        const result = computeGuess(guess, get().answer)
        const didWin = result.every((i) => i === LetterState.Match)

        const rows = [
          ...get().rows,
          {
            guess,
            result,
          },
        ]

        const keyboardLetterState = get().keyboardLetterState
        result.forEach((r, index) => {
          const resultGuessLetter = guess[index]

          const currentLetterState = keyboardLetterState[resultGuessLetter]
          switch (currentLetterState) {
            case LetterState.Match:
              break
            case LetterState.Present:
              if (r === LetterState.Miss) {
                break
              }
            default:
              keyboardLetterState[resultGuessLetter] = r
              break
          }
        })

        set(() => ({
          rows,
          keyboardLetterState,
          gameState: didWin
            ? 'won'
            : rows.length === GUESS_LENGTH
            ? 'lost'
            : 'playing',
        }))
      }
      return {
        answer: getRandomWord(),
        rows: [],
        keyboardLetterState: {},
        gameState: 'playing',
        addGuess,
        newGame: (initialRows = []) => {
          set({
            answer: getRandomWord(),
            gameState: 'playing',
            rows: [],
            keyboardLetterState: {},
          })
          initialRows.forEach(addGuess)
        },
      }
    },

    {
      name: 'reacdle',
      getStorage: () => localStorage,
    }
  )
)

// useStore.persist.clearStorage()

export const answerSelector = (state: StoreState) => state.answer
