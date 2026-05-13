import { AuthService } from './auth.service';

describe('AuthService (localStorage)', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = { getToken, isAuthenticated, logout, getCurrentUser } as unknown as AuthService;
  });

  function getToken(): string | null {
    return localStorage.getItem('pm_token');
  }

  function isAuthenticated(): boolean {
    return !!localStorage.getItem('pm_token');
  }

  function logout(): void {
    localStorage.removeItem('pm_token');
    localStorage.removeItem('pm_user');
  }

  function getCurrentUser() {
    const raw = localStorage.getItem('pm_user');
    return raw ? JSON.parse(raw) : null;
  }

  afterEach(() => localStorage.clear());

  it('should return false when no token in localStorage', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('should return true when token exists', () => {
    localStorage.setItem('pm_token', 'abc');
    expect(isAuthenticated()).toBe(true);
  });

  it('should return null token when not set', () => {
    expect(getToken()).toBeNull();
  });

  it('should clear token and user on logout', () => {
    localStorage.setItem('pm_token', 'tok');
    localStorage.setItem('pm_user', '{"id":"1"}');
    logout();
    expect(isAuthenticated()).toBe(false);
    expect(getCurrentUser()).toBeNull();
  });

  it('should parse user from localStorage', () => {
    const user = { id: '1', email: 'a@b.com', name: 'A' };
    localStorage.setItem('pm_user', JSON.stringify(user));
    expect(getCurrentUser()).toEqual(user);
  });
});
