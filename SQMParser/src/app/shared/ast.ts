export class MissionAST {
  version: Version;
  dataTypes: DataType[];
  constructor(
    _version: Version,
    _dataTypes: DataType[]
  ) {
    this.version = _version;
    this.dataTypes = _dataTypes;
  }

  toString() {
    return this.version.toString() + this.dataTypes.toString();
  }
}

export class DataType {
  data: Variable | Class | Array;
  constructor(
    _data: Variable | Class | Array
  ) {
    this.data = _data;
  }

  toString() {
    return this.data + '\r\n';
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
  data: string;
  constructor(
    _variableName: string,
    _data: string
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }

  toString() {
    return this.variableName + '=' + this.data + ';\r\n';
  }
}

export class Array {
  variableName: string;
  data: string[];
  constructor(
    _variableName: string,
    _data: string[]
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
  dataTypes: DataType[];
  constructor(
    _variableName: string,
    _dataTypes: DataType[]
  ) {
    this.variableName = _variableName;
    this.dataTypes = _dataTypes;
  }

  toString() {
    if ( this.variableName !== '' ) {
      return 'class ' + this.variableName + '\r\n{\r\n' + this.dataTypes.toString() + '\r\n};\r\n';
    } else {
      return 'class\r\n{\r\n' + this.dataTypes.toString() + '\r\n};\r\n';
    }
  }
}
