# Development

Clone the repository and install dependencies:

```powershell
git clone https://github.com/GenAIwithMS/twitter-mcp.git
cd twitter-mcp
npm install
```

Build:

```powershell
npm run build
```

Run locally:

```powershell
npx ts-node src/index.ts
```

Run tests (if present):

```powershell
npm test
```

Development notes:
- TypeScript sources are in `src/`.
- Build output goes to `build/`.
- Keep environment variables for Twitter credentials set when running locally.