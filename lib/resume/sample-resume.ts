import { DEFAULT_THEME_ID, SCHEMA_VERSION, type Resume, type ResumeDate } from "./types";

// A filled-in Resume for building and checking the editor and Theme before
// Resumes can be created and saved. The person is fictional.
//
// Besides realistic content, it deliberately includes the cases the UI must
// handle: every Section type (Custom included), Disabled items at each level
// (Section, Entry, Bullet, Skill, contact item), Empty Entries, Current
// Entries, dates at year / month / day precision, nested Bullets, and Prose
// with bold, italic and links.
//
// Ids are fixed so the sample is the same on every load.

function year(year: number): ResumeDate {
  return { year, month: null, day: null };
}

function month(year: number, month: number): ResumeDate {
  return { year, month, day: null };
}

export const sampleResume: Resume = {
  schemaVersion: SCHEMA_VERSION,
  metadata: {
    id: "5a3f0c1e-7b2d-4e8a-9c61-2f4d8b0a1e37",
    title: "Backend roles - 2026",
    createdAt: "2026-08-02T09:15:00.000Z",
    lastEditedAt: "2026-09-21T18:42:00.000Z",
  },
  themeSettings: { themeId: DEFAULT_THEME_ID, layout: null },
  content: {
    sections: [
      {
        id: "header",
        type: "header",
        title: "Header",
        enabled: true,
        pinned: true,
        name: "Maya Okafor",
        headline: "Senior Backend Engineer",
        entries: [
          { id: "contact-email", enabled: true, kind: "email", value: "maya.okafor@example.com" },
          { id: "contact-phone", enabled: false, kind: "phone", value: "+44 7700 900123" },
          { id: "contact-location", enabled: true, kind: "location", value: "London, UK" },
          {
            id: "contact-github",
            enabled: true,
            kind: "link",
            label: "GitHub",
            value: "https://github.com/example-maya",
          },
          {
            id: "contact-linkedin",
            enabled: true,
            kind: "link",
            label: "LinkedIn",
            value: "https://www.linkedin.com/in/example-maya",
          },
          {
            id: "contact-blog",
            enabled: false,
            kind: "link",
            label: "Blog",
            value: "https://maya.example.com",
          },
        ],
      },
      {
        id: "summary",
        type: "summary",
        title: "Summary",
        enabled: true,
        entries: [
          {
            id: "summary-backend",
            enabled: true,
            text: "Backend engineer with **8 years** building payment and data platforms in Go and Python. I care about *boring*, observable systems and have led migrations serving **40M+ requests a day**.",
          },
          {
            id: "summary-fullstack",
            enabled: false,
            text: "Product-minded engineer comfortable across the stack, from Postgres schemas to React front ends. Recently shipped [Ledgerly](https://ledgerly.example.com), a bookkeeping tool for freelancers.",
          },
        ],
      },
      {
        id: "experience",
        type: "experience",
        title: "Professional Experience",
        enabled: true,
        entries: [
          {
            id: "exp-paystream",
            enabled: true,
            company: "Paystream",
            role: "Senior Backend Engineer",
            location: "London, UK (hybrid)",
            dates: { start: month(2022, 3), current: true, end: null },
            bullets: [
              {
                id: "exp-paystream-b1",
                enabled: true,
                text: "Led the move of card authorisation from a monolith to **six Go services**, cutting p99 latency from 480 ms to 95 ms.",
                children: [
                  {
                    id: "exp-paystream-b1-1",
                    enabled: true,
                    text: "Designed the rollout: shadow traffic, then per-merchant flags, with zero failed payments during cutover.",
                    children: [],
                  },
                  {
                    id: "exp-paystream-b1-2",
                    enabled: false,
                    text: "Wrote the internal RFC template the platform team still uses.",
                    children: [],
                  },
                ],
              },
              {
                id: "exp-paystream-b2",
                enabled: true,
                text: "Introduced idempotency keys across the public API, removing a class of duplicate-charge incidents (*~30 a quarter* before).",
                children: [],
              },
              {
                id: "exp-paystream-b3",
                enabled: true,
                text: "Mentor to four engineers; two promoted to senior.",
                children: [],
              },
            ],
          },
          {
            id: "exp-northwind",
            enabled: true,
            company: "Northwind Analytics",
            role: "Backend Engineer",
            location: "Manchester, UK",
            dates: { start: month(2019, 6), current: false, end: month(2022, 2) },
            bullets: [
              {
                id: "exp-northwind-b1",
                enabled: true,
                text: "Built the event ingestion pipeline (Kafka, Python, ClickHouse) processing **2B events a month**.",
                children: [],
              },
              {
                id: "exp-northwind-b2",
                enabled: false,
                text: "Maintained the legacy PHP reporting service until it was retired.",
                children: [],
              },
            ],
          },
          {
            id: "exp-first-job",
            enabled: false,
            company: "Brightside Web Studio",
            role: "Junior Developer",
            location: "Leeds, UK",
            dates: { start: year(2017), current: false, end: year(2019) },
            bullets: [
              {
                id: "exp-first-job-b1",
                enabled: true,
                text: "Built WordPress and Laravel sites for 20+ small-business clients.",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "projects",
        type: "projects",
        title: "Projects",
        enabled: true,
        entries: [
          {
            id: "proj-ledgerly",
            enabled: true,
            name: "Ledgerly",
            link: "https://ledgerly.example.com",
            techStack: "Go, Postgres, HTMX",
            dates: { start: month(2024, 1), current: true, end: null },
            bullets: [
              {
                id: "proj-ledgerly-b1",
                enabled: true,
                text: "Bookkeeping for freelancers; **300 paying users** after six months.",
                children: [],
              },
            ],
          },
          {
            id: "proj-rate-limiter",
            enabled: true,
            name: "tokenbucket",
            link: "https://github.com/example-maya/tokenbucket",
            techStack: "Go",
            dates: { start: null, current: false, end: null },
            bullets: [
              {
                id: "proj-rate-limiter-b1",
                enabled: true,
                text: "Distributed rate-limiting library backed by Redis; used in production at Paystream. See the [design notes](https://maya.example.com/tokenbucket).",
                children: [],
              },
            ],
          },
          {
            id: "proj-empty",
            enabled: true,
            name: "",
            link: "",
            techStack: "",
            dates: { start: null, current: false, end: null },
            bullets: [],
          },
        ],
      },
      {
        id: "skills",
        type: "skills",
        title: "Skills",
        enabled: true,
        entries: [
          {
            id: "skills-languages",
            enabled: true,
            label: "Languages",
            skills: [
              { id: "skill-go", enabled: true, name: "Go" },
              { id: "skill-python", enabled: true, name: "Python" },
              { id: "skill-sql", enabled: true, name: "SQL" },
              { id: "skill-typescript", enabled: true, name: "TypeScript" },
              { id: "skill-php", enabled: false, name: "PHP" },
            ],
          },
          {
            id: "skills-infra",
            enabled: true,
            label: "Infrastructure",
            skills: [
              { id: "skill-postgres", enabled: true, name: "Postgres" },
              { id: "skill-kafka", enabled: true, name: "Kafka" },
              { id: "skill-kubernetes", enabled: true, name: "Kubernetes" },
              { id: "skill-aws", enabled: true, name: "AWS" },
            ],
          },
          {
            id: "skills-frontend",
            enabled: false,
            label: "Front end",
            skills: [
              { id: "skill-react", enabled: true, name: "React" },
              { id: "skill-htmx", enabled: true, name: "HTMX" },
            ],
          },
        ],
      },
      {
        id: "education",
        type: "education",
        title: "Education",
        enabled: true,
        entries: [
          {
            id: "edu-manchester",
            enabled: true,
            institution: "University of Manchester",
            degree: "BSc Computer Science",
            location: "Manchester, UK",
            dates: { start: year(2013), current: false, end: year(2017) },
            results: "First-class honours",
            bullets: [
              {
                id: "edu-manchester-b1",
                enabled: true,
                text: "Dissertation: *Consistency trade-offs in geo-replicated key-value stores*.",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "custom-talks",
        type: "custom",
        title: "Talks",
        enabled: true,
        entries: [
          {
            id: "talk-gophercon",
            enabled: true,
            title: "Idempotency at scale",
            subtitle: "GopherCon UK",
            dates: { start: { year: 2025, month: 8, day: 14 }, current: false, end: null },
            bullets: [
              {
                id: "talk-gophercon-b1",
                enabled: true,
                text: "[Slides and recording](https://maya.example.com/talks/idempotency).",
                children: [],
              },
            ],
          },
          {
            id: "talk-meetup",
            enabled: true,
            title: "From monolith to services without a big bang",
            subtitle: "London Go Meetup",
            dates: { start: month(2023, 11), current: false, end: null },
            bullets: [],
          },
        ],
      },
      {
        id: "custom-volunteering",
        type: "custom",
        title: "Volunteering",
        enabled: false,
        entries: [
          {
            id: "vol-codebar",
            enabled: true,
            title: "Coach",
            subtitle: "codebar London",
            dates: { start: year(2020), current: true, end: null },
            bullets: [],
          },
        ],
      },
    ],
  },
};
