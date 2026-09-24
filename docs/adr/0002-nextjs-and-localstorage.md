# Next.js for the app, localStorage for persistence

We use Next.js so the public landing page can be server-rendered for SEO while the builder itself runs client-side. Resumes are persisted in localStorage rather than IndexedDB: the team is familiar with it and v1 data (text only) fits well within its ~5 MB limit. IndexedDB is the expected upgrade if storage needs grow (e.g. images) or before accounts sync arrives.

## Consequences

- All storage access should go through one small persistence module so swapping localStorage for IndexedDB (async) later touches one place; design its interface as async from day one.
- Stored Resumes should carry a schema version so future migrations are possible.
