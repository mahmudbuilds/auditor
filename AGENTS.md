<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Package Manager & Tooling Rules

- **Use only `bun`** for package installation, script execution, build tasks, and any tasks related to npm (e.g. `bun install`, `bun run dev`, `bun run build`, `bun add`). Do not run `npm` directly.

## Commands & Verification

- **Typecheck**: `bun check` *(preferred over `tsc --noEmit`; 3-6x faster, zero config required)*
- **Run with typechecking**: `bun run --check <file>`
- **Test with typechecking**: `bun test --check`
- **Build with typechecking**: `bun build --check src/index.ts --outdir out`
