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
}

export class DataType {
  data: Variable | Class | Array;
  constructor(
    _data: Variable | Class | Array
  ) {
    this.data = _data;
  }
}

export class Version {
  versionNumber: number;
  constructor(
    _versionNumber: number
  ) {
    this.versionNumber = _versionNumber;
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
}
