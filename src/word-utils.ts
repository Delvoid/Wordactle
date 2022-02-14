import wordBank from './word-bank.json'

export const getRandomWord = () => {
  return wordBank.valid[Math.floor(Math.random() * wordBank.valid.length)]
}
