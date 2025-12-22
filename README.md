# GCal Auto Fill

A browser extension that automatically extracts date/time and meeting URLs from the description field in Google Calendar.

## Features

- 📅 **Date/Time Extraction** - Parses dates from natural language (English & Japanese)
- 🔗 **Meeting URL Detection** - Extracts Zoom, Teams, Webex, Google Meet, and Slack Huddles links
- 📝 **Title Auto-Fill** - Generates event title from description
- 🌐 **i18n Support** - English and Japanese UI
- 🌙 **Dark Mode** - Supports system theme preference

## Installation

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
