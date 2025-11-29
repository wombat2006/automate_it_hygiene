#!/usr/bin/env node
/**
 * Code Expert CLI
 * AI-powered coding assistant using Wall-Bounce multi-LLM analysis
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { WallBounceClient } from './core/wall-bounce-client';
import { CodeReviewer } from './features/code-reviewer';
import { CodeRefactorer } from './features/code-refactorer';
import {
  CodeLanguage,
  ExpertiseType,
  ReviewRequest,
  RefactorRequest,
  ExpertResponse,
} from './core/types';

const program = new Command();

program
  .name('code-expert')
  .description('AI-powered coding expert using Wall-Bounce multi-LLM analysis')
  .version('1.0.0');

// Review command
program
  .command('review')
  .description('Review code for quality, security, and best practices')
  .argument('[file]', 'File to review (or use stdin)')
  .option('-l, --language <lang>', 'Programming language', 'typescript')
  .option('-f, --focus <areas>', 'Focus areas (comma-separated)', 'security,performance,bugs')
  .option('-s, --severity <level>', 'Minimum severity', 'all')
  .option('-o, --output <file>', 'Output file for results')
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (file, options) => {
    try {
      const code = await readCode(file);
      const language = options.language as CodeLanguage;
      const focus = options.focus.split(',').map((f: string) => f.trim());

      const spinner = ora('Analyzing code with Wall-Bounce...').start();

      const client = new WallBounceClient(loadConfig());
      const reviewer = new CodeReviewer(client);

      const request: ReviewRequest = {
        type: 'review',
        code,
        language,
        filePath: file,
        focus,
        severity: options.severity,
      };

      const result = await reviewer.review(request);
      spinner.succeed('Code review completed');

      displayReviewResults(result);

      if (options.output) {
        fs.writeFileSync(options.output, formatResultsAsMarkdown(result), 'utf-8');
        console.log(chalk.green(`\n✅ Results saved to ${options.output}`));
      }
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Refactor command
program
  .command('refactor')
  .description('Refactor code for better readability and maintainability')
  .argument('[file]', 'File to refactor (or use stdin)')
  .option('-l, --language <lang>', 'Programming language', 'typescript')
  .option('-g, --goals <goals>', 'Refactoring goals (comma-separated)', 'readability,maintainability')
  .option('-o, --output <file>', 'Output file for refactored code')
  .option('--preserve', 'Strictly preserve behavior', true)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (file, options) => {
    try {
      const code = await readCode(file);
      const language = options.language as CodeLanguage;
      const goals = options.goals.split(',').map((g: string) => g.trim());

      const spinner = ora('Refactoring code with Wall-Bounce...').start();

      const client = new WallBounceClient(loadConfig());
      const refactorer = new CodeRefactorer(client);

      const request: RefactorRequest = {
        type: 'refactor',
        code,
        language,
        filePath: file,
        goals,
        preserveBehavior: options.preserve,
      };

      const result = await refactorer.refactor(request);
      spinner.succeed('Code refactored successfully');

      displayRefactorResults(result);

      if (options.output) {
        fs.writeFileSync(options.output, result.improvedCode || '', 'utf-8');
        console.log(chalk.green(`\n✅ Refactored code saved to ${options.output}`));
      }
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode')
  .action(async () => {
    console.log(chalk.blue.bold('\n🤖 Code Expert - Interactive Mode\n'));

    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '🔍 Review code', value: 'review' },
            { name: '♻️  Refactor code', value: 'refactor' },
            { name: '🐛 Debug code', value: 'debug' },
            { name: '⚡ Optimize code', value: 'optimize' },
            { name: '📚 Explain code', value: 'explain' },
            { name: '🧪 Generate tests', value: 'test' },
            { name: '❌ Exit', value: 'exit' },
          ],
        },
      ]);

      if (action === 'exit') {
        console.log(chalk.green('\n👋 Goodbye!\n'));
        break;
      }

      await handleInteractiveAction(action as ExpertiseType);
    }
  });

// Config command
program
  .command('config')
  .description('Configure API credentials')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiEndpoint',
        message: 'Wall-Bounce API endpoint:',
        default: 'https://techsapo.com/api/v1/wall-bounce',
      },
      {
        type: 'input',
        name: 'username',
        message: 'API username:',
      },
      {
        type: 'password',
        name: 'password',
        message: 'API password:',
      },
    ]);

    const config = {
      apiEndpoint: answers.apiEndpoint,
      auth: {
        username: answers.username,
        password: answers.password,
      },
    };

    const configPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.code-expert-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    console.log(chalk.green(`\n✅ Configuration saved to ${configPath}`));
  });

// Helper functions
async function readCode(file?: string): Promise<string> {
  if (file) {
    return fs.readFileSync(file, 'utf-8');
  }

  // Read from stdin
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}

function loadConfig() {
  const configPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.code-expert-config.json');

  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
  }

  return {};
}

function displayReviewResults(result: ExpertResponse) {
  console.log(chalk.blue.bold('\n📋 Code Review Results\n'));
  console.log(chalk.white(result.summary));

  if (result.issues && result.issues.length > 0) {
    console.log(chalk.yellow.bold(`\n🔍 Issues Found (${result.issues.length}):\n`));

    for (const issue of result.issues) {
      const severityColor =
        issue.severity === 'critical'
          ? chalk.red
          : issue.severity === 'high'
          ? chalk.yellow
          : issue.severity === 'medium'
          ? chalk.blue
          : chalk.gray;

      console.log(severityColor(`[${issue.severity.toUpperCase()}] ${issue.category}`));
      console.log(`  ${issue.message}`);
      if (issue.line) {
        console.log(chalk.gray(`  Line ${issue.line}`));
      }
      if (issue.fix) {
        console.log(chalk.green(`  Fix: ${issue.fix}`));
      }
      console.log();
    }
  } else {
    console.log(chalk.green('\n✅ No critical issues found!'));
  }

  console.log(chalk.white(`\n${result.findings}`));
}

function displayRefactorResults(result: ExpertResponse) {
  console.log(chalk.blue.bold('\n♻️  Refactoring Results\n'));
  console.log(chalk.white(result.summary));

  if (result.improvedCode) {
    console.log(chalk.green.bold('\n✨ Refactored Code:\n'));
    console.log(result.improvedCode);
  }

  if (result.suggestions && result.suggestions.length > 0) {
    console.log(chalk.yellow.bold(`\n💡 Improvements (${result.suggestions.length}):\n`));

    for (const suggestion of result.suggestions) {
      console.log(chalk.blue(`• ${suggestion.reason}`));
      if (suggestion.impact) {
        const impacts = [];
        if (suggestion.impact.readability) {
          impacts.push(`Readability: ${suggestion.impact.readability}/10`);
        }
        if (suggestion.impact.performance) {
          impacts.push(`Performance: ${suggestion.impact.performance}/10`);
        }
        if (suggestion.impact.maintainability) {
          impacts.push(`Maintainability: ${suggestion.impact.maintainability}/10`);
        }
        if (impacts.length > 0) {
          console.log(chalk.gray(`  Impact: ${impacts.join(', ')}`));
        }
      }
      console.log();
    }
  }

  console.log(chalk.white(`\n${result.findings}`));
}

function formatResultsAsMarkdown(result: ExpertResponse): string {
  let markdown = `# Code ${result.type === 'review' ? 'Review' : 'Refactoring'} Results\n\n`;
  markdown += `## Summary\n${result.summary}\n\n`;

  if (result.issues && result.issues.length > 0) {
    markdown += `## Issues Found (${result.issues.length})\n\n`;
    for (const issue of result.issues) {
      markdown += `### [${issue.severity.toUpperCase()}] ${issue.category}\n`;
      markdown += `${issue.message}\n`;
      if (issue.line) markdown += `Line: ${issue.line}\n`;
      if (issue.fix) markdown += `**Fix**: ${issue.fix}\n`;
      markdown += '\n';
    }
  }

  if (result.improvedCode) {
    markdown += `## Refactored Code\n\`\`\`\n${result.improvedCode}\n\`\`\`\n\n`;
  }

  markdown += `## Details\n${result.findings}\n`;

  return markdown;
}

async function handleInteractiveAction(action: ExpertiseType) {
  const { file } = await inquirer.prompt([
    {
      type: 'input',
      name: 'file',
      message: 'Enter file path (or press Enter to paste code):',
    },
  ]);

  let code: string;
  if (file) {
    code = fs.readFileSync(file, 'utf-8');
  } else {
    const { inputCode } = await inquirer.prompt([
      {
        type: 'editor',
        name: 'inputCode',
        message: 'Paste your code:',
      },
    ]);
    code = inputCode;
  }

  // Execute based on action
  // (Implementation similar to commands above)
  console.log(chalk.yellow(`\nProcessing ${action} request...\n`));
}

program.parse();
