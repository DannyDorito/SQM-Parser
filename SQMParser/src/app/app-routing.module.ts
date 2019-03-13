import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionsComponent } from './functions/functions.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'functions', component: FunctionsComponent },
  { path: '', component: MainComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
