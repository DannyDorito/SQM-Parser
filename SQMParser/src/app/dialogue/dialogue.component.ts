import { Component } from '@angular/core';

@Component( {
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: [ './dialogue.component.css' ]
} )
export class DialogueComponent {
  text: string;
  closeMessage: string;
}
