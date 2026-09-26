import type { RuleTester } from 'oxlint/plugins-dev';

type OxlintRule = Parameters<RuleTester['run']>[1];
type RuleCreate = NonNullable<OxlintRule['create']>;
type RuleContext = Parameters<RuleCreate>[0];
type RuleVisitor = ReturnType<RuleCreate>;
type JSXElementNode = Parameters<NonNullable<RuleVisitor['JSXElement']>>[0];
type JSXFragmentNode = Parameters<NonNullable<RuleVisitor['JSXFragment']>>[0];
type JSXChildNode = JSXElementNode['children'][number] | JSXFragmentNode['children'][number];
type JSXParentNode = JSXElementNode | JSXFragmentNode;

const isElement = (node: JSXChildNode): node is JSXElementNode | JSXFragmentNode =>
  node.type === 'JSXElement' || node.type === 'JSXFragment';

const isWhitespaceText = (node: JSXChildNode) =>
  node.type === 'JSXText' && node.value.trim() === '';

const isJSXParent = (node: unknown): node is JSXParentNode =>
  typeof node === 'object' &&
  node !== null &&
  'type' in node &&
  (node.type === 'JSXElement' || node.type === 'JSXFragment');

export const noBlankLinesBetweenJSXElements = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: { description: 'Disallow blank lines between JSX sibling elements' },
    schema: [],
    messages: { blankLine: 'Remove the blank line between these JSX elements.' }
  },
  create(context: RuleContext): RuleVisitor {
    const { sourceCode } = context;
    const lines = sourceCode.lines;
    const newline = sourceCode.text.includes('\r\n') ? '\r\n' : '\n';

    const checkElement = (node: JSXElementNode | JSXFragmentNode) => {
      const parent = node.parent;
      if (!isJSXParent(parent)) return;

      const children = parent.children;
      const index = children.indexOf(node);
      if (index < 0) return;

      let previousIndex = index - 1;
      while (previousIndex >= 0 && isWhitespaceText(children[previousIndex]!)) previousIndex -= 1;
      const previous = children[previousIndex];
      if (!previous || !isElement(previous)) return;

      const intervening = children.slice(previousIndex + 1, index);
      if (!intervening.every(isWhitespaceText)) return;
      if (!lines.slice(previous.loc.end.line, node.loc.start.line - 1).some((line) => !line.trim()))
        return;

      const indent = lines[node.loc.start.line - 1]?.match(/^\s*/)?.[0] ?? '';
      context.report({
        node,
        messageId: 'blankLine',
        fix: (fixer) =>
          fixer.replaceTextRange([previous.range[1], node.range[0]], `${newline}${indent}`)
      });
    };

    return {
      JSXElement: checkElement,
      JSXFragment: checkElement
    };
  }
};
