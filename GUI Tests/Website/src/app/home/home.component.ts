import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  functions = [
    {name: 'Function 1', description: 'function 1 description', function: 'execute 1'},
    {name: 'Function 2', description: 'function 2 description', function: 'execute 2'},
    {name: 'Function 3', description: 'function 3 description', function: 'execute 3'},
    {name: 'Function 4', description: 'function 4 description', function: 'execute 4'},
    {name: 'Function 5', description: 'function 5 description', function: 'execute 5'},
    {name: 'Function 6', description: 'function 6 description', function: 'execute 6'},
    {name: 'Function 7', description: 'function 7 description', function: 'execute 7'},
    {name: 'Function 8', description: 'function 8 description', function: 'execute 8'},
    {name: 'Function 9', description: 'function 9 description', function: 'execute 9'}
  ];
}
