## Assignment option A
Implement `app/dashboard/page.tsx` so that:
1. Unauthenticated users see a “Connect Wallet” button.
2. On first load (SSR) positions are fetched from `/api/positions`; after hydration keep them fresh with React Query.
3. Display each position in a responsive Material UI grid.
4. Add at least one unit test in `__tests__/` or impement on cypress test covering a happy path.

## File tree
token‑gated‑dashboard/
├─ app/
│  ├─ api/
│  │  └─ positions/route.ts
│  └─ dashboard/page.tsx          ← implement
├─ lib/useWallet.ts
├─ mocks/positions.json
├─ jest.config.js
├─ next.config.mjs
├─ package.json
└─ tsconfig.json

