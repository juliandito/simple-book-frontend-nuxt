# Simple Book Frontend — Nuxt 3

A production-ready **Nuxt 3** boilerplate for a Book Management System.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Nuxt 3](https://nuxt.com) | Full-stack Vue framework with SSR |
| [Vue 3](https://vuejs.org) | UI library (Composition API) |
| [TypeScript](https://www.typescriptlang.org) | Static typing (strict mode) |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [DaisyUI](https://daisyui.com) | Component library on top of Tailwind |
| [Pinia](https://pinia.vuejs.org) | Shared state management |
| [Zod](https://zod.dev) | Schema validation (runtime + types) |
| [VueUse](https://vueuse.org) | Composable utilities |
| [ESLint](https://eslint.org) | Linting |
| [Prettier](https://prettier.io) | Code formatting |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and configure
cp .env.example .env

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `API_BASE_URL` | `http://localhost:8080` | Backend REST API base URL |

Configure in `.env` (never commit secrets).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run generate` | Generate static site |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint all files |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without changes |

---

## Architecture

The project follows a strict layered architecture to enforce separation of concerns:

```
Page  →  Composable (optional)  →  Pinia Store (shared state only)  →  Service  →  API Client  →  Backend
```

- **Pages** compose components and call composables — no business logic
- **Composables** orchestrate behavior (pagination, search, form lifecycle)
- **Pinia Stores** hold shared, cached state — not page-local state
- **Services** contain all HTTP calls — never call `$fetch` directly from pages
- **API Client** (`services/api.ts`) is the single gateway to the backend

---

## Directory Structure

```
.
├── app.vue                     # Root Vue app entry
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.ts          # Tailwind + DaisyUI configuration
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Example environment variables
│
├── assets/
│   └── css/main.css            # Global CSS (Tailwind directives)
│
├── components/
│   ├── base/                   # Generic reusable components
│   │   ├── BaseButton.vue
│   │   └── BaseInput.vue
│   └── books/                  # Book feature components
│       ├── BookCard.vue
│       ├── BookTable.vue
│       └── BookForm.vue
│
├── composables/
│   ├── useBooks.ts             # Orchestrates book list + CRUD
│   └── usePagination.ts        # Reusable pagination state
│
├── layouts/
│   └── default.vue             # Main layout with navbar + footer
│
├── middleware/                 # Route middleware (auth, etc.)
│
├── pages/
│   ├── index.vue               # Dashboard
│   └── books/
│       ├── index.vue           # Books list
│       ├── create.vue          # Create book
│       └── [id].vue            # View / Edit book detail
│
├── plugins/                    # Nuxt plugins
│
├── schemas/
│   ├── common.ts               # Shared Zod schemas (pagination, API wrappers)
│   └── book.ts                 # Book entity + request/response schemas
│
├── services/
│   ├── api.ts                  # Reusable $fetch API client factory
│   └── book.service.ts         # Book CRUD HTTP calls
│
├── stores/
│   └── book.store.ts           # Pinia store — cached books state
│
├── types/
│   └── api.ts                  # Shared TypeScript types (ApiResponse, etc.)
│
└── utils/
    ├── constants.ts            # App-wide constants
    └── helpers.ts              # Pure utility functions
```

---

## Design Decisions

### Zod as single source of truth

Zod schemas in `schemas/` define both runtime validation **and** TypeScript types via `z.infer<>`. There are no duplicate interfaces; `type Book = z.infer<typeof BookSchema>`.

### Services own all HTTP

Pages **never** call `$fetch` directly. Only `services/book.service.ts` (and other future domain services) call `useApiClient()`. This keeps API contracts centralized and easy to update.

### Pinia for shared state only

Local state (modal open, form dirty, current filter) stays inside composables or pages. The Pinia `book.store.ts` holds globally cached books so navigating back to a list page does not re-fetch unnecessarily.

### Composables for behavior, not API wrappers

`useBooks()` orchestrates pagination + search + store interaction. It is **not** a thin wrapper around `bookService`; that would just add indirection.

---

## Adding a New Feature

1. **Add Zod schema** in `schemas/<domain>.ts`
2. **Add service** in `services/<domain>.service.ts`
3. **Add Pinia store** in `stores/<domain>.store.ts` (only if shared state needed)
4. **Add composable** in `composables/use<Domain>.ts`
5. **Add page(s)** in `pages/<domain>/`
6. **Add components** in `components/<domain>/`

---

## Future Scalability

This architecture is designed to accommodate:

- **Authentication** — JWT/refresh logic goes in `services/auth.service.ts`; token injection is stubbed in `services/api.ts`
- **Role-based permissions** — middleware in `middleware/`
- **Internationalization** — add `@nuxtjs/i18n` module; all strings already extracted to constants
- **File uploads** — new service + endpoint, same pattern
- **Optimistic updates** — update store optimistically before API call, rollback on error
- **SSR caching** — Nuxt data fetching (`useFetch`, `useAsyncData`) can replace service calls per page
