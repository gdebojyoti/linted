# Linted

A resume builder for tech job seekers. Users write and keep several resumes, choose what each one includes, and export them as PDFs in a chosen theme.

## Language

### Resumes

**Resume**:
A standalone unit made of three parts: its Content, its Theme Settings, and its Metadata. Resumes are independent: nothing links one resume to another.
_Avoid_: CV, document, profile

**Content**:
Everything the user writes in a Resume (Sections, Entries, Bullets) plus whether each piece is Enabled.
_Avoid_: Data, body

**Theme Settings**:
The part of a Resume that says which Theme renders it and how that Theme is configured for this Resume.
_Avoid_: Style, appearance

**Metadata**:
Facts about a Resume rather than its Content, such as its Resume Title and when it was created and last edited.
_Avoid_: Info, properties

**Resume Title**:
The user's own, non-empty label for a Resume (e.g. "Stripe backend v2"), used to tell Resumes apart. Need not be unique, and is unrelated to the person's name in the Header.
_Avoid_: Name, filename

**Duplicate**:
Creating a new Resume as a full, independent copy of an existing one. Later edits to either Resume never affect the other.
_Avoid_: Clone, fork, template

### Content structure

**Header**:
The Section holding personal details. Name and headline belong to the Header itself; each contact item (email, phone, location, each link) is one of its Entries. A Resume has at most one Header, and it is Pinned to the top.
_Avoid_: Contact section, personal info, profile

**Pinned**:
A Section with a fixed position that the user cannot move, such as the Header, which is always first, including when it is deleted and added back. This will matter once reordering exists.
_Avoid_: Locked, fixed, sticky

**Section**:
A titled group of Entries within a Resume's Content, such as Summary, Experience or Skills. Any number of its Entries may be Enabled at once. Sections can be renamed, deleted, and repeated (for example, two Experience Sections). The Header is the exception: it cannot be repeated or renamed, and besides its Entries it holds name and headline fields of its own.
_Avoid_: Block, category, part

**Default Section**:
A Section of a type Linted provides out of the box, with a known shape: Header, Summary, Experience, Projects, Skills or Education. A new Resume starts with one of each, all Empty.
_Avoid_: Built-in section, standard section

**Custom Section**:
A Section the user creates and names themselves, using a generic Entry shape. A Resume can have any number of them.
_Avoid_: User section, freeform section

**Entry**:
One item within a Section, such as a single job, degree, project or summary paragraph.
_Avoid_: Item, record, row

**Prose**:
Free-text Content that supports inline formatting (bold, italic, links): Summaries and Bullets. All other fields are plain text.
_Avoid_: Rich text, description

**Bullet**:
A single point of text belonging to an Entry. A Bullet can have child Bullets, at most two levels deep. The user decides the order of Entries and Bullets.
_Avoid_: Point, line, highlight

**Skill**:
A single named skill (e.g. "Go") within a Skills Entry, which groups Skills under a label such as "Languages".
_Avoid_: Tag, keyword

**Enabled / Disabled**:
Whether a Section, Entry, Bullet or Skill is included in the preview and the Export. Disabling a parent hides everything beneath it without changing the children's own Enabled state.
_Avoid_: Hidden, visible, active, checked

**Empty**:
Content the user has not filled in. Empty content is never rendered, regardless of whether it is Enabled.
_Avoid_: Blank, unset

**Current**:
An Entry (such as a job or school) that is still ongoing, so it has a start date but no end date. Marking an Entry Current discards any end date it had. Shown as "Present" when rendered.
_Avoid_: Ongoing, active, open-ended

### Presentation

**Theme**:
The visual design that renders a Resume's Enabled Content, including where each Section is placed on the page (except Pinned Sections, which keep their fixed position). Every Theme must be able to render any Custom Section. Changing the Theme changes appearance only, never Content.
_Avoid_: Template, skin, layout

**Export**:
Producing a PDF of a Resume's Enabled Content in its Theme.
_Avoid_: Download, print
