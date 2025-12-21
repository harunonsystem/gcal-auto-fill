# AI Agent Guidelines for gcal-input-helper

## Project Overview

A browser extension (WXT + TypeScript) that assists with Google Calendar event creation.
Automatically extracts and fills in title, date/time, and meeting URL from the description field.

## Tech Stack

- **Framework**: WXT (Browser Extension Framework)
- **Language**: TypeScript
- **Package Manager**: Bun
- **Key Library**: chrono-node (date/time parsing)

## Directory Structure

```
src/
├── entrypoints/
│   └── content/          # Content Script (main feature)
│       ├── index.ts      # Google Calendar manipulation logic
│       └── style.css     # UI styles
└── assets/               # Static assets
```

## Development Commands

```bash
bun run dev          # Start dev server (Chrome)
bun run dev:firefox  # Start dev server (Firefox)
bun run build        # Production build
bun run check        # Type check
```

## Implementation Rules

1. **Content Script Only**: Currently only content script is used. No popup or background needed.
2. **DOM Manipulation**: Use MutationObserver to handle Google Calendar's dynamic DOM.
3. **Date/Time Parsing**: Use chrono-node. Supports Japanese date expressions.
4. **Error Handling**: Output appropriate logs via console.log.

## Testing

1. Load the extension with `bun run dev`
2. Open the event creation page at https://calendar.google.com
3. Enter text in the description field and click the "Generate from Description" button
