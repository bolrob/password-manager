import { HttpResponse, http } from 'msw';
import { Credential } from '../core/models';
import { MOCK_CREDENTIALS, MOCK_USERS } from './data';

let credentials = [...MOCK_CREDENTIALS];
let nextId = 100;

function generateToken(userId: string): string {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
}

function getUserFromRequest(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = JSON.parse(atob(auth.slice(7)));
    return payload.userId;
  } catch {
    return null;
  }
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = MOCK_USERS.find((u) => u.email === body.email && u.password === body.password);
    if (!user) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const { password: _, ...userWithoutPassword } = user;
    return HttpResponse.json({ token: generateToken(user.id), user: userWithoutPassword });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string; name: string };
    if (MOCK_USERS.find((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already taken' }, { status: 409 });
    }
    const newUser = { id: `user-${++nextId}`, ...body };
    MOCK_USERS.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return HttpResponse.json({ token: generateToken(newUser.id), user: userWithoutPassword });
  }),

  http.get('/api/credentials', ({ request }) => {
    const userId = getUserFromRequest(request);
    if (!userId) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const category = url.searchParams.get('category');
    const isExpiredParam = url.searchParams.get('isExpired');
    const tagsParam = url.searchParams.get('tags');

    let result = credentials.filter((c) => c.userId === userId);

    if (search) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search) || c.username.toLowerCase().includes(search),
      );
    }
    if (category) result = result.filter((c) => c.category === category);
    if (isExpiredParam !== null) result = result.filter((c) => c.isExpired === (isExpiredParam === 'true'));
    if (tagsParam) {
      const tags = tagsParam.split(',');
      result = result.filter((c) => tags.some((t) => c.tags.includes(t)));
    }

    return HttpResponse.json(result);
  }),

  http.get('/api/credentials/export', ({ request }) => {
    const userId = getUserFromRequest(request);
    if (!userId) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const data = credentials.filter((c) => c.userId === userId);
    const json = JSON.stringify(data, null, 2);
    return new HttpResponse(json, {
      headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="export.json"' },
    });
  }),

  http.get('/api/credentials/:id', ({ request, params }) => {
    const userId = getUserFromRequest(request);
    if (!userId) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const found = credentials.find((c) => c.id === params['id'] && c.userId === userId);
    if (!found) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(found);
  }),

  http.post('/api/credentials', async ({ request }) => {
    const userId = getUserFromRequest(request);
    if (!userId) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = (await request.json()) as Omit<Credential, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'passwordHistory'>;
    const now = new Date().toISOString();
    const newCred: Credential = {
      ...body,
      id: `cred-${++nextId}`,
      userId,
      passwordHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    credentials.push(newCred);
    return HttpResponse.json(newCred, { status: 201 });
  }),

  http.patch('/api/credentials/:id', async ({ request, params }) => {
    const userId = getUserFromRequest(request);
    if (!userId) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const idx = credentials.findIndex((c) => c.id === params['id'] && c.userId === userId);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

    const body = (await request.json()) as Partial<Credential>;
    const existing = credentials[idx];

    const history = body.password && body.password !== existing.password
      ? [{ password: existing.password, changedAt: existing.updatedAt }, ...existing.passwordHistory]
      : existing.passwordHistory;

    const updated = { ...existing, ...body, id: existing.id, userId, passwordHistory: history, updatedAt: new Date().toISOString() };
    credentials[idx] = updated;
    return HttpResponse.json(updated);
  }),

  http.delete('/api/credentials/:id', ({ request, params }) => {
    const userId = getUserFromRequest(request);
    if (!userId) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const idx = credentials.findIndex((c) => c.id === params['id'] && c.userId === userId);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

    credentials.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
