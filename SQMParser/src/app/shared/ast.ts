export class AST {
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
  primitive: Primitive;
  constructor(
    _variableName: string,
    _primitive: Primitive
  ) {
    this.variableName = _variableName;
    this.primitive = _primitive;
  }
}

export class Primitive {
  data: string | Array | number | boolean;
  constructor(
    _data: string | Array | number | boolean
  ) {
    this.data = _data;
  }
}

export class Array {
  variableName: string;
  primitives: Primitive[];
  constructor(
    _variableName: string,
    _primitives: Primitive[]
  ) {
    this.variableName = _variableName;
    this.primitives = _primitives;
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
