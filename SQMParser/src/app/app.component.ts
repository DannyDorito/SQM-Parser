import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOptions = false;

  ngOnInit() {
    if (!this.hasLocalStorage('sqm_hasOptions')) {
      localStorage.setItem('sqm_hasOptions', 'true');
    }
  }

  changeOptions() {
    if (this.isOptions) {
      this.isOptions = false;
    } else {
      this.isOptions = true;
    }
  }

  hasLocalStorage(accessor: string) {
    const storageItem = localStorage.getItem(accessor);
    if (storageItem === '') {
      return false;
    } else {
      return true;
    }
  }
}
