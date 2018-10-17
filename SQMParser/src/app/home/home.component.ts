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

  /** Fired when a file has been selected by the user's $event
   * Based on:
   * https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ Accessed 9th October 2018
   * https://stackoverflow.com/a/27439524 Accessed 16th October 2018
   */
  onFileChanged(fileChangeEvent: any) {
    const fileReader = new FileReader();
    fileReader.onload = (function(f: any) {
      return function(readerEvent: any) {
        this.selectedFile = readerEvent.target.result;
      };
    })(fileChangeEvent.target.files[0]);

    fileReader.readAsText(fileChangeEvent.target.files[0], 'UTF-8');

    const vars = ['version=53;'];
    // console.log(this.lexer.hasVersion(this.selectedFile));
    console.log(this.lexer.hasVersion(vars));

  }

  parseFile(file: string) {
    const split = file.split('\n');
    console.log(split);
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
