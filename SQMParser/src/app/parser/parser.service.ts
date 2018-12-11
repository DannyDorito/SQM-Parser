import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { TreeNode, Token } from '../shared/shared';

const tokensRegex = [
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[\+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][\+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /^(?!class)([a-zA-Z]+)/, tokenType: Token.STRING },
  { regex: /class/, tokenType: Token.CLASS },
  { regex: /;/, tokenType: Token.SEMICOLON }
];
@Injectable({
  providedIn: 'root'
})
export class ParserService {
  /**
   * ASYNC
   * Main method execution function for ParserService
   */
  async generateTree(inputFile: string[]) {
    const tree: TreeNode[] = [];
    for (const inputString of inputFile) {
      const grammar = < TreeNode > await this.parser(inputString);
      if (!isNullOrUndefined(grammar.value)) {
        tree.push(grammar);
      }
    }
    return tree;
  }

  /**
   * ASYNC
   * Splits the input string into an array, tests Lexeme regex against it
   * if successful, set the type
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.79-80. Accessed 21st November 2018
   * https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/ [Online] Accessed 11th November 2018
   */
  async parser(inputString: string) {
    const lexemes = this.splitString(inputString);
    let index = 0;
    const containingTypes: Token[] = [];
    const parseType = () => {
      const newNode = new TreeNode(lexemes[index], Token.DEFAULT, undefined);
      for (const tokenRegex of tokensRegex) {
        if (tokenRegex.regex.test(lexemes[index])) {
          newNode.nodeType = tokenRegex.tokenType;
          containingTypes.push(tokenRegex.tokenType);
          break;
        }
      }
      index++;
      while (lexemes[index]) {
        newNode.innerNode = parseType();
      }
      return newNode;
    };
    const node = parseType();
    node.containingTypes = containingTypes;
    return node;
  }

  /**
   * Traverse a passed tree, return a string of the value of each node traversed
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.56-68. Accessed 21st November 2018
   */
  traverseNodeValue(nodeToTraverse: TreeNode) {
    if (isNullOrUndefined(nodeToTraverse)) {
      return '';
    }
    let str = '';
    const traverse = (node: TreeNode) => {
      if (node) {
        str += node.value;
        traverse(node.innerNode);
      }
    };
    traverse(nodeToTraverse);
    return str;
  }

  /**
   * Find missing semicolons and braces in a given missionTree
   */
  findErrors(missionTree: TreeNode[]) {
    for (let nodeIndex = 0; nodeIndex < missionTree.length; nodeIndex++) {
      const first = missionTree[nodeIndex].containingTypes[0];
      const last = missionTree[nodeIndex].containingTypes[(missionTree[nodeIndex].containingTypes.length - 1)];
      if (first !== Token.CLASS) {
        if (last !== Token.START_BRACE && last !== Token.COMMA) {
          if (last !== Token.SEMICOLON && missionTree[nodeIndex].containingTypes[1] !== Token.START_SQUARE_BRACE) {
            missionTree[nodeIndex].error = 'Missing: ' + Token.SEMICOLON + ' at the end of line ' + (nodeIndex + 1) + '!';
          }
        }
      } else {
        if (!isNullOrUndefined(missionTree[(nodeIndex + 1)])) {
          if (missionTree[(nodeIndex + 1)].containingTypes[0] !== Token.START_BRACE) {
            missionTree[nodeIndex].error = 'Missing: ' + Token.START_BRACE + ' at the start of line ' + (nodeIndex + 2) + '!';
          }
        }
      }
      if (missionTree[nodeIndex].containingTypes.includes(Token.DEFAULT)) {
        missionTree[nodeIndex].error = 'Unrecognised Token on line ' + (nodeIndex + 1) + '!';
      }
    }
    return missionTree;
  }

  /**
   * Produces tokens to lexically analyse
   * Split the input string on terminals [ \s\t\n\r\[\]"={},;] globally with a positive lookahead
   * then map the results by trimming and filterting by length.
   */
  splitString(inputString: string) {
    return inputString.split(/(?=[ \s\t\n\r\[\]\"\=\{\}\,\;]+)/g).map(str => str.trim()).filter(str => str.length);
  }
}
