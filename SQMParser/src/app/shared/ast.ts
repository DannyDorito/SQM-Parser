export class MissionAST {
  version: ASTVersion;
  variables: ASTVariable[];
  arrays: ASTArray[];
  classes: ASTClass[];
  constructor(
    _version: ASTVersion,
    _variables: ASTVariable[],
    _arrays: ASTArray[],
    _classes: ASTClass[]
  ) {
    this.version = _version;
    this.variables = _variables;
    this.arrays = _arrays;
    this.classes = _classes;
  }

  toString() {
    // return this.version.toString() + this.dataTypes.toString();
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
    return 'version=' + this.versionNumber + ';';
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
    if (typeof String === this.data) {
      return this.variableName + '="' + this.data + '";\r\n';
    } else {
      return this.variableName + '=' + this.data + ';\r\n';
    }
  }
}

export class ASTArray {
  variableName: string;
  data: string[] | number[] | boolean[] | ASTArray[];
  constructor(
    _variableName: string,
    _data: string[] | number[] | boolean[] | ASTArray[]
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }

  toString() {
    return this.variableName + '[]={' + this.data.join() + '};\r\n';
  }
}

export class ASTClass {
  variableName: string;
  variables: ASTVariable[];
  arrays: ASTArray[];
  classes: ASTClass[];
  constructor(
    _variableName: string,
    _variables: ASTVariable[],
    _arrays: ASTArray[],
    _classes: ASTClass[]
  ) {
    this.variableName = _variableName;
    this.variables = _variables;
    this.arrays = _arrays;
    this.classes = _classes;
  }

  toString() {
    if ( this.variableName !== '' ) {
      // return 'class ' + this.variableName + '\r\n{\r\n' + this.dataTypes.toString() + '\r\n};\r\n';
    } else {
      // return 'class\r\n{\r\n' + this.dataTypes.toString() + '\r\n};\r\n';
    }
  }
}
