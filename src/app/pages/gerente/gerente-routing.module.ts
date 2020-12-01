import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerentePage } from './gerente.page';

const routes: Routes = [
  {
    path: '',
    component: GerentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerentePageRoutingModule {}
