export class MissionAST {
  version: Version;
  variables: Variable[];
  arrays: Array[];
  classes: Class[];
  constructor(
    _version: Version,
    _variables: Variable[],
    _arrays: Array[],
    _classes: Class[]
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

export class Version {
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

export class Variable {
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

export class Array {
  variableName: string;
  data: string[] | number[] | boolean[] | Array[];
  constructor(
    _variableName: string,
    _data: string[] | number[] | boolean[] | Array[]
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }

  toString() {
    return this.variableName + '[]={' + this.data.join() + '};\r\n';
  }
}

export class Class {
  variableName: string;
  variables: Variable[];
  arrays: Array[];
  classes: Class[];
  constructor(
    _variableName: string,
    _variables: Variable[],
    _arrays: Array[],
    _classes: Class[]
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
