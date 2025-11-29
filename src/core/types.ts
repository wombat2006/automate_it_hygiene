/**
 * Code Expert Type Definitions
 */

export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'go'
  | 'rust'
  | 'cpp'
  | 'csharp';

export type ExpertiseType = 'review' | 'refactor' | 'debug' | 'optimize' | 'explain' | 'test';

export interface CodeInput {
  /** Source code to analyze */
  code: string;

  /** Programming language */
  language: CodeLanguage;

  /** File path (optional, for context) */
  filePath?: string;

  /** Project context (optional) */
  projectContext?: string;
}

export interface ReviewRequest extends CodeInput {
  type: 'review';

  /** Focus areas for review */
  focus?: Array<
    | 'security'
    | 'performance'
    | 'readability'
    | 'best-practices'
    | 'bugs'
    | 'style'
    | 'architecture'
  >;

  /** Severity level to report */
  severity?: 'all' | 'critical' | 'high' | 'medium';
}

export interface RefactorRequest extends CodeInput {
  type: 'refactor';

  /** Refactoring goals */
  goals?: Array<
    'readability' | 'performance' | 'maintainability' | 'dry' | 'solid' | 'simplify'
  >;

  /** Preserve behavior strictly */
  preserveBehavior?: boolean;
}

export interface DebugRequest extends CodeInput {
  type: 'debug';

  /** Error message or symptom */
  errorMessage?: string;

  /** Expected behavior */
  expectedBehavior?: string;

  /** Actual behavior */
  actualBehavior?: string;

  /** Stack trace */
  stackTrace?: string;
}

export interface OptimizeRequest extends CodeInput {
  type: 'optimize';

  /** Optimization targets */
  targets?: Array<'speed' | 'memory' | 'network' | 'disk' | 'algorithm'>;

  /** Performance constraints */
  constraints?: {
    maxTime?: string;
    maxMemory?: string;
  };
}

export interface ExplainRequest extends CodeInput {
  type: 'explain';

  /** Detail level */
  level?: 'beginner' | 'intermediate' | 'advanced';

  /** Focus on specific part */
  focusOn?: string;
}

export interface TestRequest extends CodeInput {
  type: 'test';

  /** Test framework to use */
  framework?: 'jest' | 'mocha' | 'pytest' | 'junit' | 'go-test';

  /** Coverage targets */
  coverage?: {
    statements?: number;
    branches?: number;
    functions?: number;
  };
}

export type ExpertRequest =
  | ReviewRequest
  | RefactorRequest
  | DebugRequest
  | OptimizeRequest
  | ExplainRequest
  | TestRequest;

export interface CodeIssue {
  /** Issue severity */
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';

  /** Issue category */
  category: string;

  /** Issue description */
  message: string;

  /** Line number (if applicable) */
  line?: number;

  /** Column number (if applicable) */
  column?: number;

  /** Code snippet */
  snippet?: string;

  /** Suggested fix */
  fix?: string;

  /** Fix explanation */
  explanation?: string;
}

export interface CodeSuggestion {
  /** Original code */
  original: string;

  /** Suggested code */
  suggested: string;

  /** Reason for suggestion */
  reason: string;

  /** Impact assessment */
  impact?: {
    readability?: number; // 1-10
    performance?: number; // 1-10
    maintainability?: number; // 1-10
  };

  /** Line numbers affected */
  lines?: {
    start: number;
    end: number;
  };
}

export interface ExpertResponse {
  /** Response type */
  type: ExpertiseType;

  /** Summary of analysis */
  summary: string;

  /** Detailed findings */
  findings: string;

  /** Issues found (for review/debug) */
  issues?: CodeIssue[];

  /** Suggestions (for refactor/optimize) */
  suggestions?: CodeSuggestion[];

  /** Improved code (for refactor/optimize/test) */
  improvedCode?: string;

  /** Explanation (for explain) */
  explanation?: string;

  /** Test cases (for test) */
  testCases?: string;

  /** Metrics */
  metrics?: {
    consensusScore?: number;
    confidence?: number;
    complexity?: number;
  };

  /** Contributing LLM providers */
  providers?: string[];
}

export interface WallBounceRequest {
  query: string;
  mode?: 'parallel' | 'sequential';
  depth?: number;
  includeThinking?: boolean;
  context?: {
    language?: string;
    framework?: string;
    projectType?: string;
  };
}

export interface WallBounceResponse {
  result: string;
  consensus?: number;
  providers?: string[];
  thinking?: string;
  metadata?: Record<string, any>;
}

export interface GenerationOptions {
  /** Enable verbose output */
  verbose?: boolean;

  /** Wall-Bounce API endpoint */
  apiEndpoint?: string;

  /** Authentication credentials */
  auth?: {
    username: string;
    password: string;
  };

  /** Output format */
  format?: 'json' | 'text' | 'markdown';

  /** Save results to file */
  output?: string;
}
