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

  onFileChanged(fileChangeEvent: any) {
    const fileReader = new FileReader();
    fileReader.onload = (function(f) {
      return function(readerEvent) {
        this.selectedFile = readerEvent.target.result;
      };
    })(fileChangeEvent.target.files[0]);
    fileReader.readAsText(fileChangeEvent.target.files[0], 'UTF-8');
  }

  ngOnInit() {
    // this.loadFromLocalStorage();
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
    localStorage.setItem(this.localStorageFileName, file)
  }
}
