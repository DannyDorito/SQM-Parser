import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
  <div>
    <h1 class="unselectable">Page Not Found</h1>
    <button [routerLink]="['']" tab-index="0">Home</button>
  </div>
  `,
  styles: ['div { display: flex;flex-direction: column;height: 100%; justify-content: center;} button { margin-top: 10px; margin-left: auto;} ']
})
export class NotFoundComponent {}
