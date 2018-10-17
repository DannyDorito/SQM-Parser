import { Component, OnInit } from '@angular/core';
import { LexerService } from '../lexer/lexer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: any;
  localStorageFileName = 'text';

  constructor(private lexer: LexerService) {}

  ngOnInit() {
    // const vars = [' ', '5.0800736e-008', 'word,', ':', '[', 'version=53;', '{', 'false', '"string"'];
    // this.lexer.getTokensToConsole(vars);
  }

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
      this.selectedFile = fileReader.result;
      this.parseFile(this.selectedFile);
    };
    fileReader.readAsText(fileChangeEvent.target.files[0], 'UTF-8');
    // console.log(this.lexer.hasVersion(this.selectedFile));
  }

  /**
   * Asynchronously trims each element of array
   * Based on:
   * https://www.textfixer.com/tutorials/javascript-line-breaks.php Accessed 17th October 2018
   */
  async parseFile(fileString: string) {
    const fileArray = fileString.split('\n');
    fileArray.forEach(element => {
      // element = element.trim();
      element = element.replace(/(\r\n|\n|\r)/gm, ' ');
    });
    return fileArray;
  }

  loadFromLocalStorage() {
    if (this.selectedFile !== null && this.selectedFile !== '') {
      this.selectedFile = localStorage.getItem(this.localStorageFileName);
      return true;
    } else {
      return false;
    }
  }

  saveLocalStorage(file: any) {
    localStorage.setItem(this.localStorageFileName, file);
  }
}
