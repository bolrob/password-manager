describe('authGuard logic', () => {
  function isAuthenticated(token: string | null): boolean {
    return !!token;
  }

  function runGuard(token: string | null): boolean | string {
    if (isAuthenticated(token)) return true;
    return '/auth/login';
  }

  it('should allow access when token exists', () => {
    expect(runGuard('valid-token')).toBe(true);
  });

  it('should redirect to login when no token', () => {
    expect(runGuard(null)).toBe('/auth/login');
  });

  it('should redirect to login when empty token', () => {
    expect(runGuard('')).toBe('/auth/login');
  });
});
