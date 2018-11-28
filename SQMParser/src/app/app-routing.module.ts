import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FunctionsComponent } from './functions/functions.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TestsComponent } from './tests/tests.component';

const routes: Routes = [
  { path: 'functions', component: FunctionsComponent },
  { path: 'test', component: TestsComponent },
  { path: '', component: AppComponent },
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
