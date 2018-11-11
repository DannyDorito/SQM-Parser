import { Injectable } from '@angular/core';
import { Token, Grammar } from '../shared/tokens';
import { isNullOrUndefined } from 'util';
import { MissionAST, Version, Variable, Array, Class } from '../shared/ast';

const tokensRegex = [
  { regex: /true|false/, tokenType: Token.BOOLEAN },
  { regex: /[ \s\t\n\r]+/, tokenType: Token.WHITESPACE },
  { regex: /\[/, tokenType: Token.START_SQUARE_BRACE },
  { regex: /]/, tokenType: Token.END_SQUARE_BRACE },
  { regex: /"/, tokenType: Token.QUOTE },
  { regex: /=/, tokenType: Token.EQUALS },
  { regex: /{/, tokenType: Token.START_BRACE },
  { regex: /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/, tokenType: Token.NUMBER },
  { regex: /}/, tokenType: Token.END_BRACE },
  { regex: /,/, tokenType: Token.COMMA },
  { regex: /^(?!class)([a-zA-Z]+)/, tokenType: Token.STRING },
  { regex: /class/, tokenType: Token.CLASS },
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
    return this.generateAST( inputString.split( '\r\n' ) );
  }

  async generateAST( inputArray: string[] ) {
    if ( isNullOrUndefined( inputArray ) ) {
      return new Error( 'ERROR: File is empty!' );
    }
    const ast = new MissionAST( undefined, [], [], [] );
    for ( let inputIndex = 0; inputIndex < inputArray.length; inputIndex++ ) {
      if ( inputIndex === 0 ) {
        if ( this.evalVersion( inputArray[ 0 ] ) ) {
          ast.version = new Version( /[1-9]+/.exec( inputArray[ 0 ] )[ 0 ] );
        } else {
          return new Error( 'ERROR: Cannot find version number on first line of file!' ); // TODO: Return something meaningful
        }
      } else {
        let tokensOnLine = '';
        const inputStringArray = inputArray[ inputIndex ].split( ' ' );
        for ( let i = 0; i < inputStringArray.length; i++ ) {
          for ( const tokenRegex of tokensRegex ) {
            const regexResult = tokenRegex.regex.exec( inputStringArray[ i ] );
            if ( !isNullOrUndefined( regexResult ) ) {
              if ( tokenRegex.tokenType !== Token.WHITESPACE ) {
                tokensOnLine += String(tokenRegex.tokenType);
              }
            }
          }
        }

        if ( tokensOnLine === String(Grammar.STRING) ) {
          // console.log( 'FOUND: STRING' );
          ast.variables.push( new Variable( inputStringArray[ 0 ], inputStringArray[ 3 ] ) );

        } else if ( tokensOnLine === String(Grammar.BOOLEAN) ) {
          // console.log( 'FOUND: BOOLEAN' );
          ast.variables.push( new Variable( inputStringArray[ 0 ], Boolean( inputStringArray[ 2 ] ) ) );

        } else if ( tokensOnLine === String(Grammar.NUMBER) ) {
          // console.log( 'FOUND: NUMBER' );
          ast.variables.push( new Variable( inputStringArray[ 0 ], Number( inputStringArray[ 2 ] ) ) );

        } else if ( tokensOnLine === String(Grammar.ARRAY) ) {
          // console.log( 'FOUND: ARRAY' );
          ast.arrays.push( new Array( inputStringArray[ 0 ], [] ) );

        } else if ( tokensOnLine === String(Grammar.CLASS) ) {
          // console.log( 'FOUND: CLASS' );
          ast.classes.push( new Class( undefined, [], [], [] ) );

        } else if ( tokensOnLine === String(Grammar.CLASS_WITH_NAME) ) {
          // console.log( 'FOUND: CLASS_WITH_NAME' );
          ast.classes.push( new Class( inputStringArray[ 1 ], [], [], [] ) );

        } else if ( tokensOnLine === String(Grammar.START) ) {

        } else if ( tokensOnLine === String(Grammar.END) ) {

        } else {
          console.log( 'ERROR: FOUND ' + tokensOnLine + ' ' + ( inputIndex + 1 ) );

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
