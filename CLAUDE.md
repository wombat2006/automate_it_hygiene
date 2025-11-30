# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Code Expert is a CLI tool for AI-assisted code review and refactoring using the Wall-Bounce multi-LLM analysis API. It sends code to TechSapo's Wall-Bounce service which performs 3-round analysis across multiple LLMs (GPT-5 Codex, Claude Sonnet 4, Gemini 2.5 Pro).

## Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Run CLI in development (ts-node)
npm run build        # Compile TypeScript to dist/

# Testing & Quality
npm test             # Run Jest tests
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run type-check   # TypeScript type checking only
npm run validate     # Run all checks (format, lint, type-check)

# CLI Usage (after build)
npm start            # or: node dist/cli.js
```

## Architecture

```
src/
├── cli.ts                        # Commander.js CLI entry point
├── core/
│   ├── types.ts                  # All TypeScript interfaces
│   └── wall-bounce-client.ts     # HTTP client for Wall-Bounce API
└── features/
    ├── code-reviewer.ts          # Review feature (builds prompts, parses responses)
    └── code-refactorer.ts        # Refactor feature (builds prompts, parses responses)
```

### Key Patterns

- **Feature modules** (`src/features/`) follow a consistent pattern: inject `WallBounceClient`, build a prompt with `buildXxxPrompt()`, send to API, parse response with `parseXxxResponse()`
- **Response parsing** extracts structured data (issues, suggestions) from markdown-formatted LLM responses using regex
- **CLI** uses Commander.js for commands (`review`, `refactor`, `interactive`, `config`)

### API Configuration

User config stored at `~/.code-expert-config.json`:
```json
{
  "apiEndpoint": "https://techsapo.com/api/v1/wall-bounce",
  "auth": { "username": "...", "password": "..." }
}
```

## Type System

All request/response types defined in `src/core/types.ts`:
- `ExpertRequest` = union of `ReviewRequest | RefactorRequest | DebugRequest | OptimizeRequest | ExplainRequest | TestRequest`
- `ExpertResponse` = unified response with optional `issues[]`, `suggestions[]`, `improvedCode`
- `WallBounceRequest/Response` = API communication types

## Incomplete Features (TODO)

Features defined in types but not yet implemented:
- `code-debugger.ts`, `code-optimizer.ts`, `code-explainer.ts`, `test-generator.ts`
- `utils/code-parser.ts`, `utils/diff-formatter.ts`
- Interactive mode actions only display placeholder message
