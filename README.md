# 🤖 Code Expert

AI-powered coding expert using Wall-Bounce multi-LLM analysis for code review, refactoring, debugging, optimization, and more.

> 🎯 **Built on proven technology**: Inherits core Wall-Bounce integration from [Scripter](https://github.com/wombat2006/scripter)

## ✨ Features

- 🔍 **Code Review**: Security, performance, readability, best practices
- ♻️ **Refactoring**: Improve code quality while preserving behavior
- 🐛 **Debugging**: Find and fix bugs with AI assistance
- ⚡ **Optimization**: Performance and efficiency improvements
- 📚 **Code Explanation**: Understand complex code easily
- 🧪 **Test Generation**: Generate comprehensive test cases
- 🤖 **Multi-LLM Analysis**: GPT-5 Codex, Claude Sonnet 4, Gemini 2.5 Pro

## 🚀 Quick Start

### Installation

```bash
npm install -g code-expert
```

Or use locally:

```bash
git clone https://github.com/wombat2006/code-expert.git
cd code-expert
npm install
npm run build
```

### Configuration

Set up API credentials:

```bash
code-expert config
```

Or create `~/.code-expert-config.json`:

```json
{
  "apiEndpoint": "https://techsapo.com/api/v1/wall-bounce",
  "auth": {
    "username": "your-username",
    "password": "your-password"
  }
}
```

## 📖 Usage

### Code Review

Review a file for security, performance, and best practices:

```bash
code-expert review myfile.ts

# Focus on specific areas
code-expert review myfile.ts --focus security,performance

# Save results
code-expert review myfile.ts -o review-results.md
```

Review from stdin:

```bash
cat myfile.ts | code-expert review --language typescript
```

### Code Refactoring

Refactor code for better quality:

```bash
code-expert refactor myfile.ts

# Specific goals
code-expert refactor myfile.ts --goals readability,performance

# Save refactored code
code-expert refactor myfile.ts -o refactored.ts
```

### Interactive Mode

Start interactive mode for multiple operations:

```bash
code-expert interactive
# or
code-expert i
```

## 🎯 Supported Languages

- TypeScript
- JavaScript
- Python
- Java
- Go
- Rust
- C++
- C#

## 📊 Review Focus Areas

- **security**: SQL injection, XSS, authentication issues
- **performance**: Inefficiencies, N+1 queries, optimization opportunities
- **readability**: Naming, complexity, documentation
- **best-practices**: Language-specific patterns and conventions
- **bugs**: Logic errors, edge cases, null/undefined handling
- **style**: Code formatting and consistency
- **architecture**: Design patterns, modularity

## ♻️ Refactoring Goals

- **readability**: Clear naming, reduced complexity, better structure
- **performance**: Algorithm optimization, caching, data structure improvements
- **maintainability**: DRY, SOLID principles, reduced coupling
- **dry**: Don't Repeat Yourself
- **solid**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **simplify**: Reduce complexity, remove unnecessary code

## 💡 Examples

### Example 1: Security Review

```bash
code-expert review auth.ts --focus security --severity high
```

Output:
```
📋 Code Review Results

Summary: Found 2 high-severity security issues

🔍 Issues Found (2):

[HIGH] security
  SQL injection vulnerability in user query
  Line 45
  Fix: Use parameterized queries instead of string concatenation

[HIGH] security
  Weak password validation
  Line 78
  Fix: Implement stronger password requirements (min 12 chars, special chars, etc.)
```

### Example 2: Performance Refactoring

```bash
code-expert refactor slow-function.ts --goals performance
```

Output:
```
♻️ Refactoring Results

Summary: Optimized algorithm from O(n²) to O(n log n)

✨ Refactored Code:
[Optimized code with comments]

💡 Improvements (3):

• Replaced nested loops with hash map lookup
  Impact: Performance: 9/10

• Added memoization for expensive calculations
  Impact: Performance: 8/10

• Removed redundant array iterations
  Impact: Performance: 7/10
```

## 🏗️ Architecture

```
code-expert/
├── src/
│   ├── core/
│   │   ├── types.ts                 # Type definitions
│   │   └── wall-bounce-client.ts   # Wall-Bounce API client
│   ├── features/
│   │   ├── code-reviewer.ts        # Code review functionality
│   │   ├── code-refactorer.ts      # Refactoring functionality
│   │   ├── code-debugger.ts        # Debugging assistance
│   │   ├── code-optimizer.ts       # Performance optimization
│   │   ├── code-explainer.ts       # Code explanation
│   │   └── test-generator.ts       # Test case generation
│   ├── utils/
│   │   ├── code-parser.ts          # Code parsing utilities
│   │   └── diff-formatter.ts       # Diff formatting
│   └── cli.ts                      # CLI interface
├── docs/
│   ├── API.md                      # API documentation
│   ├── EXAMPLES.md                 # Usage examples
│   └── CONTRIBUTING.md             # Contribution guidelines
└── package.json
```

## 🔧 Development

### Setup

```bash
npm install
npm run build
npm run dev
```

### Testing

```bash
npm test
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Related Projects

- [Scripter](https://github.com/wombat2006/scripter) - AI-powered script generator (parent project)
- [TechSapo](https://techsapo.com) - Wall-Bounce API platform

## 📞 Support

- GitHub Issues: [code-expert/issues](https://github.com/wombat2006/code-expert/issues)
- Email: support@techsapo.com
- Documentation: [techsapo.com/docs](https://techsapo.com/docs)

---

**Powered by TechSapo Wall-Bounce Technology** 🎯

**Multi-LLM Analysis**:
- Round 1: GPT-5 Codex / Qwen3 Coder
- Round 2: Claude Sonnet 4
- Round 3: Gemini 2.5 Pro
→ High-quality code analysis and suggestions
