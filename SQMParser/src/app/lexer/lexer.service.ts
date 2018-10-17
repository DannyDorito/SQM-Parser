import { Injectable } from '@angular/core';

const tokens = [
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
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: 'NUMBER'},
  { regex: /true|false/, tokenType: 'PRIMITIVE_BOOLEAN'},
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)(true|false)/, tokenType: 'BOOLEAN'},
  { regex: /"(?:\\.|[^"])*"/, tokenType: 'PRIMITIVE_STRING'},
  { regex: /(?:\\.|[^"])*(\s*)=(\s*)"(?:\\.|[^"])*"/, tokenType: 'STRING'},
  { regex: /class (?:\\.|[^"])*/, tokenType: 'CLASS'},
  { regex: /(version\s*=\s*)(?:0|[1-9]\d*)/, tokenType: 'VERSION'},
  { regex: /addOns\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/, tokenType: 'ADDONS'},
  { regex: /addOnsAuto\[\]\s*=\s*{[\r\n]*("(?:\\.|[^"])*",[\r\n]*|"(?:\\.|[^"])*")+([\r\n]*};)/, tokenType: 'ADDONS_AUTO'},
  { regex: /#include "(?:\\.|[^"])*"/, tokenType: 'INCLUDE'}
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
    input.forEach(inputElement => {
      tokens.forEach(token => {
        if (token.regex.test(inputElement)) {
          foundTokens.push({ type: token.tokenType, value: inputElement });
        }
      });
    });
    return foundTokens;
  }

  /**
   * Outputs tokens found by the token regex to the console
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
  */
  async getTokensToConsoleRegex(input: string[]): Promise<void> {
    input.forEach(inputElement => {
      tokens.forEach(token => {
        if (token.regex.test(inputElement)) {
          console.log('Found: ' + inputElement + ' Matching: ' + token.tokenType);
        }
      });
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
