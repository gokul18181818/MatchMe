import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('merges class names and resolves Tailwind conflicts', () => {
    const result = cn('p-2 bg-red-500', 'bg-blue-500', 'text-center', { 'font-bold': true });
    expect(result).toBe('p-2 bg-blue-500 text-center font-bold');
  });
});
