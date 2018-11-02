import { FoundToken } from './tokens';

export class FileTree {
  contents: string;
  line: number;
  lexemes: FoundToken[];
  isEditing: boolean;
  constructor(
    _contents: string,
    _line: number,
    _lexemes: FoundToken[]
  ) {
    this.contents = _contents;
    this.line = _line;
    this.lexemes = _lexemes;
    this.isEditing = false;
  }
}
