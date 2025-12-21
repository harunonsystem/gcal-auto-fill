# gcal-input-helper

A browser extension that assists with Google Calendar event creation by automatically extracting date/time and meeting URLs from the description field.

## Features

- 📅 **Date/Time Extraction** - Automatically parses dates from natural language (English & Japanese)
- 🔗 **Meeting URL Detection** - Extracts Zoom, Teams, Webex, and Google Meet links
- 📝 **Title Auto-Fill** - Generates event title from description
- ⚙️ **Customizable** - Configure default duration and behavior
- 🌐 **i18n Support** - English and Japanese UI

## Installation

### From Source

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Build the extension:
   ```bash
   bun run build
   ```
4. Load the extension in Chrome:
   - Navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

### Development

```bash
bun run dev          # Start dev server (Chrome)
bun run dev:firefox  # Start dev server (Firefox)
bun run build        # Production build
bun run check        # Type check
bun run lint         # Lint
```

## Usage

1. Open Google Calendar and create a new event
2. Paste or type text in the description field containing:
   - Date/time (e.g., "December 23, 6:00 PM" or "12月23日 18:00")
   - Meeting URL (Zoom, Teams, etc.)
3. Click the "✨ Auto Fill" button
4. Confirm the extracted information

## Tech Stack

- [WXT](https://wxt.dev/) - Browser extension framework
- [TypeScript](https://www.typescriptlang.org/)
- [chrono-node](https://github.com/wanasit/chrono) - Natural language date parser
- [Bun](https://bun.sh/) - Package manager

## License

[MIT](LICENSE)
