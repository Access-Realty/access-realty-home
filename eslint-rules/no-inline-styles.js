// ABOUTME: ESLint rule forbidding inline style={{}} on JSX elements.
// ABOUTME: Enforces Tailwind utility classes per project style guide.

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow inline style={{}} on JSX elements',
    },
    messages: {
      noInlineStyle:
        'Inline styles are forbidden. Use Tailwind utility classes instead. For dynamic values (e.g., width percentages), use Tailwind arbitrary values like `w-[50%]`.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        context.report({ node, messageId: 'noInlineStyle' });
      },
    };
  },
};
