import React, { useState, useEffect, useRef } from 'react'
import { useStore, GUESS_LENGTH } from './store'
import WordRow from './WordRow'
import { isValidWord, LETTER_LENGTH } from './word-utils'
import Keyboard from './Keyboard'

const App = () => {
  const state = useStore()
  const [guess, setGuess, addGuessLetter] = useGuess()
  const addGuess = useStore((s) => s.addGuess)
  const prevGuess = usePrevious(guess)
  const [showInvalidGuess, setInvalidGuess] = useState(false)
  const [checkingGuess, setCheckingGuess] = useState(false)
  const [canType, setCanType] = useState(true)

  useEffect(() => {
    let id: NodeJS.Timeout
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500)
    }

    return () => clearTimeout(id)
  }, [showInvalidGuess])

  useEffect(() => {
    let id: NodeJS.Timeout
    if (checkingGuess) {
      id = setTimeout(() => {
        setCheckingGuess(false)
        setCanType(true)
      }, 1500)
    }
    return () => clearTimeout(id)
  }, [checkingGuess])

  useEffect(() => {
    if (guess.length == 0 && prevGuess?.length === LETTER_LENGTH) {
      if (!canType) {
        return setGuess(prevGuess)
      }
      if (isValidWord(prevGuess)) {
        addGuess(prevGuess)
        setCheckingGuess(true)
        setCanType(false)
        setInvalidGuess(false)
      } else {
        setInvalidGuess(true)
        setGuess(prevGuess)
      }
    }
  }, [guess])

  let rows = [...state.rows]
  let currentRow = 0
  if (rows.length < GUESS_LENGTH) {
    currentRow = rows.push({ guess }) - 1
  }

  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length

  rows = rows.concat(Array(numberOfGuessesRemaining).fill(''))

  const isGameOver = state.gameState !== 'playing'

  return (
    <div className="mx-auto w-96 relative">
      <header className="border-b border-gray-300 pb-2 my-2 mb-4">
        <h1 className="text-6xl text-center text-white ">Wordactle</h1>
      </header>

      <main className="grid grid-rows-6 gap-2 mb-4">
        {rows.map(({ guess, result }, index) => (
          <WordRow
            key={index}
            letters={guess}
            result={result}
            invalidWord={showInvalidGuess && index === currentRow}
            checkingGuess={checkingGuess && index === currentRow - 1}
            className={
              showInvalidGuess && index === currentRow ? 'animate-bounce' : ''
            }
          />
        ))}
      </main>

      <Keyboard
        onClick={(letter) => {
          if (canType) {
            addGuessLetter(letter)
          }
        }}
      />

      {isGameOver && !checkingGuess && (
        <div
          role="modal"
          className="absolute bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 border border-blue-600 shadow-xl rounded text-center
            w-11/12  p-6 left-0 right-0 mx-auto top-1/4
           grid grid-rows-3"
        >
          <p
            className={`text-xl font-bold ${
              state.gameState === 'won' ? ' text-emerald-500' : ' text-red-500'
            }`}
          >
            {state.gameState === 'won' ? 'Game Won' : 'Game Over'}
          </p>
          <WordRow
            letters={state.answer}
            className="items-center justify-items-center"
            invalidWord={showInvalidGuess}
          />
          <button
            className="border border-emerald-500 rounded bg-emerald-500 p-2 mt-4 text-white shadow"
            onClick={() => {
              state.newGame()
              setGuess('')
            }}
          >
            New Game
          </button>
        </div>
      )}
      {showInvalidGuess && (
        <div
          role="modal"
          className="absolute text-white bg-red-400  shadow-xl border border-red-500 rounded text-center
            w-10/12  p-4 left-0 right-0 mx-auto top-1/4
           grid grid-rows-1"
        >
          <p className=" text-xl font-bold">Invalid word!</p>
        </div>
      )}
    </div>
  )
}

function useGuess(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  (letter: string) => void
] {
  const [guess, setGuess] = useState('')

  const addGuessLetter = (letter: string) => {
    setGuess((currGuess) => {
      const newGuess =
        letter.length === 1 && currGuess.length !== LETTER_LENGTH
          ? currGuess + letter
          : currGuess

      switch (letter) {
        case 'Backspace':
          return newGuess.slice(0, -1)
        case 'Enter':
          if (newGuess.length === LETTER_LENGTH) {
            return ''
          }
      }
      if (currGuess.length === LETTER_LENGTH) return currGuess
      return newGuess
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    let letter = e.key
    addGuessLetter(letter)
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  })

  return [guess, setGuess, addGuessLetter]
}

// source https://usehooks.com/usePrevious/
function usePrevious<T>(value: T): T {
  const ref: any = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default App
