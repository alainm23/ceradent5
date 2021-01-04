import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosOrdenPage } from './datos-orden.page';

const routes: Routes = [
  {
    path: '',
    component: DatosOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosOrdenPageRoutingModule {}
