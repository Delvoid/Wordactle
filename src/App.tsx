import React, { useState, useEffect } from 'react'
import { useStore } from './store'
import WordRow from './WordRow'
import { LETTER_LENGTH } from './word-utils'

const GUESS_LENGTH = 6

const App = () => {
  const state = useStore()
  const [guess, setGuess] = useState('')

  let rows = [...state.guesses]

  if (rows.length < GUESS_LENGTH) {
    rows.push(guess)
  }

  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length

  rows = rows.concat(Array(numberOfGuessesRemaining).fill(''))

  const isGameOver = state.guesses.length === GUESS_LENGTH

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGuess = e.target.value
    if (newGuess.length === LETTER_LENGTH) {
      state.addGuess(newGuess)
      setGuess('')
      return
    }

    setGuess(newGuess)
  }

  return (
    <div className="mx-auto w-96 relative">
      <header className="border-b border-gray-500 pb-2 my-2">
        <h1 className="text-4xl text-center">Reacdle</h1>
        <div>
          <input
            type="text"
            className="w-1/2 p-2 border-2 border-gray-500"
            value={guess}
            onChange={onChange}
            disabled={isGameOver}
          />
        </div>
      </header>

      <main className="grid grid-rows-6 gap-4">
        {rows.map((word, index) => (
          <WordRow key={index} letters={word} />
        ))}
      </main>
      {isGameOver && (
        <div
          role="modal"
          className="absolute bg-white border border-gray-500 rounded text-center
            w-11/12 h-1/2 p-6 left-0 right-0 mx-auto top-1/4
           grid grid-rows-4"
        >
          <p>Game Over</p>
          <WordRow
            letters={state.answer}
            className="items-center justify-items-center"
          />
          <button
            className="border border-green-500 rounded bg-green-500 p-2 mt-4 text-gray-800 shadow"
            onClick={() => {
              state.newGame()
              setGuess('')
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  )
}

export default App
