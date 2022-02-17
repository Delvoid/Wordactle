import { computeGuess, LetterState } from './word-utils'
import { useStore } from './store'
import { LETTER_LENGTH } from './word-utils'

interface WordRowProps {
  letters: string
  className?: string
}

const WordRow = ({
  letters: lettersProp = '',
  className = '',
}: WordRowProps) => {
  const answer = useStore((state) => state.answer)
  const lettersRemaining = LETTER_LENGTH - lettersProp.length
  const letters = lettersProp.split('').concat(Array(lettersRemaining).fill(''))

  const guessStates = computeGuess(lettersProp, answer)
  return (
    <div className={`grid grid-cols-5 gap-4 ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox key={index} value={char} state={guessStates[index]} />
      ))}
    </div>
  )
}

interface CharacterBoxProps {
  value?: string
  state?: LetterState
}

const CharacterBox = ({ value, state }: CharacterBoxProps) => {
  const stateStyles =
    state == null
      ? 'border-gray-500 text-black'
      : `${characterStateStyles[state]} text-white`
  return (
    <div
      className={`border-2 p-2 uppercase text-center font-extrabold text-4xl before:inline-block before:content-['_'] ${stateStyles} `}
    >
      {value}
    </div>
  )
}

const characterStateStyles = {
  [LetterState.Miss]: 'border-gray-500 bg-gray-500',
  [LetterState.Present]: 'border-yellow-500 bg-yellow-500',
  [LetterState.Match]: 'border-green-500 bg-green-500',
}

export default WordRow
