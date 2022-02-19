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

        set(() => ({
          rows,
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
        gameState: 'playing',
        addGuess,
        newGame: (initialRows = []) => {
          set({
            answer: getRandomWord(),
            gameState: 'playing',
            rows: [],
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
