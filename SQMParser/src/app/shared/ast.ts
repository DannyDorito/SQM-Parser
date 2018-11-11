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
}

export class ASTData {
  data: ASTVariable | ASTArray | ASTClass;
  constructor (
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
  constructor (
    _variableName: string,
    _data: ASTVariable | ASTArray | ASTClass
  ) {
    this.variableName = _variableName;
    this.data = _data;
  }
}
