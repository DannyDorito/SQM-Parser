import { Component } from '@angular/core';

@Component( {
  selector: 'app-not-found',
  template: `
  <div>
    <h1>Page Not Found</h1>
    <button [routerLink]="['']">Home</button>
  </div>
  `,
  styleUrls: [ './not-found.component.css' ]
} )
export class NotFoundComponent {}
