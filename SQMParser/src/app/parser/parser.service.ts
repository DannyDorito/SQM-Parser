import { Injectable } from '@angular/core';
import { Token } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { MissionAST, Version } from '../shared/ast';

const tokensRegex = [
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[ \s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /[a-zA-Z]+([a-zA-Z])*/, tokenType: Token.STRING },
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
    const tree = < MissionAST > await this.generateAST( inputString.split( '\r\n' ) );
    // const grammars = this.findGrammars( tree );
    // return tree;
  }

  async generateAST( inputArray: string[] ) {
    if ( isNullOrUndefined( inputArray ) ) {
      return undefined; // TODO: Return something meaningful
    }
    const ast = new MissionAST( undefined, [] );
    for ( let inputIndex = 0; inputIndex < inputArray.length; inputIndex++ ) {
      if ( inputIndex === 0 ) {
        if ( this.evalVersion( inputArray[ 0 ] ) ) {
          const regexResult = /[1-9]+/.exec( inputArray[ 0 ] ); // TODO: should be tokenRegex.number or [1-9]+
          ast.version = new Version( Number( regexResult[ 0 ] ) );
        } else {
          return undefined; // TODO: Return something meaningful
        }
      } else {
        const inputStringArray = inputArray[ inputIndex ].split( ' ' );
        inputStringArray.forEach( inputStr => {
          const tokensOnLine: Token[] = [];
          for ( const tokenRegex of tokensRegex ) {
            const regexResult = tokenRegex.regex.exec( inputStr );
            if ( !isNullOrUndefined( regexResult ) ) {
              if ( tokenRegex.tokenType !== Token.WHITESPACE ) {
                tokensOnLine.push( tokenRegex.tokenType );
              } else if ( regexResult[ 0 ] === 'class' ) {
                // special case for classes
              }
              break; // Break if found regex match
            }
          }
        } );
      }
    }
    return ast;
  }

  /**
   * Determins if the passed string matches the "version", "=", int, ";"; regex
   */
  evalVersion( line: string ) {
    return /version( )*=[1-9]+;/.test( line );
  }
}
