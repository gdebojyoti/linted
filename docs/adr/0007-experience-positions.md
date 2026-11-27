# Experience Entries hold Positions, kept in saved order

An Experience Entry holds the company, its location and one or more Positions, each with its own role, dates, Current flag, Enabled flag and Bullets (`docs/design/linted-multi-position-design/`). Before this, an Entry held one role, so a promotion meant repeating the company in a second Entry. The Entry's overall date range is worked out from its Enabled Positions when it's needed, not stored, so it can't disagree with them.

Positions are **never reordered on their own**. The form, the preview and the Export all show the saved order, and reloading the page changes nothing. When the Enabled Positions aren't in date order, the editor offers "Sort by date", which sorts and saves them. We chose this over sorting on every save, as the design export suggested, because sorting while the user types a date moves the card they're editing. It also means manual reordering, if it's ever added, just reorders the same list.

Resumes saved before Positions existed are converted when they're read (`lib/storage/local-storage-resume-store.ts`): each Experience Entry becomes an Entry with one Position holding its role, dates and Bullets. `SCHEMA_VERSION` stays 1, as there are no other users yet, so code from before this change would read a converted Resume and fail on it; we don't go back to that code.
