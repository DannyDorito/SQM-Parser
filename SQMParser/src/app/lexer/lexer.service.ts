import { Injectable } from '@angular/core';

const tokens = [
  { regex: /^\s+/, tokenType: 'WHITESPACE' },
  { regex: /^[{}]/, tokenType: 'BRACE' },
  { regex: /^[\[\]]/, tokenType: 'BRACKET' },
  { regex: /^:/, tokenType: 'COLON' },
  { regex: /^,/, tokenType: 'COMMA' },
  // { regex: /[0-9]/, tokenType: 'MISSION'},
  { regex: /(version\s*=\s*)[0-99]/, tokenType: 'VERSION'},
  // { regex: /[0-9]/, tokenType: 'VARIABLE'},
  // { regex: /[0-9]/, tokenType: 'CLASS'},
  // { regex: /[0-9]/, tokenType: 'ARRAY'},
  // { regex: /[0-9]/, tokenType: 'IMPORT'},
  // { regex: /[0-9]/, tokenType: 'DATA_TYPE'},
  // { regex: /[0-9]/, tokenType: 'PRIMITIVE'},
  // { regex: /[0-9]/, tokenType: 'VARIABLE_NAME'},
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: 'NUMBER'},
  // { regex: /[0-9]/, tokenType: 'BOOLEAN'},
  // { regex: /[0-9]/, tokenType: 'STRING'}
];
@Injectable({
  providedIn: 'root'
})
export class LexerService {
  getTokens(input: string[]) {
    const foundTokens = [];
    input.forEach(inputElement => {
      tokens.forEach(token => {
        if (token.regex.test(inputElement)) {
          foundTokens.push({ type: token.tokenType, value: inputElement});
        }
      });
    });
    return foundTokens;
  }

  getTokensToConsole(input: string[]) {
    input.forEach(inputElement => {
      tokens.forEach(token => {
        if (token.regex.test(inputElement)) {
          console.log('Found: "' + inputElement + '", Matching: ' + token.tokenType);
        }
      });
    });
  }
}
