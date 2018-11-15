import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent {
  constructor(private homeComponent: HomeComponent) {}

  /**
   * ASYNC
   * Calls exportSQM from HomeComponent
   */
  async exportSQM() {
    this.homeComponent.exportSQM();
  }

  /**
   * ASYNC
   * Calls saveSQM from HomeComponent
   */
  async saveSQM() {
    this.homeComponent.saveSQM();
  }
}
