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

  // Based on: https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ Accessed 9th October 2018
  onFileChanged(fileChangeEvent: any) {
    const fileReader = new FileReader();
    // Based on: https://stackoverflow.com/a/27439524 Accessed 16th October 2018
    fileReader.onload = (function(f) {
      return function(readerEvent) {
        this.selectedFile = readerEvent.target.result;
      };
    })(fileChangeEvent.target.files[0]);
    fileReader.readAsText(fileChangeEvent.target.files[0], 'UTF-8');
    const vars = [' ', '1.111', '5.0800736e-008', ',', ':', '[', 'version=53', '{'];
    this.lexer.getTokensToConsole(vars);
  }

  ngOnInit() {
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
