/**
 * Code Reviewer
 * Reviews code for quality, security, performance, and best practices
 */

import { WallBounceClient } from '../core/wall-bounce-client';
import { ReviewRequest, ExpertResponse, CodeIssue } from '../core/types';

export class CodeReviewer {
  constructor(private client: WallBounceClient) {}

  async review(request: ReviewRequest): Promise<ExpertResponse> {
    const prompt = this.buildReviewPrompt(request);
    const response = await this.client.analyze(prompt, {
      verbose: true,
      context: {
        language: request.language,
        type: 'code-review',
      },
    });

    return this.parseReviewResponse(response.result, request);
  }

  private buildReviewPrompt(request: ReviewRequest): string {
    const focusAreas = request.focus || [
      'security',
      'performance',
      'readability',
      'best-practices',
      'bugs',
    ];
    const severity = request.severity || 'all';

    return `# Code Review Request

## Code to Review
Language: ${request.language}
${request.filePath ? `File: ${request.filePath}` : ''}

\`\`\`${request.language}
${request.code}
\`\`\`

## Review Criteria
Focus Areas: ${focusAreas.join(', ')}
Minimum Severity: ${severity}

## Instructions
Perform a comprehensive code review covering:
1. **Security**: Identify vulnerabilities (SQL injection, XSS, auth issues, etc.)
2. **Performance**: Find inefficiencies, N+1 queries, unnecessary loops
3. **Readability**: Check naming, complexity, documentation
4. **Best Practices**: Language-specific patterns and conventions
5. **Bugs**: Logic errors, edge cases, null/undefined issues
6. **Style**: Code formatting and consistency

For each issue found, provide:
- Severity (critical/high/medium/low)
- Category (security/performance/readability/etc.)
- Clear description
- Line number (if applicable)
- Suggested fix with explanation

${request.projectContext ? `\n## Project Context\n${request.projectContext}` : ''}

Format response as:
## Summary
[Overall assessment]

## Issues Found
[List of issues with severity, category, description, and fixes]

## Recommendations
[General recommendations for improvement]`;
  }

  private parseReviewResponse(result: string, request: ReviewRequest): ExpertResponse {
    const issues: CodeIssue[] = [];

    // Extract summary
    const summaryMatch = result.match(/##\s*Summary\s*\n([\s\S]+?)(?=\n##|$)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Code review completed';

    // Extract issues
    const issuesMatch = result.match(/##\s*Issues Found\s*\n([\s\S]+?)(?=\n##|$)/i);
    if (issuesMatch) {
      const issuesText = issuesMatch[1];
      const issueBlocks = issuesText.split(/\n(?=\d+\.|[-*]|\*\*)/);

      for (const block of issueBlocks) {
        const issue = this.parseIssue(block);
        if (issue) {
          issues.push(issue);
        }
      }
    }

    // Extract recommendations
    const recommendationsMatch = result.match(/##\s*Recommendations\s*\n([\s\S]+?)$/i);
    const findings = recommendationsMatch ? recommendationsMatch[1].trim() : result;

    return {
      type: 'review',
      summary,
      findings,
      issues,
      metrics: {
        confidence: issues.length > 0 ? 0.9 : 0.7,
      },
    };
  }

  private parseIssue(block: string): CodeIssue | null {
    // Try to extract severity
    const severityMatch = block.match(/severity[:\s]*([a-z]+)/i);
    const severity = (severityMatch?.[1]?.toLowerCase() as CodeIssue['severity']) || 'medium';

    // Try to extract category
    const categoryMatch = block.match(/category[:\s]*([a-z-]+)/i);
    const category = categoryMatch?.[1] || 'general';

    // Try to extract line number
    const lineMatch = block.match(/line[:\s]*(\d+)/i);
    const line = lineMatch ? parseInt(lineMatch[1]) : undefined;

    // Try to extract message/description
    const messageMatch = block.match(/(?:description|message)[:\s]*([^\n]+)/i);
    const message = messageMatch?.[1] || block.split('\n')[0].replace(/^[-*\d.]\s*/, '');

    // Try to extract fix
    const fixMatch = block.match(/(?:fix|suggestion)[:\s]*\n?```[\w]*\n([\s\S]+?)\n```/i);
    const fix = fixMatch?.[1];

    // Try to extract explanation
    const explMatch = block.match(/(?:explanation)[:\s]*([^\n]+)/i);
    const explanation = explMatch?.[1];

    if (!message) {
      return null;
    }

    return {
      severity,
      category,
      message: message.trim(),
      line,
      fix,
      explanation,
    };
  }
}
