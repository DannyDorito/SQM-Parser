import { Injectable } from '@angular/core';
import { Token } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { MissionAST, Version } from '../shared/ast';

const tokensRegex = [
  { regex: /[a-zA-Z]+([a-zA-Z0-9_:-])*/, tokenType: Token.STRING },
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[\s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /\]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /\"/, tokenType: Token.QUOTE },
  { regex: /\=/, tokenType: Token.EQUALS },
  { regex: /\{/, tokenType: Token.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /\}/, tokenType: Token.END_BRACE },
  { regex: /\,/, tokenType: Token.COMMA },
  { regex: /\;/, tokenType: Token.SEMICOLON }
];
@Injectable( {
  providedIn: 'root'
} )
export class ParserService {
  /**
   * ASYNC
   * Main method execution function for ParserService
   */
  async execute( inputString: string ) {
    const tree = < MissionAST[] > await this.generateAST( inputString.split( '\r\n' ) );
    // const grammars = this.findGrammars( tree );
    // return tree;
  }


  async generateAST( fileArray: string[] ) {
    if (isNullOrUndefined(fileArray)) {
      return undefined;
    }
    const ast = new MissionAST(undefined, undefined);
    for (let a = 0; a < fileArray.length; a++) {
      if (a === 0) {
        if (/version( )*=[1-9]+;/.test(fileArray[0])) {
          const regexResult = /[1-9]+/.exec(fileArray[0]); // TODO: should be tokenRegex.number or [1-9]+
          ast.version = new Version(Number(regexResult[0]));
        }
      } else {
        const splitLine = fileArray[a].split(' ');
        splitLine.forEach(_splitLine => {
          tokensRegex.forEach(tokenRegex => {
            const regexResult = tokenRegex.regex.exec(_splitLine);
            if (regexResult !== null) {
              console.log(regexResult[0]);
            }
          });
        });
      }
    }
  }
}
