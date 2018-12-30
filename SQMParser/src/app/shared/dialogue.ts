export class DialogueData {
  data: string;
  isChoice: boolean;
  constructor(
    _data: string,
    _isChoice: boolean
  ) {
    this.data = _data;
    this.isChoice = _isChoice;
  }
}
