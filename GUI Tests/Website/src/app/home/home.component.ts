import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFile: any;
  onFileChanged(event: any) {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = function(fileReaderEvent: any) {
      localStorage.setItem('text', fileReaderEvent.target.result);
    };
    this.selectedFile = localStorage.getItem('text');
  }

  ngOnInit() {
    this.selectedFile = localStorage.getItem('text');
  }
}
