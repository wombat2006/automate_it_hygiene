/**
 * Code Refactorer
 * Refactors code for better readability, performance, and maintainability
 */

import { WallBounceClient } from '../core/wall-bounce-client';
import { RefactorRequest, ExpertResponse, CodeSuggestion } from '../core/types';

export class CodeRefactorer {
  constructor(private client: WallBounceClient) {}

  async refactor(request: RefactorRequest): Promise<ExpertResponse> {
    const prompt = this.buildRefactorPrompt(request);
    const response = await this.client.analyze(prompt, {
      verbose: true,
      context: {
        language: request.language,
        type: 'refactoring',
      },
    });

    return this.parseRefactorResponse(response.result, request);
  }

  private buildRefactorPrompt(request: RefactorRequest): string {
    const goals = request.goals || ['readability', 'maintainability', 'performance'];
    const preserveBehavior = request.preserveBehavior !== false;

    return `# Code Refactoring Request

## Original Code
Language: ${request.language}
${request.filePath ? `File: ${request.filePath}` : ''}

\`\`\`${request.language}
${request.code}
\`\`\`

## Refactoring Goals
${goals.map((g) => `- ${g}`).join('\n')}

## Constraints
- ${preserveBehavior ? '✅ MUST preserve exact behavior' : '⚠️ Behavior changes allowed'}
- Follow ${request.language} best practices and idioms
- Maintain or improve test coverage

## Instructions
Refactor the code focusing on:

1. **Readability**
   - Clear variable/function names
   - Reduce complexity
   - Add helpful comments
   - Improve structure

2. **Performance**
   - Optimize algorithms
   - Reduce unnecessary operations
   - Improve data structures
   - Cache when appropriate

3. **Maintainability**
   - Follow DRY principle
   - Apply SOLID principles
   - Reduce coupling
   - Increase cohesion

${request.projectContext ? `\n## Project Context\n${request.projectContext}` : ''}

Provide:
1. Refactored code with comments explaining changes
2. List of specific improvements made
3. Before/after comparison for key changes
4. Impact assessment (readability, performance, maintainability)

Format as:
## Refactored Code
\`\`\`${request.language}
[refactored code]
\`\`\`

## Improvements Made
[List of improvements]

## Impact Assessment
[Scores and explanation]`;
  }

  private parseRefactorResponse(result: string, request: RefactorRequest): ExpertResponse {
    // Extract refactored code
    const codeMatch = result.match(/```[\w]*\n([\s\S]+?)\n```/);
    const improvedCode = codeMatch ? codeMatch[1].trim() : '';

    // Extract summary
    const summaryMatch = result.match(/##\s*(?:Summary|Improvements Made)\s*\n([\s\S]+?)(?=\n##|$)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Code refactored successfully';

    // Extract impact assessment
    const impactMatch = result.match(/##\s*Impact Assessment\s*\n([\s\S]+?)$/i);
    const findings = impactMatch ? impactMatch[1].trim() : result;

    // Parse suggestions
    const suggestions: CodeSuggestion[] = this.parseSuggestions(result, request.code);

    return {
      type: 'refactor',
      summary,
      findings,
      improvedCode,
      suggestions,
      metrics: {
        confidence: 0.85,
      },
    };
  }

  private parseSuggestions(result: string, originalCode: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Look for improvement sections
    const improvementsMatch = result.match(/##\s*Improvements Made\s*\n([\s\S]+?)(?=\n##|$)/i);
    if (improvementsMatch) {
      const improvementsText = improvementsMatch[1];
      const items = improvementsText.split(/\n(?=\d+\.|[-*])/);

      for (const item of items) {
        const suggestion = this.parseImprovementItem(item);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }

    return suggestions;
  }

  private parseImprovementItem(item: string): CodeSuggestion | null {
    // Try to extract before/after code blocks
    const beforeMatch = item.match(/before[:\s]*\n?```[\w]*\n([\s\S]+?)\n```/i);
    const afterMatch = item.match(/after[:\s]*\n?```[\w]*\n([\s\S]+?)\n```/i);

    if (!beforeMatch || !afterMatch) {
      return null;
    }

    // Extract reason
    const reasonMatch = item.match(/reason[:\s]*([^\n]+)/i);
    const reason = reasonMatch?.[1] || item.split('\n')[0].replace(/^[-*\d.]\s*/, '');

    // Try to extract impact scores
    const readabilityMatch = item.match(/readability[:\s]*(\d+)/i);
    const performanceMatch = item.match(/performance[:\s]*(\d+)/i);
    const maintainabilityMatch = item.match(/maintainability[:\s]*(\d+)/i);

    return {
      original: beforeMatch[1].trim(),
      suggested: afterMatch[1].trim(),
      reason: reason.trim(),
      impact: {
        readability: readabilityMatch ? parseInt(readabilityMatch[1]) : undefined,
        performance: performanceMatch ? parseInt(performanceMatch[1]) : undefined,
        maintainability: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : undefined,
      },
    };
  }
}
