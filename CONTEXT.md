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
The part of a Resume that says which Theme renders it and how that Theme is configured for this Resume, including its Layout.
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
The Section holding personal details. Name and headline belong to the Header itself; each contact item (email, phone, location, each link) is one of its Entries. A Resume has exactly one Header, and it is Pinned.
_Avoid_: Contact section, personal info, profile

**Pinned**:
A Section that is always first in whichever Zone its Theme puts it in. The user cannot move it or place another Section above it. The Header is Pinned.
_Avoid_: Locked, fixed, sticky

**Section**:
A titled group of Entries within a Resume's Content, such as Summary, Experience or Skills. Any number of its Entries may be Enabled at once. Sections can be renamed, except the Header, which besides its Entries holds name and headline fields of its own.
_Avoid_: Block, category, part

**Default Section**:
A Section of a type Linted provides out of the box, with a known shape: Header, Summary, Experience, Projects, Skills or Education. A Resume has one of each from the start, all Empty. Default Sections cannot be deleted, only left Empty or Disabled.
_Avoid_: Built-in section, standard section

**Custom Section**:
A Section the user creates and names themselves, using a generic Entry shape. A Resume can have any number of them, and they can be deleted.
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
A single named skill (e.g. "Go") within a Skills Entry. A Skills Entry groups Skills under a label such as "Languages" and holds them as one line of text ("Go, Python, SQL"). A single Skill can't be Disabled on its own; its whole Entry can.
_Avoid_: Tag, keyword

**Enabled / Disabled**:
Whether a Section, Entry, Bullet or contact item is included in the Export. Disabling a parent hides everything beneath it without changing the children's own Enabled state. A Disabled Section is Ghosted in the preview.
_Avoid_: Hidden, visible, active, checked

**Empty**:
Content the user has not filled in. Empty content is never included in the Export, regardless of whether it is Enabled. An Empty Section is Ghosted in the preview.
_Avoid_: Blank, unset

**Current**:
An Entry (such as a job or school) that is still ongoing, so it has a start date but no end date. Marking an Entry Current discards any end date it had. Shown as "Present" when rendered.
_Avoid_: Ongoing, active, open-ended

### Presentation

**Theme**:
The visual design that renders a Resume's Enabled Content. A Theme defines its Zones and a default Layout, which places Sections into Zones by their type. Every Theme must be able to render any Custom Section. Changing the Theme never changes Content, but resets the Layout to the new Theme's default.
_Avoid_: Template, skin

**Zone**:
A named area of the page that a Theme defines, such as header, sidebar or main, holding Sections in order. Each Zone belongs to one Theme.
_Avoid_: Column, region, slot, area

**Layout**:
Which Zone each Section of a Resume sits in, and the order of Sections within each Zone, for the Resume's current Theme. Part of Theme Settings, not Content. The user changes it in the preview.
_Avoid_: Arrangement, placement, order

**Ghosted**:
How the preview shows a Section that is Empty or Disabled: only its title, faded, so the user can still move it within the Layout. Ghosted Sections never appear in the Export.
_Avoid_: Hidden, dimmed, placeholder

**Export**:
Producing a PDF of a Resume's Enabled Content in its Theme.
_Avoid_: Download, print
