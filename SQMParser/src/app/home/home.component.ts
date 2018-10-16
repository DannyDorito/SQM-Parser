import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: any;
  localStorageFileName = 'text';

  onFileChanged(event: any) {
    // Based on: https://www.academind.com/learn/angular/snippets/angular-image-upload-made-easy/ Accessed 9th October 2018
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = function(fileReaderEvent: any) {
      localStorage.setItem('text', fileReaderEvent.target.result);
    };
    this.selectedFile = localStorage.getItem(this.localStorageFileName);
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    if (!isNullOrUndefined(this.selectedFile)) {
      this.selectedFile = localStorage.getItem(this.localStorageFileName);
      return true;
    } else {
      return false;
    }
  }
}
