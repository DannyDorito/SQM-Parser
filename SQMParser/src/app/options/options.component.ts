import { Component, ViewChild, OnInit } from '@angular/core';

@Component( {
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: [ './options.component.css' ]
} )
export class OptionsComponent implements OnInit {
  @ViewChild( OptionsComponent ) options;

  saveLocalStorage: boolean;

  toggleLocalStorage() {
    this.saveLocalStorage = !this.saveLocalStorage;
    localStorage.setItem( 'sqmSaveLocalStorage', this.saveLocalStorage.toString() );
  }

  ngOnInit() {
    this.saveLocalStorage = Boolean( localStorage.getItem( 'sqmSaveLocalStorage' ) );
  }
}
