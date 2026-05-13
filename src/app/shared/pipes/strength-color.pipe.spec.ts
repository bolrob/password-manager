import { StrengthColorPipe } from './strength-color.pipe';

describe('StrengthColorPipe', () => {
  const pipe = new StrengthColorPipe();

  it('should return negative color for weak', () => {
    expect(pipe.transform('weak')).toBe('var(--tui-status-negative)');
  });

  it('should return warning color for fair', () => {
    expect(pipe.transform('fair')).toBe('var(--tui-status-warning)');
  });

  it('should return positive color for good', () => {
    expect(pipe.transform('good')).toBe('var(--tui-status-positive)');
  });

  it('should return info color for strong', () => {
    expect(pipe.transform('strong')).toBe('var(--tui-status-info)');
  });
});
