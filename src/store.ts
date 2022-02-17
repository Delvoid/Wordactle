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
  guesses: string[]
  addGuess: (guess: string) => void
}

export const useStore = create<StoreState>(
  persist(
    (set) => ({
      answer: getRandomWord(),
      guesses: ['hello', 'solar', 'penny', 'snack', 'stare'],
      addGuess: (guess: string) => {
        set((state) => ({
          guesses: [...state.guesses, guess],
        }))
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
