// ABOUTME: ESLint rule requiring files to start with // ABOUTME: comment headers.
// ABOUTME: Keeps codebase navigable for both humans and AI agents.

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require files to start with // ABOUTME: header comments',
    },
    messages: {
      missingAboutme:
        'All .ts/.tsx files must start with a line beginning with `// ABOUTME:` describing what the file does.',
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const source = context.sourceCode ?? context.getSourceCode();
        const firstComment = source.getAllComments().find((c) => c.loc.start.line === 1);
        if (firstComment && firstComment.value.trimStart().startsWith('ABOUTME:')) return;

        context.report({ node, messageId: 'missingAboutme', loc: { line: 1, column: 0 } });
      },
    };
  },
};
