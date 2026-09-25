const blockStatements = new Set([
  'IfStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
  'SwitchStatement',
  'TryStatement'
]);

function hasBlockBody(node) {
  switch (node.type) {
    case 'IfStatement':
      return node.consequent.type === 'BlockStatement' || node.alternate?.type === 'BlockStatement';
    case 'ForStatement':
    case 'ForInStatement':
    case 'ForOfStatement':
    case 'WhileStatement':
    case 'DoWhileStatement':
      return node.body.type === 'BlockStatement';
    case 'SwitchStatement':
    case 'TryStatement':
      return true;
    default:
      return false;
  }
}

function getStatementSiblings(node) {
  const parent = node.parent;
  if (!parent) return null;

  for (const key of ['body', 'consequent']) {
    const statements = parent[key];
    if (Array.isArray(statements)) {
      const index = statements.indexOf(node);
      if (index !== -1) return { statements, index };
    }
  }

  return null;
}

function hasBlankLineBetween(lines, previousEndLine, nextStartLine) {
  return lines.slice(previousEndLine, nextStartLine - 1).some((line) => line.trim() === '');
}

const paddingAroundMultilineBlocks = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Require blank lines around multiline control-flow blocks'
    },
    schema: [],
    messages: {
      before: 'Add a blank line before this multiline control-flow block.',
      after: 'Add a blank line after this multiline control-flow block.'
    }
  },
  create(context) {
    const lines = context.sourceCode.lines;

    function checkPadding(node) {
      if (!blockStatements.has(node.type) || !hasBlockBody(node)) return;
      if (node.loc.start.line === node.loc.end.line) return;

      const siblings = getStatementSiblings(node);
      if (!siblings) return;

      const previous = siblings.statements[siblings.index - 1];
      const next = siblings.statements[siblings.index + 1];

      if (previous && !hasBlankLineBetween(lines, previous.loc.end.line, node.loc.start.line)) {
        context.report({ node, messageId: 'before' });
      }

      if (next && !hasBlankLineBetween(lines, node.loc.end.line, next.loc.start.line)) {
        context.report({ node, messageId: 'after' });
      }
    }

    return Object.fromEntries([...blockStatements].map((type) => [type, checkPadding]));
  }
};

export default {
  meta: { name: 'aj-webdev-work-tracker' },
  rules: {
    'padding-around-multiline-blocks': paddingAroundMultilineBlocks
  }
};

export { paddingAroundMultilineBlocks };
