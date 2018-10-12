import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {
  functions = [
    {name: 'Function 1', function: 'Execute 1', image: 'edit'},
    {name: 'Function 2', function: 'Execute 2', image: 'edit'},
    {name: 'Function 3', function: 'Execute 3', image: 'edit'},
    {name: 'Function 4', function: 'Execute 4', image: 'edit'},
    {name: 'Function 5', function: 'Execute 5', image: 'edit'},
    {name: 'Function 6', function: 'Execute 6', image: 'edit'},
    {name: 'Function 7', function: 'Execute 7', image: 'edit'},
    {name: 'Function 8', function: 'Execute 8', image: 'edit'},
    {name: 'Function 9', function: 'Execute 9', image: 'edit'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
