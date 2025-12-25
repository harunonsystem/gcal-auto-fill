# GCal Auto Fill

[![CI](https://github.com/harunonsystem/gcal-auto-fill/actions/workflows/ci.yml/badge.svg)](https://github.com/harunonsystem/gcal-auto-fill/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/harunonsystem/gcal-auto-fill)](https://github.com/harunonsystem/gcal-auto-fill/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

English | [日本語](README-ja.md)

A browser extension that automatically extracts date/time and meeting URLs from the description field in Google Calendar.

## Features

- 📅 **Date/Time Extraction** - Parses dates from natural language (English & Japanese)
- 🔗 **Meeting URL Detection** - Extracts Zoom, Teams, Webex, Google Meet, and Slack Huddles links
- 📝 **Title Auto-Fill** - Generates event title from description
- 🌐 **i18n Support** - English and Japanese UI
- 🌙 **Dark Mode** - Supports system theme preference

## Demo

https://github.com/user-attachments/assets/01d297f2-ce13-4d0b-bd85-545d563ef3c0

## Installation

### From GitHub Releases

1. Download latest zip from [Releases](https://github.com/harunonsystem/gcal-auto-fill/releases)
2. Extract the zip
3. Chrome: Navigate to `chrome://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the extracted folder

### From Source

```bash
bun install
bun run build
```

Then load in Chrome:
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `.output/chrome-mv3`

## Development

```bash
bun run dev      # Dev server
bun run build    # Production build
bun run check    # Type check
bun run lint     # Lint
bun run test     # Unit tests
```

## Usage

1. Open Google Calendar → Create new event
2. Paste text with date/time and meeting URL in description
3. Click "✨ Auto Fill" button
4. Confirm and apply

## Tech Stack

- [WXT](https://wxt.dev/) - Extension framework
- [TypeScript](https://www.typescriptlang.org/)
- [chrono-node](https://github.com/wanasit/chrono) - Date parser
- [Vitest](https://vitest.dev/) - Testing
- [Bun](https://bun.sh/) - Package manager

## License

[MIT](LICENSE)
