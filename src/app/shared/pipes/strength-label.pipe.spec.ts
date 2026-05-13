import { StrengthLabelPipe } from './strength-label.pipe';

describe('StrengthLabelPipe', () => {
  const pipe = new StrengthLabelPipe();

  it('should return Слабый for weak', () => {
    expect(pipe.transform('weak')).toBe('Слабый');
  });

  it('should return Средний for fair', () => {
    expect(pipe.transform('fair')).toBe('Средний');
  });

  it('should return Хороший for good', () => {
    expect(pipe.transform('good')).toBe('Хороший');
  });

  it('should return Надёжный for strong', () => {
    expect(pipe.transform('strong')).toBe('Надёжный');
  });
});
