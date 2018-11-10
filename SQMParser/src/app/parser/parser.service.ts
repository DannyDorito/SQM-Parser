import { Injectable } from '@angular/core';
import { Token, Grammar } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { MissionAST, Version, DataType, Variable } from '../shared/ast';

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
        const tokensOnLine: Token[] = [];
        const tokenContens: string[] = [];
        const inputStringArray = inputArray[ inputIndex ].split( ' ' );
        inputStringArray.forEach( inputStr => {
          for ( const tokenRegex of tokensRegex ) {
            const regexResult = tokenRegex.regex.exec( inputStr );
            if ( !isNullOrUndefined( regexResult ) ) {
              if ( tokenRegex.tokenType !== Token.WHITESPACE ) {
                tokensOnLine.push( tokenRegex.tokenType );
                tokenContens.push( regexResult[ 0 ] );
              }
            }
          }
        } );
        const joinedTokens = tokensOnLine.join( '' );
        switch ( joinedTokens ) {
          case Grammar.STRING.toString():
            console.log( 'STRING' );
            ast.dataTypes.push( new DataType( new Variable( tokenContens[ 0 ], tokenContens[ 3 ] ) ) );
            break;

          case Grammar.BOOLEAN.toString():
            console.log( 'BOOLEAN' );
            ast.dataTypes.push( new DataType( new Variable( tokenContens[ 0 ], tokenContens[ 2 ] ) ) );
            break;

          case Grammar.NUMBER.toString():
            console.log( 'NUMBER' );
            ast.dataTypes.push( new DataType( new Variable( tokenContens[ 0 ], tokenContens[ 2 ] ) ) );
            break;

            // case Grammar.START.toString():
            //   console.log( 'START' );

            //   break;

            // case Grammar.END.toString():
            //   console.log( 'END' );

            //  break;

          default:
            // Grammar.ARRAY
            const joinedTokensArray = tokensOnLine.slice( 0, 3 ).join( '' ) + tokensOnLine.slice( ( tokensOnLine.length - 2 ), ( tokensOnLine.length - 1 ) ).join( '' );
            // Grammar.CLASS
            const joinedTokensClass = tokensOnLine.slice( 0, 1 ).join( '' ) + tokensOnLine.slice( ( tokensOnLine.length - 2 ), ( tokensOnLine.length - 1 ) ).join( '' );
            // Grammar.CLASS_WITH_NAME
            const joinedTokensClassName = tokensOnLine.slice( 0, 2 ).join( '' ) + tokensOnLine.slice( ( tokensOnLine.length - 2 ), ( tokensOnLine.length - 1 ) ).join( '' );

            if ( joinedTokensArray === Grammar.ARRAY.toString() ) {
              console.log( 'ARRAY' );
            } else if ( joinedTokensClass === Grammar.CLASS.toString() ) {
              console.log( 'CLASS' );
            } else if ( joinedTokensClassName === Grammar.CLASS_WITH_NAME.toString() ) {
              console.log( 'CLASS_WITH_NAME' );
            } else {
              // console.log( 'NOT FOUND: ' + joinedTokens + ' LINE: ' + (inputIndex + 1) );
            }
            break;
        }
      }
    }
    return ast;
  }

  /**
   * Determins if the passed string matches the "version", "=", int, ";"; regex
   */
  evalVersion( line: string ) {
    return /(version\s*=\s*)[0-99]+;/.test( line );
  }
}
