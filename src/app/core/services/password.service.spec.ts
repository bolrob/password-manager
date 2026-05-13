import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  describe('generate', () => {
    it('should generate password of specified length', () => {
      const pwd = service.generate({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
      });
      expect(pwd).toHaveLength(16);
    });

    it('should return empty string when no charset selected', () => {
      const pwd = service.generate({
        length: 16,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      });
      expect(pwd).toBe('');
    });

    it('should contain uppercase when enabled', () => {
      const pwd = service.generate({
        length: 50,
        uppercase: true,
        lowercase: false,
        numbers: false,
        symbols: false,
      });
      expect(/[A-Z]/.test(pwd)).toBe(true);
    });

    it('should contain digits when numbers enabled', () => {
      const pwd = service.generate({
        length: 50,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false,
      });
      expect(/\d/.test(pwd)).toBe(true);
    });

    it('should contain symbols when enabled', () => {
      const pwd = service.generate({
        length: 50,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: true,
      });
      expect(/[^A-Za-z0-9]/.test(pwd)).toBe(true);
    });

    it('should generate different passwords on each call', () => {
      const opts = { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true };
      const pwd1 = service.generate(opts);
      const pwd2 = service.generate(opts);
      expect(pwd1).not.toBe(pwd2);
    });

    it('should only contain lowercase when only lowercase enabled', () => {
      const pwd = service.generate({
        length: 50,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
      });
      expect(/^[a-z]+$/.test(pwd)).toBe(true);
    });
  });

  describe('getStrength', () => {
    it('should return weak for empty password', () => {
      expect(service.getStrength('')).toBe('weak');
    });

    it('should return weak for very short password', () => {
      expect(service.getStrength('abc')).toBe('weak');
    });

    it('should return strong for complex long password', () => {
      expect(service.getStrength('Abc1!xyz#DEFG2345')).toBe('strong');
    });

    it('should return weak for simple lowercase only', () => {
      expect(service.getStrength('abcdefgh')).toBe('weak');
    });
  });

  describe('getStrengthScore', () => {
    it('should return 25 for weak password', () => {
      expect(service.getStrengthScore('abc')).toBe(25);
    });

    it('should return 100 for strong password', () => {
      expect(service.getStrengthScore('Abc1!xyz#DEFG2345')).toBe(100);
    });

    it('should return score between 0 and 100', () => {
      const score = service.getStrengthScore('TestPass1!');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
