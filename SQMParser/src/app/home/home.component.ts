import { Component } from '@angular/core';
import { LexerService } from '../lexer/lexer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private lexer: LexerService) {}

  /**
   * Fired when a file has been selected by the user's $event
   * Based on:
   * https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ Accessed 9th October 2018
   * https://stackoverflow.com/a/27439524 Accessed 16th October 2018
   * https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html Accessed 17th October 2018
   */
  onFileChanged(fileChangeEvent: any) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const parsedFile = this.parseFile(fileReader.result as string);
      if (this.lexer.hasVersionRegex(parsedFile[0])) {
        console.log(this.lexer.getTokensFor(parsedFile));
      } else {
        console.log('not a sqm file');
      }
    };
    fileReader.onerror = () => {
      console.log('error loading');
    };
    fileReader.readAsText(fileChangeEvent.target.files[0]);
  }

  /**
   * Trims each element of array
   * Based on:
   * https://www.textfixer.com/tutorials/javascript-line-breaks.php Accessed 17th October 2018
   */
  parseFile(fileString: string) {
    const fileArray = fileString.split('\r\n');
    fileArray.forEach(element => {
      element = element.trim();
    });
    return fileArray;
  }
}
