import { useEffect, useState } from 'react'
import { LetterState, LETTER_LENGTH } from './word-utils'

interface WordRowProps {
  letters: string
  result?: LetterState[]
  className?: string
  invalidWord: boolean
  checkingGuess?: boolean
}

const WordRow = ({
  letters: lettersProp = '',
  result = [],
  className = '',
  invalidWord = false,
  checkingGuess = false,
}: WordRowProps) => {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length
  const letters = lettersProp.split('').concat(Array(lettersRemaining).fill(''))

  return (
    <div className={`grid grid-cols-5 gap-4 ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox
          key={index}
          index={index}
          value={char}
          state={result[index]}
          invalidWord={invalidWord}
          checkingGuess={checkingGuess}
        />
      ))}
    </div>
  )
}

interface CharacterBoxProps {
  value?: string
  state?: LetterState
  invalidWord?: boolean
  checkingGuess?: boolean
  index: Number
}

const CharacterBox = ({
  value,
  state,
  invalidWord,
  checkingGuess,
  index,
}: CharacterBoxProps) => {
  const [shouldFlip, setShouldFlip] = useState(false)
  const [showStyles, setShowStyles] = useState(true)

  useEffect(() => {
    let flipTO: NodeJS.Timeout
    let styleTO: NodeJS.Timeout
    if (checkingGuess) {
      setShowStyles(false)
      flipTO = setTimeout(() => {
        setShouldFlip(true)

        styleTO = setTimeout(() => setShowStyles(true), 250)
      }, (Number(index) * 500) / 2)
    }
    return () => {
      clearTimeout(flipTO)
      clearTimeout(styleTO)
    }
  }, [checkingGuess])

  useEffect(() => {
    let id: NodeJS.Timeout
    if (shouldFlip) {
      id = setTimeout(() => setShouldFlip(false), 1600)
    }

    return () => clearTimeout(id)
  }, [shouldFlip])
  let flip = shouldFlip ? ` animate-flip` : ''

  let stateStyles = showStyles
    ? state == null
      ? 'border-gray-500 text-black'
      : `${characterStateStyles[state]} text-white`
    : 'border-gray-500 text-black'
  if (invalidWord) {
    stateStyles += ' border-red-500'
  }

  return (
    <span
      className={`border-2 p-2 uppercase text-center font-extrabold text-4xl before:inline-block before:content-['_']  ${flip} ${stateStyles} `}
    >
      {value}
    </span>
  )
}

const characterStateStyles = {
  [LetterState.Miss]: 'border-gray-500 bg-gray-500',
  [LetterState.Present]: 'border-yellow-500 bg-yellow-500',
  [LetterState.Match]: 'border-green-500 bg-green-500',
}

export default WordRow
