---
status: superseded by ADR-0005
---

# Sections are stored as an ordered list

A Resume's Content stores its Sections as an ordered list from day one, even though in v1 the Theme decides where Sections appear (except Header - which always goes at the top) and ignores that order. User-controlled reordering is planned; storing order now means it can be added (via UI alone) without migrating existing Resumes. How Themes should combine user order with their own placement rules is deliberately undecided — a future version may merge the editor and preview so the Theme simply renders Content in its stored order.
