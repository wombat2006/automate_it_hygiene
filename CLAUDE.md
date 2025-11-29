# CLAUDE.md

AI-powered Coding Expert using Wall-Bounce multi-LLM analysis.

## 🎯 Project Overview

**Code Expert** provides AI-assisted code review, refactoring, debugging, optimization, and more through Wall-Bounce multi-LLM analysis.

**Inherited from**: [Scripter](https://github.com/wombat2006/scripter) - Proven Wall-Bounce integration

## 🏗️ Architecture

### Core Components

- `src/core/wall-bounce-client.ts`: Wall-Bounce API integration (inherited from Scripter)
- `src/core/types.ts`: TypeScript type definitions
- `src/features/`: Expert features (review, refactor, debug, optimize, explain, test)
- `src/cli.ts`: Command-line interface

### Features

| Feature | Description | Focus |
|---------|-------------|-------|
| **Review** | Code quality analysis | Security, performance, bugs, best practices |
| **Refactor** | Code improvement | Readability, maintainability, SOLID, DRY |
| **Debug** | Bug finding & fixing | Logic errors, edge cases, null handling |
| **Optimize** | Performance tuning | Algorithm, memory, I/O optimization |
| **Explain** | Code understanding | Documentation, learning, knowledge transfer |
| **Test** | Test generation | Unit tests, integration tests, coverage |

## 🚀 Development

### Setup

```bash
npm install
npm run build
npm run dev
```

### Commands

```bash
# Review code
npm run dev -- review file.ts

# Refactor code
npm run dev -- refactor file.ts --goals readability,performance

# Interactive mode
npm run dev -- interactive

# Configure API
npm run dev -- config
```

### Testing

```bash
npm test
npm run lint
npm run type-check
npm run validate
```

## 🔧 Configuration

### API Configuration

Create `~/.code-expert-config.json`:

```json
{
  "apiEndpoint": "https://techsapo.com/api/v1/wall-bounce",
  "auth": {
    "username": "your-username",
    "password": "your-password"
  }
}
```

Or use `code-expert config` command.

## 💡 Usage Examples

### Example 1: Security Review

```bash
code-expert review auth.ts --focus security --severity high -o security-report.md
```

### Example 2: Performance Refactoring

```bash
code-expert refactor slow-function.ts --goals performance -o optimized.ts
```

### Example 3: Test Generation

```bash
code-expert test calculator.ts --framework jest --coverage 80 -o calculator.test.ts
```

## 📚 Documentation

- `README.md`: User guide and quick start
- `docs/API.md`: API documentation
- `docs/EXAMPLES.md`: Usage examples
- `docs/CONTRIBUTING.md`: Contribution guidelines

## 🤖 Wall-Bounce Integration

Uses 3-round multi-LLM analysis:

1. **Round 1**: Initial analysis (GPT-5 Codex / Qwen3 Coder)
2. **Round 2**: Validation & improvement (Claude Sonnet 4)
3. **Round 3**: Final synthesis (Gemini 2.5 Pro)

→ High-quality, consensus-based code analysis

## 🔒 Security

- API credentials stored securely in `~/.code-expert-config.json`
- HTTPS communication with Wall-Bounce API
- BASIC authentication
- No code sent to third-party services (only to TechSapo Wall-Bounce)

## 📊 Supported Languages

- TypeScript ✅
- JavaScript ✅
- Python ✅
- Java ✅
- Go ✅
- Rust ✅
- C++ ✅
- C# ✅

## 🛠️ Technology Stack

- **TypeScript**: 5.3.0
- **Node.js**: 18.0.0+
- **Wall-Bounce API**: TechSapo platform
- **CLI**: Commander.js
- **UI**: Chalk, Ora, Inquirer
- **Testing**: Jest

## 📝 Project Structure

```
code-expert/
├── src/
│   ├── core/
│   │   ├── types.ts                 # Type definitions
│   │   └── wall-bounce-client.ts   # Wall-Bounce client (inherited)
│   ├── features/
│   │   ├── code-reviewer.ts        # Code review
│   │   ├── code-refactorer.ts      # Refactoring
│   │   ├── code-debugger.ts        # Debugging (TODO)
│   │   ├── code-optimizer.ts       # Optimization (TODO)
│   │   ├── code-explainer.ts       # Explanation (TODO)
│   │   └── test-generator.ts       # Test generation (TODO)
│   ├── utils/
│   │   ├── code-parser.ts          # Code parsing (TODO)
│   │   └── diff-formatter.ts       # Diff formatting (TODO)
│   └── cli.ts                      # CLI interface
├── docs/
│   ├── API.md                      # API docs (TODO)
│   ├── EXAMPLES.md                 # Examples (TODO)
│   └── CONTRIBUTING.md             # Contributing (TODO)
├── examples/
│   └── sample-code/                # Example files (TODO)
├── tests/
│   └── *.test.ts                   # Test files (TODO)
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
└── CLAUDE.md                       # This file
```

## 🎯 Roadmap

### Phase 1: Core Features (Current)
- [x] Wall-Bounce client integration
- [x] Code reviewer
- [x] Code refactorer
- [x] CLI interface
- [ ] Debugger
- [ ] Optimizer
- [ ] Explainer
- [ ] Test generator

### Phase 2: Enhanced Features
- [ ] VSCode extension
- [ ] Batch processing
- [ ] Project-wide analysis
- [ ] Custom rules/plugins
- [ ] CI/CD integration

### Phase 3: Advanced Features
- [ ] Real-time collaboration
- [ ] Team analytics
- [ ] Learning mode
- [ ] Custom LLM models

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License

---

**Powered by TechSapo Wall-Bounce Technology** 🎯
