import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent {
  constructor(private homeComponent: HomeComponent) {}

  saveSQM() {
    this.homeComponent.exportSQM('test.sqm'); // TODO: correct file name
  }
}
