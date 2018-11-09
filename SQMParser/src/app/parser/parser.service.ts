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
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /;/, tokenType: Token.SEMICOLON }
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

  /**
   * ASYNC
   * Based on:
   * http://www.thinksincode.com/2016/10/30/create-a-basic-lexer.html Accessed 16th October 2018
   */
  // getTokensLine( line: string, lineIndex: number ) {
  //   if ( isNullOrUndefined( line ) ) {
  //     return undefined;
  //   }
  //   const foundTokens: FoundToken[] = [];
  //   tokensRegex.forEach( token => {
  //     const regexResult = token.regex.exec( line );
  //     if ( regexResult !== null ) {
  //       if ( token.tokenType !== Token.WHITESPACE) {
  //         foundTokens.push( new FoundToken( token.tokenType, regexResult[ 0 ], lineIndex, regexResult.index ) );
  //       }
  //     }
  //   } );
  //   return foundTokens;
  // }

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
          console.log(ast);
        }
      }  else {

      }
    }
  }
}
