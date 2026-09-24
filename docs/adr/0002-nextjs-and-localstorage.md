# Next.js for the app, localStorage for persistence

We use Next.js so pages can be server-rendered. Everything is server-rendered by default, the builder included; only the parts that need the browser (reading or writing Resumes, interactive editing) are Client Components. Resumes are persisted in localStorage rather than IndexedDB: the team is familiar with it and v1 data (text only) fits well within its ~5 MB limit. IndexedDB is the expected upgrade if storage needs grow (e.g. images) or before accounts sync arrives.

## Consequences

- All storage access should go through one small persistence module so swapping localStorage for IndexedDB (async) later touches one place; design its interface as async from day one.
- Stored Resumes should carry a schema version so future migrations are possible.
- The server never sees a Resume, so builder pages render a shell on the server and load Resume data in the browser after hydration. Client Components still render on the server first, so code that touches localStorage must only run in the browser (e.g. in an effect).
