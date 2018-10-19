import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent implements OnInit {
  text: string;
  closeMessage: string;
  constructor() {  }

  ngOnInit() {
  }

}
