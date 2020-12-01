import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprasHistorialPage } from './compras-historial.page';

const routes: Routes = [
  {
    path: '',
    component: ComprasHistorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasHistorialPageRoutingModule {}
