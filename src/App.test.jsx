import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calendar component', () => {
  render(<App />);
  const calendarElement = screen.getByText(/Interactive Calendar/i);
  expect(calendarElement).toBeDefined();
});
