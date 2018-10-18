import { Injectable } from '@angular/core';

const tokens = [
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: 'NUMBER'},
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)(true|false);/, tokenType: 'BOOLEAN'},
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)"(?:\\.|[^"])*";/, tokenType: 'STRING'},
  { regex: /(?:\\.|[^"])+\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*"|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?,[\r\n]*|[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|true,[\r\n]*|true|false,[\r\n]*|false)+([\r\n]*})/, tokenType: 'ARRAY'},
  { regex: /class (?:\\.|[^"])*/, tokenType: 'CLASS'},
  // { regex: /(version\s*=\s*)(?:0|[1-9]\d*);/, tokenType: 'VERSION'},
  // { regex: /addOns\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: 'ADDONS'},
  // { regex: /addOnsAuto\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/i, tokenType: 'ADDONS_AUTO'},
  { regex: /#include "(?:\\.|[^"])*"/, tokenType: 'INCLUDE'}
];
const primitives = [
  { regex: /^\s+/, tokenType: 'WHITESPACE' },
  { regex: /[\r\n]+/, tokenType: 'EOL' },
  { regex: /^[{]/, tokenType: 'START_BRACE' },
  { regex: /^[}]/, tokenType: 'END_BRACE' },
  { regex: /^[};]/, tokenType: 'END_BRACE_SEMICOLON' },
  { regex: /^[\[\]]/, tokenType: 'SQUARE_BRACKET' },
  { regex: /;$/, tokenType: 'SEMICOLON' },
  { regex: /=/, tokenType: 'EQUALS' },
  { regex: /^,/, tokenType: 'COMMA' },
  { regex: /,$/, tokenType: 'TRAILING_COMMA' },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: 'PRIMITIVE_NUMBER'},
  { regex: /true|false/, tokenType: 'PRIMITIVE_BOOLEAN'},
  { regex: /"(?:\\.|[^"])*"/, tokenType: 'PRIMITIVE_STRING'},
];
@Injectable({
  providedIn: 'root'
})
export class LexerService {
  /**
   * Returns {type: x, value: y} found by the 'tokens' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  getTokensRegex(input: string[]) {
    const foundTokens = [];
    let index = 0;
    input.forEach(inputElement => {
      tokens.forEach(token => {
        const regexResult = token.regex.exec(inputElement);
        if (regexResult !== null) {
          const newToken = new FoundToken(token.tokenType, regexResult, index);
          foundTokens.push(newToken);
        }
      });
      index++;
    });
    return foundTokens;
  }

  /**
   * Asynchronously outputs tokens found by the token regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getTokensToConsoleRegex(input: string[]): Promise<void> {
    let index = 0;
    input.forEach(inputElement => {
      tokens.forEach(token => {
        const regexResult = token.regex.exec(inputElement);
        if (regexResult !== null) {
          regexResult.forEach(result => {
            if (result !== '') {
              console.log('Found: ' + token.tokenType + ' Matching: ' + result.toString() + ' Index: ' + index);
            }
          });
        }
      });
      index++;
    });
  }

  /**
   * Returns {type: x, value: y} found by the 'primitives' regex
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  getPrimitivesRegex(input: string[]) {
    const foundPrimitives = [];
    let index = 0;
    input.forEach(inputElement => {
      primitives.forEach(primitive => {
        const regexResult = primitive.regex.exec(inputElement);
        if (regexResult !== null) {
          const newToken = new FoundToken(primitive.tokenType, regexResult, index);
          foundPrimitives.push(newToken);
        }
      });
      index++;
    });
    return foundPrimitives;
  }

  /**
   * Asynchronously outputs primitives found by the primitives regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getPrimitivesToConsoleRegex(input: string[]): Promise<void> {
    let index = 0;
    input.forEach(inputElement => {
      primitives.forEach(primitive => {
        const regexResult = primitive.regex.exec(inputElement);
        if (regexResult !== null) {
          regexResult.forEach(result => {
            if (result !== '') {
              console.log('Found: ' + primitive.tokenType + ' Matching: ' + result.toString() + ' Index: ' + index);
            }
          });
        }
      });
      index++;
    });
  }

  /**
   * Checks input to see if it matches version regex
   */
  hasVersionRegex(input: string) {
    const regex = /(version\s*=\s*)(?:0|[1-9]\d*)/;
    return regex.test(input);
  }
}

export class FoundToken {
  type: string;
  value: RegExpExecArray;
  index: number;
  constructor(
    _type: string,
    _value: RegExpExecArray,
    _index: number
  ) {
    this.type = _type;
    this.value = _value;
    this.index = _index;
  }
}
