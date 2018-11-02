import { Component } from '@angular/core';
import { LexerService } from '../lexer/lexer.service';
import * as FileSaver from 'file-saver';
import { FoundToken } from '../shared/tokens';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private lexer: LexerService) {}
  fileReaderString: string;
  file: string[];
  confirmed = false;
  lexemes: FoundToken[];

  /**
   * Fired when a file has been selected by the user's $event
   * Based on:
   * https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ [Online] Accessed 9th October 2018
   * https://stackoverflow.com/a/27439524 [Online] Accessed 16th October 2018
   * https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html [Online] Accessed 17th October 2018
   */
  onFileChanged(fileChangeEvent: any) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.fileReaderString = fileReader.result as string;
    };
    fileReader.onerror = () => {
      console.log('error loading');
    };
    try {
      fileReader.readAsText(fileChangeEvent.target.files[0]);
    } catch (TypeError) {
      console.log('error loading, type error');
    }
  }

  /**
  * ASYNC
  * Fired when the user clicks the confirm button, main method
  */
  async confirmSelection() {
    this.confirmed = true;
    const parsedFile = <string[]> await this.lexer.parseFile(this.fileReaderString);
    this.file = parsedFile;
    this.fileReaderString = undefined;
    if (!isNullOrUndefined(parsedFile)) {
      if (this.hasVersionRegex(parsedFile[0])) {
      this.lexemes = <FoundToken[]> await this.lexer.getTokens(parsedFile);
      } else {
        console.log('not a sqm file');
      }
    }
  }

  editItem(pos: number) {
    console.log(pos);
  }

  /**
 * Checks input to see if it matches version regex
 */
  hasVersionRegex(input: string) {
    const regex = /(version\s*=\s*)(?:0|[1-9]\d*)/;
    return regex.test(input);
  }

  /**
 * Saves given file to passed fileName, appends .sqm if it does not have it
 * Based on:
 * https://github.com/eligrey/FileSaver.js [Online] Accessed 19th October 2018
 * https://github.com/eligrey/FileSaver.js/issues/308#issuecomment-286127364  [Online] Accessed 20th October 2018
 * https://github.com/eligrey/FileSaver.js/blob/master/README.md#supported-browsers [Online] Accessed 20th October 2018
 */
  saveFile(fileName: string) {
    try {
      const isFileSaverSupported = !!new Blob;
      if (!fileName.includes('.sqm')) {
        fileName += '.sqm';
      }
      FileSaver.saveAs(new Blob(this.file, {type: 'text/plain;charset=utf-8'}), fileName);
    } catch (e) {
      console.log('blobs are not supported by your browser');
    }
  }
}
