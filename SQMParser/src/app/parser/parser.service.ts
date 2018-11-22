import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ASTNode, Lexeme } from '../shared/ast';

const tokensRegex = [
  { regex: /true|false/, tokenType: Lexeme.BOOLEAN },
  { regex: /[ \s\t\n\r]+/, tokenType: Lexeme.WHITESPACE },
  { regex: /\[/, tokenType: Lexeme.START_SQUARE_BRACE },
  { regex: /]/, tokenType: Lexeme.END_SQUARE_BRACE },
  { regex: /"/, tokenType: Lexeme.QUOTE },
  { regex: /=/, tokenType: Lexeme.EQUALS },
  { regex: /{/, tokenType: Lexeme.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Lexeme.NUMBER },
  { regex: /}/, tokenType: Lexeme.END_BRACE },
  { regex: /,/, tokenType: Lexeme.COMMA },
  { regex: /^(?!class)([a-zA-Z]+)/, tokenType: Lexeme.STRING },
  { regex: /class/, tokenType: Lexeme.CLASS },
  { regex: /;/, tokenType: Lexeme.SEMICOLON }
];
const symbolTable = [
  { token: Lexeme.STRING, possibleNodes: [Lexeme.EQUALS, Lexeme.START_SQUARE_BRACE, Lexeme.QUOTE]},
  { token: Lexeme.EQUALS, possibleNodes: [Lexeme.STRING, Lexeme.START_BRACE, Lexeme.QUOTE, Lexeme.NUMBER, Lexeme.BOOLEAN]},
  { token: Lexeme.START_BRACE, possibleNodes: [Lexeme.STRING, Lexeme.END_BRACE, Lexeme.QUOTE, Lexeme.NUMBER, Lexeme.BOOLEAN, Lexeme.CLASS]},
  { token: Lexeme.END_BRACE, possibleNodes: [Lexeme.SEMICOLON]},
  { token: Lexeme.START_SQUARE_BRACE, possibleNodes: [Lexeme.END_SQUARE_BRACE]},
  { token: Lexeme.END_SQUARE_BRACE, possibleNodes: [Lexeme.EQUALS]},
  { token: Lexeme.SEMICOLON, possibleNodes: [Lexeme.STRING, Lexeme.END_BRACE]},
  { token: Lexeme.COMMA, possibleNodes: [Lexeme.QUOTE, Lexeme.NUMBER, Lexeme.BOOLEAN]},
  { token: Lexeme.QUOTE, possibleNodes: [Lexeme.STRING, Lexeme.END_BRACE, Lexeme.SEMICOLON, Lexeme.COMMA, Lexeme.QUOTE]},
  { token: Lexeme.NUMBER, possibleNodes: [Lexeme.COMMA]},
  { token: Lexeme.BOOLEAN, possibleNodes: [Lexeme.SEMICOLON, Lexeme.COMMA]},
  { token: Lexeme.CLASS, possibleNodes: [Lexeme.STRING, Lexeme.START_BRACE]}
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
    this.getErrors(ast[0]);
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
    const parseType = () => {
      const node = new ASTNode(lexemes[index], Lexeme.DEFAULT, []);
      for (const tokenRegex of tokensRegex) {
        if (tokenRegex.regex.test(lexemes[index])) {
          node.type = tokenRegex.tokenType;
        }
      }
      index++;
      while (lexemes[index]) {
        node.data.push(parseType());
      }
      return node;
    };

    return parseType();
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
        traverse(node.data[0]);
      }
    };
    traverse(nodeToTraverse);

    return str;
  }

  getErrors(nodeToTraverse: ASTNode) {
    let depth = 0;
    const errors = [];
    const traverse = (node: ASTNode) => {
      if (node) {
        const filtered = symbolTable.filter(symTab => symTab.token === node.type).map(symTab => symTab.possibleNodes);
        if (filtered[0].includes(node.type)) {
          console.log('got');
        } else {
          errors.push({depth: depth, expected: filtered[0]});
          console.log('Found: ' + node.type.toString() + ' wanted: ' + filtered[0].join());
        }
        depth++;
        traverse(node.data[0]);
      } else {
        console.log('undef node');
      }
      traverse(nodeToTraverse);
    };
  }

  /**
   * Split inputString and trim each item
   * Based on:
   * https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/ [Online] Accessed 11th November 2018
   */
  splitString(inputString: string) {
    return inputString.split(' ').map(str => str.trim()).filter(str => str.length);
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
