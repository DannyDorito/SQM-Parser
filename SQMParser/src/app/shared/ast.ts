export class ASTNumber {
  value: string;
  type: symbol;

  constructor(
    _value: string,
    _type: symbol
  ) {
    this.value = _value;
    this.type = _type;
  }
}

export class ASTNode {
  value: string;
  type: symbol;
  data: any[];

  constructor(
    _value: string,
    _type: symbol,
    _data: any[]
  ) {
    this.value = _value;
    this.type = _type;
    this.data = _data;
  }
}
