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
}

export class ASTData {
  data: ASTVariable | ASTArray | ASTClass;
  constructor(
    _data: ASTVariable | ASTArray | ASTClass
  ) {
    this.data = _data;
  }
}

export class ASTVersion {
  versionNumber: string;
  constructor(
    _versionNumber: string
  ) {
    this.versionNumber = _versionNumber;
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
}
