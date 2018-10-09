import { Component } from '@angular/core';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent  {
  functions1 = [
    {name: 'Function 1', function: 'Execute 1', image: 'edit'},
    {name: 'Function 2', function: 'Execute 2', image: 'edit'},
    {name: 'Function 3', function: 'Execute 3', image: 'edit'}
  ];

  functions2 = [
    {name: 'Function 4', function: 'Execute 4', image: 'edit'},
    {name: 'Function 5', function: 'Execute 5', image: 'edit'},
    {name: 'Function 6', function: 'Execute 6', image: 'edit'}
  ];

  functions3 = [
    {name: 'Function 7', function: 'Execute 7', image: 'edit'},
    {name: 'Function 8', function: 'Execute 8', image: 'edit'},
    {name: 'Function 9', function: 'Execute 9', image: 'edit'}
  ];

  // use [ngStyle]="newColour()" on an element
  newColour() {
    const myStyles = {
      'background-color': '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')
    };
    return myStyles;
  }
}
