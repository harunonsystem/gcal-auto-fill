# AI Agent Guidelines for GCal Auto Fill

## Project Overview

A browser extension (WXT + TypeScript) that assists with Google Calendar event creation.
Automatically extracts and fills in title, date/time, and meeting URL from the description field.

## Tech Stack

- **Framework**: WXT (Browser Extension Framework)
- **Language**: TypeScript
- **Package Manager**: Bun
- **Key Library**: chrono-node (date/time parsing)
- **Testing**: Vitest
- **Linting**: oxlint

## Directory Structure

```
src/
├── entrypoints/
│   └── content/          # Content Script (main feature)
│       ├── index.ts      # Entry point
│       └── style.css     # UI styles (light/dark mode)
└── lib/
    ├── constants.ts      # DOM selectors, CSS classes
    ├── extractor.ts      # Title extraction
    ├── gcal.ts           # Google Calendar logic
    ├── i18n.ts           # Internationalization (en/ja)
    ├── parser.ts         # Date/time & URL parsing
    ├── parser.test.ts    # Parser tests
    ├── extractor.test.ts # Extractor tests
    └── toast.ts          # Toast notifications
```

## Development Commands

```bash
bun run dev      # Dev server (Chrome)
bun run build    # Production build
bun run check    # Type check
bun run lint     # Lint
bun run test     # Unit tests
bun run zip      # Package for distribution
```

## Implementation Rules

1. **Content Script Only**: No popup or background script needed.
2. **DOM Manipulation**: Use MutationObserver for Google Calendar's dynamic DOM.
3. **Date/Time Parsing**: Use chrono-node (supports English + Japanese).
4. **Error Handling**: Use toast notifications for user feedback.
5. **Testing**: Add tests for any parsing logic changes.

## Testing

1. Run `bun run dev` to start dev server
2. Open https://calendar.google.com and create a new event
3. Enter text with date/time in description
4. Click "✨ Auto Fill" button

