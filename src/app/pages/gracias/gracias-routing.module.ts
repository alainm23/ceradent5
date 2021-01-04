import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraciasPage } from './gracias.page';

const routes: Routes = [
  {
    path: '',
    component: GraciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraciasPageRoutingModule {}
