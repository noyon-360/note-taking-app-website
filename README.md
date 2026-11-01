# Secure Notes Website

The frontend for the Secure Note-Taking API. It's a functional Next.js app: register, log in, manage notes and posts, browse users by interest, and use the admin pages.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

`API_URL` in `.env.local` chooses the backend. To use a local API, set it to `http://127.0.0.1:8000/api/v1`. It's a server-only setting, so it isn't sent to the browser.

## How it talks to the API

The browser only calls this site. Next.js route handlers call the FastAPI backend from the server.

```
Browser -> /api/auth/*          -> POST /auth/login, /auth/register
Browser -> /api/backend/<path>  -> <API_URL>/<path>, with the JWT attached
```

- **The JWT stays in an `httpOnly` cookie.** Page JavaScript can't read it, so an XSS bug can't steal it.
- **The API doesn't need CORS for this site**, because the calls come from the server.
- **`proxy.ts` only does quick page redirects.** The API must enforce authentication, roles and note ownership on every request.
- **Logout reloads the whole page.** Next.js keeps visited pages mounted but hidden, and the reload clears them.
- **Stale roles:** the role shown in the navigation comes from login, like the role in the JWT. It stays the same until the next login.

## Endpoint status

Every list sends `?page=1&limit=10` and expects the usual response with metadata:

```json
{
  "success": true,
  "message": "...",
  "data": [],
  "metadata": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

JSON fields are camelCase. A route that's missing or still a stub makes the page show a "not finished" notice, and the page starts working once the route returns this format.

| Page | Method and path | Status |
|---|---|---|
| Register, log in | `POST /auth/register`, `POST /auth/login` | Done |
| My notes | `POST /notes` | Done |
| My notes | `GET /notes` returning `Note[]` | Needed |
| My notes | `PATCH /notes/{id}` with `{ title, content }` | Needed |
| My notes | `DELETE /notes/{id}` | Needed |
| Admin: all notes | `GET /notes/all` returning `Note[]` | Needed |
| Admin: users | `GET /users` returning `User[]` | Needed |
| Admin: users | `POST /users` with `{ name, email, password, role, interests }` | Needed |
| Admin: users | `PATCH /users/{id}` with changed fields, `password` optional | Needed |
| Admin: users | `DELETE /users/{id}` | Needed |
| Posts | `GET /posts` returning `Post[]` | Needed |
| Posts | `POST /posts` with `{ title, content }` | Needed |
| User posts | `GET /users/{id}/posts` returning `{ user: { id, name }, posts: Post[] }` | Needed |
| Interests | `GET /users/by-interest` returning `InterestGroup[]` | Needed |

The interests page sends its filter as repeated parameters, such as `?interests=music&interests=travel`. Send no filter to show every interest. In FastAPI, declare `/users/by-interest` before `/users/{id}`, or it will be matched as an ID.

The data shapes are in `lib/types.ts`.
