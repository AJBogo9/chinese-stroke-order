# Bun + TypeScript Setup Guide

## Prerequisites

Install Bun on Ubuntu:

```bash
curl -fsSL https://bun.sh/install | bash

# Add to your shell (if not automatically added)
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
bun --version
```

## Why Bun?

- **Fast**: 20-30x faster than npm
- **Built-in TypeScript**: No separate compilation step needed
- **All-in-one**: Package manager, bundler, test runner, and runtime
- **Drop-in replacement**: Works with existing npm packages

## Setup Steps

### 1. Install Dependencies

```bash
bun install
```

### 2. Create Directory Structure

```bash
mkdir -p src dist css
```

### 3. Build the Project

```bash
# One-time build
bun run build

# Watch mode (auto-rebuilds on save)
bun run watch
```

Bun compiles TypeScript and bundles everything into `dist/main.js`.

### 4. Open in Browser

```bash
firefox index.html
# or
google-chrome index.html
```

## Development Workflow

1. Edit `.ts` files in the `src/` directory
2. Run `bun run watch` in a terminal (keeps running)
3. Save your changes
4. Bun automatically rebuilds (usually under 10ms!)
5. Refresh your browser to see changes

## Bun-Specific Features

### Built-in TypeScript Support
No need for `tsc` - Bun understands TypeScript natively:
```bash
bun run src/main.ts  # Runs TypeScript directly!
```

### Fast Package Management
```bash
bun add package-name        # Install dependency
bun add -d package-name     # Install dev dependency
bun remove package-name     # Remove dependency
bun update                  # Update all packages
```

### Built-in Bundler
The `bun build` command:
- Transpiles TypeScript
- Bundles modules
- Tree-shakes unused code
- Generates source maps
- All in one fast step!

### Watch Mode
```bash
bun --watch src/main.ts  # Auto-restart on changes
```

## Key TypeScript Features Used

### Type Annotations
```typescript
let writer: HanziWriter | null = null;
let currentChar: string = '你';
```

### Interfaces
```typescript
interface HanziWriterOptions {
  width: number;
  height: number;
  // ...
}
```

### Type Guards
```typescript
if (!target) {
  console.error('Element not found');
  return;
}
// TypeScript now knows target is not null
```

### Module System
```typescript
export function createWriter(character: string): void {
  // ...
}

import { createWriter } from './writer.js';
```

## Benefits You Get

1. **Blazing Fast** - Bun builds are 10-100x faster than webpack/tsc
2. **Auto-completion** - Your editor knows all available methods
3. **Error Detection** - Typos and type mismatches caught instantly
4. **Refactoring Safety** - Rename functions/variables with confidence
5. **Zero Config** - Works out of the box with sensible defaults
6. **Hot Reload** - Changes appear instantly with watch mode

## Troubleshooting

### "bun: command not found"
Make sure Bun is in your PATH:
```bash
export PATH="$HOME/.bun/bin:$PATH"
source ~/.bashrc
```

### Changes not showing
1. Check that `bun run watch` is running
2. Make sure you're editing files in `src/`, not `dist/`
3. Hard refresh your browser (Ctrl+Shift+R)

### Type errors
The `declare global` block in `writer.ts` tells TypeScript about the HanziWriter library. If you get type errors, check that the library is loaded in `index.html`.

### Port already in use (if using Bun's dev server later)
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Optional: Use Bun's Built-in Dev Server

You can also serve your files with Bun:

```bash
# Simple static server
bun --bun run -p 3000 index.html

# Or create a simple server file (server.ts):
# Bun.serve({ port: 3000, fetch: () => new Response("Hello!") });
```

But for now, opening `index.html` directly works perfectly fine!