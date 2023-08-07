import { describe, it, expect, vi } from 'vitest';
import { sayHello } from './index';

const consoleSpy = vi.spyOn(console, 'log');
consoleSpy.mockImplementation(() => { });

describe('say hello', () => {
  it('should say hello', () => {
    sayHello();
    expect(consoleSpy).toBeCalled();
  });
});
