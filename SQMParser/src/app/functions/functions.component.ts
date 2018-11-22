import { Component } from '@angular/core';
import { SaverService } from '../saver/saver.service';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent {
  constructor(private saver: SaverService) {}

  /**
   * ASYNC
   * Calls exportSQM from HomeComponent
   */
  async exportSQM() {
    // TODO: Export
  }

  /**
   * ASYNC
   * Calls saveSQM from HomeComponent
   */
  async saveSQM() {
    // TODO: save
  }

  /**
   * Calls clearSQM from HomeComponent
   */
  clearSQM() {
    this.saver.clearSQM();
  }
}
