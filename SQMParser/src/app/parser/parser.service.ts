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
  { regex: /[\+-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /^(?!class)([a-zA-Z]+)/, tokenType: Token.STRING },
  { regex: /class/, tokenType: Token.CLASS },
  { regex: /;/, tokenType: Token.SEMICOLON }
];
const symbolTable = [
  { token: Token.STRING, possibleNodes: [Token.EQUALS, Token.START_SQUARE_BRACE, Token.QUOTE]},
  { token: Token.EQUALS, possibleNodes: [Token.STRING, Token.START_BRACE, Token.QUOTE, Token.NUMBER, Token.BOOLEAN]},
  { token: Token.START_BRACE, possibleNodes: [Token.STRING, Token.END_BRACE, Token.QUOTE, Token.NUMBER, Token.BOOLEAN, Token.CLASS]},
  { token: Token.END_BRACE, possibleNodes: [Token.SEMICOLON]},
  { token: Token.START_SQUARE_BRACE, possibleNodes: [Token.END_SQUARE_BRACE]},
  { token: Token.END_SQUARE_BRACE, possibleNodes: [Token.EQUALS]},
  { token: Token.SEMICOLON, possibleNodes: [Token.STRING, Token.CLASS]},
  { token: Token.COMMA, possibleNodes: [Token.QUOTE, Token.NUMBER, Token.BOOLEAN]},
  { token: Token.QUOTE, possibleNodes: [Token.STRING, Token.END_BRACE, Token.SEMICOLON, Token.COMMA, Token.QUOTE]},
  { token: Token.NUMBER, possibleNodes: [Token.COMMA, Token.SEMICOLON, Token.END_BRACE]},
  { token: Token.BOOLEAN, possibleNodes: [Token.SEMICOLON, Token.COMMA]},
  { token: Token.CLASS, possibleNodes: [Token.STRING, Token.START_BRACE]}
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
    let ast: ASTNode[] = [];
    for (const inputString of inputFile) {
      const grammar = < ASTNode > await this.parser(inputString);
      if (!isNullOrUndefined(grammar.value)) {
        ast.push(grammar);
      }
    }
    ast = this.findErrors(ast);
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
      const newNode = new ASTNode(lexemes[index], Token.DEFAULT, []);
      for (const tokenRegex of tokensRegex) {
        if (tokenRegex.regex.test(lexemes[index])) {
          newNode.type = tokenRegex.tokenType;
          containingTypes.push(tokenRegex.tokenType);
          break;
        }
      }
      index++;
      while (lexemes[index]) {
        newNode.data.push(parseType());
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
        traverse(node.data[0]);
      }
    };
    traverse(nodeToTraverse);
    return str;
  }

  findErrors(missionAST: ASTNode[]) {
    for (const astNode of missionAST) {
      for (let index = 0; index < astNode.containingTypes.length; index++) {
        const next = () => astNode.containingTypes[(index + 1)];
        const current = () => astNode.containingTypes[index];
        const possibleTypes = this.getPossibleTokens(current());
        if (!isNullOrUndefined(possibleTypes) && !isNullOrUndefined(next())) {
          if (!possibleTypes.includes(next())) {
            console.log('current: ' + current().toString());
            console.log('next: ' + next().toString());
            console.log('Wanted: ' + possibleTypes.join());
            console.log(' ');
            astNode.hasError = true;
          }
        }
      }
    }
    return missionAST;
  }

  getPossibleTokens(type: Token) {
    for (const symbol of symbolTable) {
      if (symbol.token === type) {
        return symbol.possibleNodes;
      }
    }
    return undefined;
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
    return inputString.split(/(?=[ \s\t\n\r\[\]"={},;]+)/g).map(str => str.trim()).filter(str => str.length);
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
