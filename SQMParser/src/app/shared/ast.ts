import { isNullOrUndefined } from 'util';

export class ASTMission {
  version: ASTVersion;
  data: ASTData[];
  constructor(
    _version: ASTVersion,
    _data: ASTData[],
  ) {
    this.version = _version;
    this.data = _data;
  }

  /**
   * Append object to end of ASTMission.data
   * Based on:
   * https://stackoverflow.com/a/1693066 [Online] Accessed 12th November 2018
   */
  append( itemToAppend: ASTVariable | ASTArray | ASTClass, depth: number ) {
    if ( depth > 0 ) {
      this[ this.data.length - 1 ].append( itemToAppend, ( depth - 1 ) );
    } else {
      this.data.push( new ASTData( itemToAppend ) );
    }
    return this;
  }

  toString() {
    return this.version.toString() + this.data.join( '' );
  }
}

export class ASTData {
  data: ASTVariable | ASTArray | ASTClass;
  constructor(
    _data: ASTVariable | ASTArray | ASTClass
  ) {
    this.data = _data;
  }

  toString() {
    return this.data.toString();
  }
}

export class ASTVersion {
  versionNumber: string;
  constructor(
    _versionNumber: string
  ) {
    this.versionNumber = _versionNumber;
  }

  toString() {
    return 'version=' + this.versionNumber + ';\r\n';
  }
}

export class ASTVariable {
  variableName: string;
  data: string | number | boolean;
  constructor(
    _variableName: string,
    _data: string | number | boolean
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }

  toString() {
    if ( this.data === typeof String ) {
      return this.variableName + '="' + this.data.toString() + '"';
    } else {
      return this.variableName + '=' + this.data.toString();
    }
  }
}

export class ASTArray {
  variableName: string;
  data: ASTVariable | ASTArray;
  constructor(
    _variableName: string,
    _data: ASTVariable | ASTArray
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }

  toString() {
    return this.variableName + '[]={' + this.data.toString() + '};\r\n';
  }
}

export class ASTClass {
  variableName: string;
  data: ASTVariable | ASTArray | ASTClass;
  constructor(
    _variableName: string,
    _data: ASTVariable | ASTArray | ASTClass
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }

  toString() {
    if ( isNullOrUndefined( this.variableName ) || this.variableName === '' ) {
      return 'class\r\n{\r\n' + this.data.toString() + '\r\n};\r\n';
    } else {
      return 'class ' + this.variableName + '\r\n{\r\n' + this.data.toString() + '\r\n};\r\n';
    }
  }
}
