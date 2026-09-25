import type { RuleTester } from 'oxlint/plugins-dev';

type OxlintRule = Parameters<RuleTester['run']>[1];
type RuleCreate = NonNullable<OxlintRule['create']>;
type RuleContext = Parameters<RuleCreate>[0];
type RuleVisitor = ReturnType<RuleCreate>;
type AnyNode = Parameters<NonNullable<RuleVisitor[string]>>[0];
type ControlFlowNode =
  | Parameters<NonNullable<RuleVisitor['IfStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['ForStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['ForInStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['ForOfStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['WhileStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['DoWhileStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['SwitchStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['TryStatement']>>[0];
type ProgramNode = Parameters<NonNullable<RuleVisitor['Program']>>[0];
type BlockStatementNode = Parameters<NonNullable<RuleVisitor['BlockStatement']>>[0];
type SwitchCaseNode = Parameters<NonNullable<RuleVisitor['SwitchCase']>>[0];
type FunctionDeclarationNode = Parameters<NonNullable<RuleVisitor['FunctionDeclaration']>>[0];
type FunctionExpressionNode = Parameters<NonNullable<RuleVisitor['FunctionExpression']>>[0];
type MethodDefinitionNode = Parameters<NonNullable<RuleVisitor['MethodDefinition']>>[0];
type PropertyNode = Extract<
  Parameters<NonNullable<RuleVisitor['Property']>>[0],
  { type: 'Property' }
>;

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

function hasBlockBody(node: ControlFlowNode): boolean {
  const isBlock = (body: unknown) =>
    typeof body === 'object' && body !== null && 'type' in body && body.type === 'BlockStatement';

  switch (node.type) {
    case 'IfStatement':
      return isBlock(node.consequent) || isBlock(node.alternate);
    case 'ForStatement':
    case 'ForInStatement':
    case 'ForOfStatement':
    case 'WhileStatement':
    case 'DoWhileStatement':
      return isBlock(node.body);
    case 'SwitchStatement':
    case 'TryStatement':
      return true;
    default:
      return false;
  }
}

function getStatementSiblings(node: ControlFlowNode) {
  const parent = node.parent;
  if (!parent) return null;

  let statements: AnyNode[] | undefined;
  if (parent.type === 'Program') statements = (parent as ProgramNode).body;
  if (parent.type === 'BlockStatement') statements = (parent as BlockStatementNode).body;
  if (parent.type === 'SwitchCase') statements = (parent as SwitchCaseNode).consequent;

  if (statements) {
    const index = statements.indexOf(node);
    if (index !== -1) return { statements, index };
  }

  return null;
}

function hasBlankLineBetween(lines: string[], previousEndLine: number, nextStartLine: number) {
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
  create(context: RuleContext): RuleVisitor {
    const lines = context.sourceCode.lines;

    function checkPadding(node: ControlFlowNode) {
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

const onlyArrowFunctions = {
  meta: {
    type: 'problem',
    docs: { description: 'Require arrow functions instead of traditional function syntax' },
    schema: [],
    messages: {
      function: 'Use an arrow function instead of traditional function syntax.',
      method: 'Use an arrow function property instead of method syntax.'
    }
  },
  create(context: RuleContext): RuleVisitor {
    const reportFunction = (node: FunctionDeclarationNode | FunctionExpressionNode) => {
      if (node.type === 'FunctionExpression') {
        const parent = node.parent;
        if (
          parent?.type === 'MethodDefinition' ||
          (parent?.type === 'Property' && 'method' in parent && parent.method)
        ) {
          return;
        }
      }

      context.report({ node, messageId: 'function' });
    };

    return {
      FunctionDeclaration: reportFunction,
      FunctionExpression: reportFunction,
      MethodDefinition: (node: MethodDefinitionNode) =>
        context.report({ node, messageId: 'method' }),
      Property: (node: PropertyNode) => {
        if (node.method || node.kind !== 'init') {
          context.report({ node, messageId: 'method' });
        }
      }
    };
  }
};

export default {
  meta: { name: 'aj-webdev-work-tracker' },
  rules: {
    'padding-around-multiline-blocks': paddingAroundMultilineBlocks,
    'only-arrow-functions': onlyArrowFunctions
  }
};

export { onlyArrowFunctions, paddingAroundMultilineBlocks };
