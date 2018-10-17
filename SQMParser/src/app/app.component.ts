import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOptions = false;

  ngOnInit() {
    if (!this.hasLocalStorage('SQM_hasOptions')) {
      localStorage.setItem('SQM_hasOptions', 'y');
    }
  }

  changeView() {
    if (this.isOptions) {
      this.isOptions = false;
    } else {
      this.isOptions = true;
    }
  }

  hasLocalStorage(accessor: string) {
    const storageItem = localStorage.getItem(accessor);
    console.log(localStorage.getItem(accessor));
    if (storageItem === null) {
      return false;
    } else {
      return true;
    }
  }
}
