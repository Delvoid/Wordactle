import { describe, expect, test } from 'vitest';
import App from '../App';
import { render, screen, userEvent, within } from './test-utils';
import {getRandomWord} from '../word-utils';


describe('Word utils', () => {
  it('returns a random valid word', () => {
    expect(getRandomWord()).toEqual(expect.any(String))
    expect(getRandomWord().length).toEqual(5)
    
  });
});