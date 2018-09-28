import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  functions = [
    {name: 'Function 1', description: 'description', function: 'execute 1', image: 'edit'},
    {name: 'Function 2', description: 'description', function: 'execute 2', image: 'edit'},
    {name: 'Function 3', description: 'description', function: 'execute 3', image: 'edit'},
    {name: 'Function 4', description: 'description', function: 'execute 4', image: 'edit'},
    {name: 'Function 5', description: 'description', function: 'execute 5', image: 'edit'},
    {name: 'Function 6', description: 'description', function: 'execute 6', image: 'edit'},
    {name: 'Function 7', description: 'description', function: 'execute 7', image: 'edit'},
    {name: 'Function 8', description: 'description', function: 'execute 8', image: 'edit'},
    {name: 'Function 9', description: 'description', function: 'execute 9', image: 'edit'}
  ];

  // use [ngStyle]="newColour()" on an element
  newColour() {
    const myStyles = {
      'background-color': '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')
    };
    return myStyles;
  }
}
