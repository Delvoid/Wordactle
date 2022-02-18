import { describe, expect, test } from 'vitest'
import App from '../App'
import { useStore } from '../store'
import { render, screen, userEvent, within } from './test-utils'

describe('Simple test', () => {
  it('the title is visable', () => {
    render(<App />)
    expect(screen.getByText(/Reacdle/i)).toBeInTheDocument()
  })
  it('shows empty state', () => {
    useStore.setState({ guesses: [] })
    render(<App />)
    expect(screen.queryByText('Game Over')).toBeNull()
    expect(document.querySelectorAll('main div')).toHaveLength(6)
    expect(document.querySelector('main')?.textContent).toEqual('')
  })
  it('shows one row of guesses', () => {
    useStore.setState({ guesses: ['react'] })
    render(<App />)
    expect(document.querySelector('main')?.textContent).toEqual('react')
  })
  it('shows two row of guesses', () => {
    useStore.setState({ guesses: ['react', 'aisle'] })
    render(<App />)
    expect(document.querySelector('main')?.textContent).toEqual('reactaisle')
  })
  it('shows game over state', () => {
    useStore.setState({ guesses: Array(6).fill('react') })
    render(<App />)
    expect(screen.queryByText('Game Over')).toBeInTheDocument()
  })
  it('can start a new game', () => {
    useStore.setState({ guesses: Array(6).fill('react') })
    render(<App />)
    expect(screen.queryByText('Game Over')).toBeInTheDocument()
    userEvent.click(screen.getByText('New Game'))
    expect(document.querySelector('main')?.textContent).toEqual('')
  })
})
