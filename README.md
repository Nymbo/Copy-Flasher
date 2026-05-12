# Copy Flasher

Copy Flasher highlights text when you copy it in Obsidian, giving a clear visual confirmation that the copy action worked.

## Features

- Highlights copied editor text immediately when you press `Ctrl+C` or `Cmd+C`.
- Keeps the highlight visible while the copy shortcut is held.
- Supports copied text in reading view and other rendered Obsidian content.
- Includes settings for color, opacity, corner radius, rendered-text highlighting, and fallback timing.
- Works without external services, network requests, telemetry, or file-system access.

## Usage

Select text in Obsidian and copy it. The selected text is highlighted while the copy shortcut is held, then returns to normal when the keys are released.

For mouse or menu-based copy actions, Copy Flasher uses a short configurable fallback duration because there is no keyboard release event to observe.

## Settings

Open **Settings -> Community plugins -> Copy Flasher** to customize:

- Highlight color
- Editor opacity
- Rendered text opacity
- Corner radius
- Whether rendered Markdown text is highlighted
- Mouse/menu copy duration
- Lost-keyup fallback duration

## Privacy and permissions

Copy Flasher runs entirely inside Obsidian. It does not collect data, send network requests, read your clipboard contents, or access files directly.

## Development

Install dependencies:

```bash
npm install
```

Build once:

```bash
npm run build
```

Watch for changes during development:

```bash
npm run dev
```

Obsidian loads community plugins from `.obsidian/plugins/<plugin-id>`. The folder name should match `manifest.json`'s `id`, and Obsidian expects the built `main.js`, `manifest.json`, and optional `styles.css` at that folder root.

After changing `manifest.json`, restart Obsidian so it re-reads the plugin metadata. After changing TypeScript, rebuild and reload the plugin.

## Release files

Each GitHub release should include these assets:

- `main.js`
- `manifest.json`
- `styles.css`

The source TypeScript is for development; Obsidian loads the bundled `main.js`.
