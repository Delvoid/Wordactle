import { describe, expect, test } from 'vitest';
import App from '../App';
import { render, screen, userEvent, within } from './test-utils';


describe('Simple test', () => {
  it('the title is visable', () => {
    render(<App />)
    expect(screen.getByText(/Reacdle/i)).toBeInTheDocument()
    
  });
});