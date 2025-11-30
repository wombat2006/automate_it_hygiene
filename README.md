# Code Expert なのだ

AIの力を借りてコードレビューやリファクタリングをするツールなのだ。Wall-Bounceっていう複数のLLMを使った分析システムを使っているのだ。

> 実はこのツール、[Scripter](https://github.com/wombat2006/scripter)っていう先輩プロジェクトのWall-Bounce技術を受け継いでいるのだ。なかなかやるではないか。

## できること

- **コードレビュー**: セキュリティ、パフォーマンス、可読性、ベストプラクティスをチェックするのだ
- **リファクタリング**: コードの動作を変えずに品質を上げるのだ
- **デバッグ**: バグを見つけて直すお手伝いをするのだ
- **最適化**: パフォーマンスと効率を改善するのだ
- **コード解説**: 複雑なコードをわかりやすく説明するのだ
- **テスト生成**: 包括的なテストケースを作るのだ
- **マルチLLM分析**: GPT-5 Codex、Claude Sonnet 4、Gemini 2.5 Proを使うのだ

## 使い方

### インストール

```bash
npm install -g code-expert
```

ローカルで使う場合はこうするのだ：

```bash
git clone https://github.com/wombat2006/code-expert.git
cd code-expert
npm install
npm run build
```

### 設定

API認証情報を設定するのだ：

```bash
code-expert config
```

または `~/.code-expert-config.json` を作るのだ：

```json
{
  "apiEndpoint": "https://techsapo.com/api/v1/wall-bounce",
  "auth": {
    "username": "your-username",
    "password": "your-password"
  }
}
```

## 使用例

### コードレビュー

セキュリティ、パフォーマンス、ベストプラクティスのチェックをするのだ：

```bash
code-expert review myfile.ts

# 特定の分野に絞る場合
code-expert review myfile.ts --focus security,performance

# 結果を保存する場合
code-expert review myfile.ts -o review-results.md
```

標準入力からも読めるのだ：

```bash
cat myfile.ts | code-expert review --language typescript
```

### コードリファクタリング

コードを改善するのだ：

```bash
code-expert refactor myfile.ts

# 特定の目標がある場合
code-expert refactor myfile.ts --goals readability,performance

# リファクタリング後のコードを保存
code-expert refactor myfile.ts -o refactored.ts
```

### インタラクティブモード

複数の操作をしたいときはこれを使うのだ：

```bash
code-expert interactive
# または
code-expert i
```

## 対応言語

TypeScript、JavaScript、Python、Java、Go、Rust、C++、C#に対応しているのだ。なかなか幅広いではないか。

## レビューの観点

- **security**: SQLインジェクション、XSS、認証の問題を見つけるのだ
- **performance**: 非効率な処理、N+1クエリ、最適化の余地を探すのだ
- **readability**: 命名、複雑さ、ドキュメントをチェックするのだ
- **best-practices**: 言語固有のパターンと規約を確認するのだ
- **bugs**: ロジックエラー、エッジケース、null/undefined処理を見るのだ
- **style**: コードのフォーマットと一貫性を確認するのだ
- **architecture**: デザインパターン、モジュール性を評価するのだ

## リファクタリングの目標

- **readability**: 明確な命名、複雑さの軽減、より良い構造
- **performance**: アルゴリズム最適化、キャッシュ、データ構造の改善
- **maintainability**: DRY、SOLID原則、結合度の低減
- **dry**: 繰り返しを避けるのだ
- **solid**: 単一責任、開放閉鎖、リスコフ置換、インターフェース分離、依存性逆転
- **simplify**: 複雑さを減らし、不要なコードを削除するのだ

## 使用例

### 例1: セキュリティレビュー

```bash
code-expert review auth.ts --focus security --severity high
```

出力はこうなるのだ：
```
Code Review Results

Summary: Found 2 high-severity security issues

Issues Found (2):

[HIGH] security
  SQL injection vulnerability in user query
  Line 45
  Fix: Use parameterized queries instead of string concatenation

[HIGH] security
  Weak password validation
  Line 78
  Fix: Implement stronger password requirements (min 12 chars, special chars, etc.)
```

ふむ、SQLインジェクションとパスワード検証の問題が見つかったのだ。これは直さないといけないのだ。

### 例2: パフォーマンスリファクタリング

```bash
code-expert refactor slow-function.ts --goals performance
```

出力例：
```
Refactoring Results

Summary: Optimized algorithm from O(n²) to O(n log n)

Refactored Code:
[Optimized code with comments]

Improvements (3):

• Replaced nested loops with hash map lookup
  Impact: Performance: 9/10

• Added memoization for expensive calculations
  Impact: Performance: 8/10

• Removed redundant array iterations
  Impact: Performance: 7/10
```

O(n²)からO(n log n)に最適化できたのだ。なかなかの改善ではないか。

## アーキテクチャ

```
code-expert/
├── src/
│   ├── core/
│   │   ├── types.ts                 # 型定義
│   │   └── wall-bounce-client.ts   # Wall-Bounce APIクライアント
│   ├── features/
│   │   ├── code-reviewer.ts        # コードレビュー機能
│   │   ├── code-refactorer.ts      # リファクタリング機能
│   │   ├── code-debugger.ts        # デバッグ支援
│   │   ├── code-optimizer.ts       # パフォーマンス最適化
│   │   ├── code-explainer.ts       # コード解説
│   │   └── test-generator.ts       # テスト生成
│   ├── utils/
│   │   ├── code-parser.ts          # コード解析ユーティリティ
│   │   └── diff-formatter.ts       # 差分フォーマット
│   └── cli.ts                      # CLIインターフェース
├── docs/
│   ├── API.md                      # APIドキュメント
│   ├── EXAMPLES.md                 # 使用例
│   └── CONTRIBUTING.md             # コントリビューションガイド
└── package.json
```

## 開発

### セットアップ

```bash
npm install
npm run build
npm run dev
```

### テスト

```bash
npm test
npm run test:coverage
```

### リント

```bash
npm run lint
npm run lint:fix
```

## コントリビューション

コントリビューションは歓迎するのだ。詳しくは[CONTRIBUTING.md](docs/CONTRIBUTING.md)を見るのだ。

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)を見るのだ。

## 関連プロジェクト

- [Scripter](https://github.com/wombat2006/scripter) - AIスクリプトジェネレーター（親プロジェクト）
- [TechSapo](https://techsapo.com) - Wall-Bounce APIプラットフォーム

## サポート

- GitHub Issues: [code-expert/issues](https://github.com/wombat2006/code-expert/issues)
- Email: support@techsapo.com
- ドキュメント: [techsapo.com/docs](https://techsapo.com/docs)

困ったことがあったら遠慮なく聞くのだ。

---

**TechSapo Wall-Bounce Technology搭載なのだ**

**マルチLLM分析**:
- Round 1: GPT-5 Codex / Qwen3 Coder
- Round 2: Claude Sonnet 4
- Round 3: Gemini 2.5 Pro

これで高品質なコード分析と提案ができるのだ。なかなか贅沢な構成ではないか。
