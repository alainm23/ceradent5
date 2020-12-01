import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialPagoPage } from './historial-pago.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialPagoPageRoutingModule {}
