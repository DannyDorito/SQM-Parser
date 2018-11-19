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
  append(itemToAppend: ASTVariable | ASTArray | ASTClass, depth: number) {
    if (depth > 0) {
      this.append(itemToAppend, (depth - 1));
    } else {
      this.data.push(new ASTData(itemToAppend));
    }
    return this;
  }

  toString() {
    if (!isNullOrUndefined(this.version) && !isNullOrUndefined(this.data)) {
      return this.version.toString() + this.data.join('');
    } else {
      return '';
    }
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
    if (!isNullOrUndefined(this.data)) {
      return this.data.toString();
    } else {
      return '';
    }
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
    if (!isNullOrUndefined(this.versionNumber)) {
      return 'version=' + this.versionNumber + ';\r\n';
    } else {
      return '';
    }
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
    if (!isNullOrUndefined(this.data) && !isNullOrUndefined(this.variableName)) {
      if (typeof this.data === 'string') {
        return this.variableName + '="' + this.data.toString() + '";';
      } else {
        return this.variableName + '=' + this.data.toString() + ';';
      }
    } else {
      return '';
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
    if (!isNullOrUndefined(this.data) && !isNullOrUndefined(this.variableName)) {
      return this.variableName + '[]={' + this.data.toString() + '};\r\n';
    } else {
      return '';
    }
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
    if (isNullOrUndefined(this.variableName) || this.variableName === '') {
      if (!isNullOrUndefined(this.data)) {
        return 'class\r\n{\r\n' + this.data.toString() + '\r\n};\r\n';
      } else {
        return '';
      }
    } else {
      if (!isNullOrUndefined(this.data)) {
        return 'class ' + this.variableName + '\r\n{\r\n' + this.data.toString() + '\r\n};\r\n';
      } else {
        return '';
      }
    }
  }
}
