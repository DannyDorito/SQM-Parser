import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { OptionsComponent } from './options/options.component';
import { FunctionsComponent } from './functions/functions.component';
import { HomeComponent } from './home/home.component';
import { TestsComponent } from './tests/tests.component';

const routes: Routes = [
  { path: 'functions', component: FunctionsComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'test', component: TestsComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];
@NgModule( {
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
} )
export class AppRoutingModule {}
