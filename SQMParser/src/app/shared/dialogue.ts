export class DialogueData {
  data: string;
  type: DialogueType;

  constructor(
    _data: string,
    _type: DialogueType
  ) {
    this.data = _data;
    this.type = _type;
  }
}

export enum DialogueType {
  DEFAULT,
  FIX_ERRORS,
  DELETE
}
