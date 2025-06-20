## Assignment option B
Create `OrderBook.tsx` that:
• Opens an SSE connection to `/api/order-stream`.
• Shows last price and maintains the latest 20 updates.
• Renders bid/ask table; highlight price up/down ticks (green/red).
• Has unit test for the stream handler or a cypress test covering a happy path.

## File tree
order‑book‑widget/
├─ app/
│  ├─ api/
│  │  └─ order‑stream/route.ts     ← mock SSE
│  └─ page.tsx
├─ components/OrderBook.tsx        ← implement
├─ jest.config.js
├─ package.json
└─ tsconfig.json
