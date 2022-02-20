import { LetterState, LETTER_LENGTH } from './word-utils'

interface WordRowProps {
  letters: string
  result?: LetterState[]
  className?: string
  invalidWord: boolean
}

const WordRow = ({
  letters: lettersProp = '',
  result = [],
  className = '',
  invalidWord,
}: WordRowProps) => {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length
  const letters = lettersProp.split('').concat(Array(lettersRemaining).fill(''))

  return (
    <div className={`grid grid-cols-5 gap-4 ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox
          key={index}
          value={char}
          state={result[index]}
          invalidWord={invalidWord}
        />
      ))}
    </div>
  )
}

interface CharacterBoxProps {
  value?: string
  state?: LetterState
  invalidWord?: boolean
}

const CharacterBox = ({ value, state, invalidWord }: CharacterBoxProps) => {
  let stateStyles =
    state == null
      ? 'border-gray-500 text-black'
      : `${characterStateStyles[state]} text-white`
  if (invalidWord) {
    stateStyles += ' border-red-500'
  }
  return (
    <span
      className={`border-2 p-2 uppercase text-center font-extrabold text-4xl before:inline-block before:content-['_'] ${stateStyles} `}
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
