const LETTER_LENGTH = 5
interface WordRowProps {
  letters: string
}

const WordRow = ({ letters: lettersProp = '' }: WordRowProps) => {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length
  const letters = lettersProp.split('').concat(Array(lettersRemaining).fill(''))
  return (
    <div className="grid grid-cols-5 gap-4">
      {letters.map((char, i) => (
        <CharacterBox key={i} value={char} />
      ))}
    </div>
  )
}

interface CharacterBoxProps {
  value: string
}

const CharacterBox = ({ value }: CharacterBoxProps) => {
  return (
    <div className="inline-block border-2 border-gray-500 p-4 uppercase text-2xl font-bold text-center">
      {value}
    </div>
  )
}

export default WordRow
