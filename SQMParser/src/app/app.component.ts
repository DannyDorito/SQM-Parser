import { Component } from '@angular/core';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
} )
export class AppComponent {
  isOptions = false;
  isOptionsText = 'Options';

  changeView() {
    if ( this.isOptions ) {
      this.isOptions = false;
      this.isOptionsText = 'Options';
    } else {
      this.isOptions = true;
      this.isOptionsText = 'Functions';
    }
  }
}
