import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: []
})
export class TestsComponent implements OnInit {
  ngOnInit() {
    window.location.href = 'https://dannydorito.github.io/SQM-Parser-GUI-Tests/';
  }
}
