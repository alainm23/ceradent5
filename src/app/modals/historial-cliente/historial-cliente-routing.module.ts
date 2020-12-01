import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialClientePage } from './historial-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialClientePageRoutingModule {}
