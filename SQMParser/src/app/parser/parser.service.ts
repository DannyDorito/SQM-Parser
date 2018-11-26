import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ASTNode, Token } from '../shared/ast';

const tokensRegex = [
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[ \s\t\n\r]+/, tokenType: Token.WHITESPACE },
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
  async generateAST(inputFile: string[]) {
    const ast: ASTNode[] = [];
    for (const inputString of inputFile) {
      const grammar = < ASTNode > await this.parser(inputString);
      if (!isNullOrUndefined(grammar.value)) {
        ast.push(grammar);
      }
    }
    return ast;
  }

  /**
   * ASYNC
   * Splits the input string into an array, tests Lexeme regex against it
   * if successful, set the type
   * Based on:
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.79-80. Accessed 21st November 2018
   * https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/ [Online] Accessed 11th November 2018
   */
  async parser(inputString: string) {
    const lexemes = this.splitString(inputString);
    let index = 0;
    const containingTypes: Token[] = [];
    const parseType = () => {
      const newNode = new ASTNode(lexemes[index], Token.DEFAULT, undefined);
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
   * Traverse a passed ASTNode, return a string of the value of each node traversed
   * Based on:
   * Compilers: Principles, Techniques, and Tools (2nd Edition) pp.56-68. Accessed 21st November 2018
   */
  traverseNodeValue(nodeToTraverse: ASTNode) {
    if (isNullOrUndefined(nodeToTraverse)) {
      return '';
    }
    let str = '';
    const traverse = (node: ASTNode) => {
      if (node) {
        str += node.value;
        traverse(node.innerNode);
      }
    };
    traverse(nodeToTraverse);
    return str;
  }

  /**
   * Find missing semicolons and braces in a given missionAST
   */
  findErrors(missionAST: ASTNode[]) {
    for (let nodeIndex = 0; nodeIndex < missionAST.length; nodeIndex++) {
      const first = missionAST[nodeIndex].containingTypes[0];
      const last = missionAST[nodeIndex].containingTypes[(missionAST[nodeIndex].containingTypes.length - 1)];
      if (first !== Token.CLASS) {
        if (last !== Token.START_BRACE) {
          if (last !== Token.SEMICOLON) {
            missionAST[nodeIndex].error = 'Missing: ' + Token.SEMICOLON + ': ' + nodeIndex + ',' + missionAST[nodeIndex].containingTypes.length + '!';
          }
        }
      } else {
        if (!isNullOrUndefined(missionAST[(nodeIndex + 1)])) {
          if (missionAST[(nodeIndex + 1)].containingTypes[0] !== Token.START_BRACE) {
            missionAST[nodeIndex].error = 'Missing: ' + Token.START_BRACE + ' on line ' + (nodeIndex + 1) + '!';
          }
        }
      }
    }
    return missionAST;
  }

  /**
   * Produces tokens to lexically analyse
   * Split the input string on terminals [ \s\t\n\r\[\]"={},;] globally with a positive lookahead
   * then map the results by trimming and filterting by length.
   * Based on:
   * https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/ [Online] Accessed 11th October 2018
   * https://stackoverflow.com/a/650037 [Online] Accessed 23rd November 2018
   * https://stackoverflow.com/a/12001989 [Online] Accessed 23rd November 2018
   */
  splitString(inputString: string) {
    return inputString.split(/(?=[ \s\t\n\r\[\]\"\=\{\}\,\;]+)/g).map(str => str.trim()).filter(str => str.length);
  }

  /**
   * Removes first occurrence of a string from a given string
   * Based on:
   * https://www.w3resource.com/javascript-exercises/javascript-string-exercise-26.php [Online] Accessed 12th November 2018
   */
  removeOccurrence(str: string, stringToFind: string) {
    const strIndex = str.indexOf(stringToFind);
    // if there is no occurrences
    if (strIndex === -1) {
      return str;
    }
    return str.slice(0, strIndex) + str.slice(strIndex + stringToFind.length);
  }
}
