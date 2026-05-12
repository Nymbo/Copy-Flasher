# Copy Flasher

Copy Flasher is an Obsidian plugin that briefly highlights copied text so you get visual confirmation that the copy action worked.

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

For local testing, this repository can be linked into a development vault at:

```text
P:\Code Repos\Obs-Dev-Vault\Obs-Dev-Vault\.obsidian\plugins\copy-flasher
```

Obsidian loads community plugins from `.obsidian/plugins/<plugin-id>`. The folder name should match `manifest.json`'s `id`, and Obsidian expects the built `main.js`, `manifest.json`, and optional `styles.css` at that folder root.

After changing `manifest.json`, restart Obsidian so it re-reads the plugin metadata. After changing TypeScript, rebuild and reload the plugin, or use a hot-reload plugin in your development vault.

## Release Files

Community plugin releases typically include:

- `main.js`
- `manifest.json`
- `styles.css`

The source TypeScript is for development; Obsidian loads the bundled `main.js`.
