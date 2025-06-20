## Assignment
Complete the 3‑step tokenization wizard as described in `wizard/page.tsx`.
Validate fields, show per‑step errors, and POST compiled payload on finish.
Add one integration or cypress test covering happy path.

## File tree
tokenization‑wizard/
├─ app/
│  └─ wizard/page.tsx              ← implement steps
├─ components/
│  ├─ WizardLayout.tsx
│  └─ steps/
│     ├─ AssetInfo.tsx
│     ├─ Documents.tsx
│     └─ Review.tsx
├─ app/api/submit/route.ts         ← mock POST
├─ jest.config.js
├─ package.json
└─ tsconfig.json

## Usage

To get it running, simply run, from the root folder, using node 20 LTS:

```bash
yarn install
yarn dev
```

