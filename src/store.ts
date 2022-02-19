import create from 'zustand'
import { persist } from 'zustand/middleware'
import { computeGuess, getRandomWord, LetterState } from './word-utils'

export const NUMBER_OF_GUESSES = 6
export const WORD_LENGTH = 5

interface GuessRow {
  guess: string
  result?: LetterState[]
}

interface StoreState {
  answer: string
  rows: GuessRow[]
  addGuess: (guess: string) => void
  newGame: () => void
}

export const useStore = create<StoreState>(
  persist(
    (set, get) => ({
      answer: getRandomWord(),
      rows: [],
      addGuess: (guess: string) => {
        set((state) => ({
          rows: [
            ...state.rows,
            {
              guess,
              result: computeGuess(guess, state.answer),
            },
          ],
        }))
      },
      newGame: () => {
        set({
          answer: getRandomWord(),
          rows: [],
        })
      },
    }),

    {
      name: 'reacdle',
      getStorage: () => localStorage,
    }
  )
)

// useStore.persist.clearStorage()

export const answerSelector = (state: StoreState) => state.answer
