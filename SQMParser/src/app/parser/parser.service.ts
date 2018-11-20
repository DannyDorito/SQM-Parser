import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  /**
   * Main method execution function for ParserService
   */
  generateAST(inputFile: string[]) {
    const ast = [];
    for (const inputString of inputFile) {
      const grammar = this.parser(inputString);
      if (!isNullOrUndefined(grammar.val)) {
        ast.push(grammar);
      }
    }
    return ast;
  }

  parser(inputString: string) {
    const lexemes = this.lexer(inputString);
    const DataType = Symbol('datatype');
    const Number = Symbol('number');

    let c = 0;

    const peek = () => lexemes[c];
    const consume = () => lexemes[c++];
    const parseNum = () => ({
      val: String(consume()),
      type: Number
    });

    const parseType = () => {
      const node = {
        val: consume(),
        type: DataType,
        data: []
      };
      while (peek()) {
        node.data.push(parseExpr());
      }
      return node;
    };

    const parseExpr = () => /\d/.test(peek()) ? parseNum() : parseType();
    return parseExpr();
  }

  lexer(inputString: string) {
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
